import { IJSONEdge, IJSONGraph, IJSONNode } from "./IJSONGraph"

export class ArgEdge {
	public readonly source: ArgNode
	public readonly target: ArgNode
	public readonly label: string
	public readonly backtrack: boolean
	public readonly labels: string[] = [] 

	public constructor(jsonEdge: IJSONEdge, source: ArgNode, target: ArgNode) {
		this.source = source
		this.target = target
		this.label = jsonEdge.label || ""
		this.backtrack = jsonEdge.metadata?.style === "DASHED"
		if (this.label) {
			const [_, labels] = this.label?.match(/\(CfaAction\s*\((.*)\)\)/) ?? []
			if (labels) {
				this.labels = labels.replace(/\)\s*\(/g, ";").trim().split(";").map(label => {
					const assumeMatch = label.match(/assume\s*\((.*)\)/)
					if (assumeMatch) {
						const assumeContent = assumeMatch[1]
						const matches = assumeContent.match(/(<=|<|>|>=)\s(.*)\s(.*)/)
						if (matches) {
							const [_, operator, left, right] = matches
							return `[${assumeContent.replace(_, `${left} ${operator} ${right}`)}]`
						} else {
							return `[${assumeContent}]`
						}
						//const [_, operator, left, right] = assumeMatch
						//return `[${left} ${operator} ${right}]`
					}
					const assignMatch = label.match(/assign\s*(.*)\s*\((\+|-|\/|\*)\s(.*)\s(.*)\)/)
					if (assignMatch) {
						const [_, variable, operator, left, right] = assignMatch
						return `${variable} = ${left} ${operator} ${right}`
					}
					return label
				})
			}

		}
	}
}

enum ArgNodeType {
	Default,
	Initial,
	Error,
	Conclusion,
}

export class ArgNode {
	public readonly id: string
	public readonly label: string
	public readonly outEdges: ArgEdge[] = []
	public readonly inEdges: ArgEdge[] = []
	public readonly metadata: { [key: string]: string } = {}
	private type: ArgNodeType = ArgNodeType.Default
	
	public readonly stateName: string
	public readonly predicates: string[] = []

	public constructor(id: string, jsonNode: IJSONNode) {
		this.id = id
		this.label = jsonNode.label || ""
		this.metadata = jsonNode.metadata || {}

		const [_, name, predicates] = this.label?.match(/\(CfaState\s(.*)\s\(PredState(.*)\)\)/) ?? []
		this.stateName = name?.trim() ?? ""
		if (this.stateName === "ERR") {
			this.type = ArgNodeType.Error
		}
		this.predicates = predicates?.replace(/\)\s*\(/g, ";").trim().slice(1, -1).split(";") ?? []
		this.predicates = this.predicates.map((predicate) => {
			const matches = predicate.match(/(<=|<|>|>=)\s(.*)\s(.*)/)
			if (matches) {
				const [_, operator, left, right] = matches
				return predicate.replace(_, `${left} ${operator} ${right}`)
			} else {
				return predicate
			}
		})
	}

	public addOutEdge(edge: ArgEdge): void {
		this.outEdges.push(edge)
	}

	public addInEdge(edge: ArgEdge): void {
		this.inEdges.push(edge)
	}

	set isInitial(value: boolean) {
		this.type = value ? ArgNodeType.Initial : ArgNodeType.Default
	}
	get isInitial(): boolean {
		return this.type === ArgNodeType.Initial
	}
	get isError(): boolean {
		return this.type === ArgNodeType.Error
	}
	public getType(): ArgNodeType {
		return this.type
	}

	get parent(): ArgNode | null {
		return this.inEdges.find((edge) => !edge.backtrack)?.source ?? null
	}

	get routeFromRoot(): ArgEdge[] {
		const parentEdge = this.inEdges.find((edge) => !edge.backtrack)
		if (!parentEdge) {
			return []
		}
		const parent = parentEdge?.source
		if (parent.isInitial) {
			return []
		} else {
			return [parentEdge, ...parentEdge.source.routeFromRoot]
		}
	}

	public hasSameRouteFromRoot(other: ArgNode): boolean {
		const route = this.routeFromRoot
		const otherRoute = other.routeFromRoot
		if (route.length !== otherRoute.length) {
			return false
		}
		return route.every((edge, index) => edge.label === otherRoute[index].label)
	}

	get children(): ArgNode[] {
		return this.outEdges.filter((edge) => !edge.backtrack).map((edge) => edge.target).sort((a, b) => a.label.localeCompare(b.label)) ?? []
	}

	get isLeftmost(): boolean {
		return this.isInitial || this.parent?.children[0] === this
	}
	get previousSibling(): ArgNode | null {
		const siblings = this.parent?.children
		const index = siblings?.indexOf(this) ?? 0
		return siblings?.at(index - 1) ?? null
	}
	get nextSibling(): ArgNode | null {
		const siblings = this.parent?.children
		const index = siblings?.indexOf(this) ?? 0
		return siblings?.at(index + 1) ?? null
	}
	get leftMostSibling(): ArgNode | null {
		return this.parent?.children[0] ?? null
	}
}

class ArgGraph {
	public readonly nodes: Map<string, ArgNode> = new Map()
	public readonly edges: ArgEdge[] = []
	public readonly root: ArgNode

	public constructor(jsonGraph: IJSONGraph) {
		Object.keys(jsonGraph.nodes).forEach((id) => {
			const jsonNode = jsonGraph.nodes[id]
			const argNode = new ArgNode(id, jsonNode)
			this.nodes.set(id, argNode)
		})

		jsonGraph.edges.forEach((jsonEdge) => {
			const source = this.nodes.get(jsonEdge.source)
			const target = this.nodes.get(jsonEdge.target)
			if (!source || !target) throw new Error("Invalid edge")

			const argEdge = new ArgEdge(jsonEdge, source, target)
			this.edges.push(argEdge)

			source.addOutEdge(argEdge)
			target.addInEdge(argEdge)
		})

		this.root = this.findRootNode()
		this.root.isInitial = true
	}

	private findRootNode(): ArgNode {
		const rootNodes = [...this.nodes.values()].filter(
			(node) => node.inEdges.length === 0
		)
		if (rootNodes.length !== 1)
			throw new Error("Invalid graph. Multiple root nodes found")

		return rootNodes[0]
	}

	public preOrderTraverse(
		callback: (node: ArgNode, level: number) => void,
		node: ArgNode = this.root,
		level = 0
	): void {
		callback(node, level)
		node.outEdges
			.filter((edge) => !edge.backtrack)
			.forEach((edge) => this.preOrderTraverse(callback, edge.target, level + 1))
	}

	public postOrderTraverse(
		callback: (node: ArgNode) => void,
		node: ArgNode = this.root
	): void {
		node.outEdges
			.filter((edge) => !edge.backtrack)
			.forEach((edge) => this.postOrderTraverse(callback, edge.target))
		callback(node)
	}
}

export default ArgGraph
