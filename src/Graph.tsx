// Graph component

import { useEffect, useMemo, useState } from "react"
import ArgGraph, { ArgNode } from "./ArgGraph"
import ArgTreeDrawer from "./ArgTreeDrawer"
import Edge from "./components/Edge/Edge"
import Node from "./components/Node/Node"
import { IJSONGraph } from "./IJSONGraph"

interface GraphProps {
	graph: IJSONGraph
	id: string
	name?: string
	hoveredNode: ArgNode | null
	setHoveredNode: (node: ArgNode | null) => void
	selectedNode: ArgNode | null
	setSelectedNode: (node: ArgNode | null) => void
}

const Graph = ({
	graph,
	id,
	name,
	hoveredNode,
	setHoveredNode,
	selectedNode,
	setSelectedNode,
}: GraphProps) => {
	const argGraph = useMemo(() => new ArgGraph(graph), [graph])
	const treeDrawing = useMemo(() => new ArgTreeDrawer(argGraph), [argGraph])

	const [nodeDomElements, setNodeDomElements] = useState(
		new Map<string, HTMLElement>()
	)
	const [nodeBoundingBoxes, setNodeBoundingBoxes] = useState(
		new Map<string, DOMRect>()
	)

	useEffect(() => {
		const nodeDomElements = new Map<string, HTMLElement>()
		const nodeBoundingBoxes = new Map<string, DOMRect>()
		for (const nodeDrawing of treeDrawing.nodes.values()) {
			const nodeElement = document.querySelector(
				`#${id}-${nodeDrawing.node.id}`
			) as HTMLElement
			if (nodeElement) {
				nodeDomElements.set(nodeDrawing.node.id, nodeElement)
				nodeBoundingBoxes.set(
					nodeDrawing.node.id,
					nodeElement.getBoundingClientRect()
				)
			}
		}
		setNodeDomElements(nodeDomElements)
		setNodeBoundingBoxes(nodeBoundingBoxes)
	}, [argGraph, treeDrawing])

	const width = Math.max(
		...[...nodeDomElements.values()].map(
			(b) => b.offsetLeft + b.offsetWidth
		),
		0
	)
	const height = Math.max(
		...[...nodeDomElements.values()].map(
			(b) => b.offsetTop + b.offsetHeight
		),
		0
	)

	return (
		<>
			<div
				style={{
					display: "inline-block",
					position: "relative",
					minWidth: width + 20,
					margin: "10px",
					border: "1px dashed rgba(0,0,0,0.5)",
					height: height + 20,
				}}
			>
				<div
					style={{
						padding: "10px",
						width: "100%",
						backgroundColor: "rgba(0,0,0,0.2)",
						backdropFilter: "blur(5px)",
						fontFamily: "monospace",
						position: "sticky",
						top: -1,
						zIndex: 5,
					}}
				>
					{name || id}
				</div>
				{[...treeDrawing.nodes.values()].map((drawingNode, index) => (
					<Node
						hovered={
							hoveredNode?.hasSameRouteFromRoot(
								drawingNode.node
							) ?? false
						}
						onHover={setHoveredNode}
						selected={
							selectedNode?.hasSameRouteFromRoot(
								drawingNode.node
							) ?? false
						}
						onSelect={node => setSelectedNode(selectedNode === node ? null : node)}
						nodeDrawing={drawingNode}
						key={index}
						graphId={id}
					/>
				))}

				{argGraph.edges
					.map((edge, key) => {
						const siblingEdges = argGraph.edges
							.filter(
								(e) => e.source === edge.source && !e.backtrack
							)
							.sort((a, b) => a.label.localeCompare(b.label))
						const index = siblingEdges.indexOf(edge)
						const maxIndex = siblingEdges.length
						const from = nodeDomElements.get(edge.source.id)
						const to = nodeDomElements.get(edge.target.id)
						if (!from || !to) return null
						return (
							<Edge
								key={key}
								from={from}
								to={to}
								label={edge.label}
								index={index}
								maxIndex={maxIndex}
								graphId={id}
								edge={edge}
							/>
						)
					})}
			</div>
		</>
	)
}

export default Graph
