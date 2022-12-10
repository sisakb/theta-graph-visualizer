/* eslint-disable @typescript-eslint/no-non-null-assertion */
import ArgGraph, { ArgNode } from "./ArgGraph"

export interface NodeDrawing {
	x: number
	y: number
	node: ArgNode
	mod: number
}

class ArgTreeDrawer {
	public readonly nodes: Map<string, NodeDrawing> = new Map()

	private readonly nodeSize = 1.5
	private readonly siblingDistance = 0
	private readonly treeDistance = 0

	public constructor(private readonly argGraph: ArgGraph) {
		this.initNodes(argGraph.root, 0)
		this.calculateInitialX(argGraph.root)
		this.checkAllChildrenOnScreen(argGraph.root)
		this.calculateFinalPositions(argGraph.root, 0)
	}

	private initNodes(node: ArgNode, level: number) {
		this.nodes.set(node.id, { node, x: -1, y: level, mod: 0 })
		for (const child of node.children) {
			this.initNodes(child, level + 1)
		}
	}

	private calculateInitialX(node: ArgNode): void {
		for (const child of node.children) {
			this.calculateInitialX(child)
		}

		const drawingNode = this.getDrawingNode(node.id)

		if (node.children.length === 0) {
			if (!node.isLeftmost)
				drawingNode.x =
					this.getDrawingNode(node.previousSibling!.id).x +
					this.nodeSize +
					this.siblingDistance
			else drawingNode.x = 0
		} else if (node.children.length === 1) {
			if (node.isLeftmost) {
				drawingNode.x = this.getDrawingNode(node.children[0].id).x
			} else {
				drawingNode.x =
					this.getDrawingNode(node.previousSibling!.id).x +
					this.nodeSize +
					this.siblingDistance
				drawingNode.mod =
					drawingNode.x - this.getDrawingNode(node.children[0].id).x
			}
		} else {
			const leftmostChild = this.getDrawingNode(node.children[0].id)
			const rightmostChild = this.getDrawingNode(
				node.children[node.children.length - 1].id
			)
			const mid = (leftmostChild.x + rightmostChild.x) / 2
			if (node.isLeftmost) {
				drawingNode.x = mid
			} else {
				drawingNode.x =
					this.getDrawingNode(node.previousSibling!.id).x +
					this.nodeSize +
					this.siblingDistance
				drawingNode.mod = drawingNode.x - mid
			}
		}
		if (node.children.length > 0 && !node.isLeftmost) {
			this.checkForConflicts(node)
		}
	}

	private checkForConflicts(node: ArgNode): void {
		const drawingNode = this.getDrawingNode(node.id)
		const minDistance = this.treeDistance + this.nodeSize
		let shiftValue = 0
		const nodeContour = new Map<number, number>()
		this.getLeftContour(node, 0, nodeContour)

		let sibling: ArgNode | null = node.leftMostSibling
		while (sibling !== null && sibling !== node) {
			const siblingContour = new Map<number, number>()
			this.getRightContour(sibling, 0, siblingContour)

			for (
				let level = drawingNode.y + 1;
				level <=
				Math.min(
					Math.max(...siblingContour.keys()),
					Math.max(...nodeContour.keys())
				);
				level++
			) {
				const distance =
					nodeContour.get(level)! - siblingContour.get(level)!
				if (distance + shiftValue < minDistance) {
					shiftValue = minDistance - distance
				}
			}

			if (shiftValue > 0) {
				drawingNode.x += shiftValue
				drawingNode.mod += shiftValue

				this.centerNodesBetween(sibling, node)

				shiftValue = 0
			}

			sibling = sibling.nextSibling
		}
	}

	private centerNodesBetween(leftNode: ArgNode, rightNode: ArgNode) {
		const leftDrawingNode = this.getDrawingNode(leftNode.id)
		const rightDrawingNode = this.getDrawingNode(rightNode.id)
		const leftIndex = leftNode.parent!.children.indexOf(leftNode)
		const rightIndex = rightNode.parent!.children.indexOf(rightNode)

		const numNodesBetween = rightIndex - leftIndex - 1

		if (numNodesBetween > 0) {
			const distanceBetween =
				(leftDrawingNode.x - rightDrawingNode.x) / (numNodesBetween + 1)
			let count = 1
			for (let i = leftIndex + 1; i < rightIndex; i++) {
				const middleNode = leftNode.parent!.children[i]
				const middleDrawingNode = this.getDrawingNode(middleNode.id)
				const desiredX = rightDrawingNode.x + distanceBetween * count
				const offset = desiredX - middleDrawingNode.x
				middleDrawingNode.x += offset
				middleDrawingNode.mod += offset

				count++
			}
			this.checkForConflicts(leftNode)
		}
	}

	private checkAllChildrenOnScreen(node: ArgNode) {
		const drawingNode = this.getDrawingNode(node.id)
		const nodeContour = new Map<number, number>()
		this.getLeftContour(node, 0, nodeContour)

		let shiftValue = 0
		for (const y of nodeContour.keys()) {
			if (nodeContour.get(y)! + shiftValue < 0) {
				shiftValue = nodeContour.get(y)! * -1
			}
		}

		if (shiftValue > 0) {
			drawingNode.x += shiftValue
			drawingNode.mod += shiftValue
		}
	}

	private calculateFinalPositions(node: ArgNode, modSum: number): void {
		const drawingNode = this.getDrawingNode(node.id)
		drawingNode.x += modSum
		modSum += drawingNode.mod

		for (const child of node.children) {
			this.calculateFinalPositions(child, modSum)
		}

		if (node.children.length === 0) {
			// pass
		}
	}

	private getDrawingNode(id: string) {
		const node = this.nodes.get(id)
		if (!node) throw new Error("Invalid node")
		return node
	}

	private getLeftContour(
		node: ArgNode,
		modSum: number,
		values: Map<number, number>
	): void {
		const drawingNode = this.getDrawingNode(node.id)
		if (!values.has(drawingNode.y))
			values.set(drawingNode.y, drawingNode.x + modSum)
		else
			values.set(
				drawingNode.y,
				Math.min(values.get(drawingNode.y)!, drawingNode.x + modSum)
			)

		modSum += drawingNode.mod
		for (const child of node.children) {
			this.getLeftContour(child, modSum, values)
		}
	}

	private getRightContour(
		node: ArgNode,
		modSum: number,
		values: Map<number, number>
	): void {
		const drawingNode = this.getDrawingNode(node.id)
		if (!values.has(drawingNode.y))
			values.set(drawingNode.y, drawingNode.x + modSum)
		else
			values.set(
				drawingNode.y,
				Math.max(values.get(drawingNode.y)!, drawingNode.x + modSum)
			)

		modSum += drawingNode.mod
		for (const child of node.children) {
			this.getRightContour(child, modSum, values)
		}
	}
}

export default ArgTreeDrawer
