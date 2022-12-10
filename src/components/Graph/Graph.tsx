// Graph component

import { useEffect, useMemo, useState } from "react"
import ArgGraph, { ArgNode } from "../../util/ArgGraph"
import ArgTreeDrawer from "../../util/ArgTreeDrawer"
import Edge from "../Edge/Edge"
import Node from "../Node/Node"
import { IJSONGraph } from "../../IJSONGraph"
import styles from "./Graph.module.scss"

interface GraphProps {
	graph: IJSONGraph
	id: string
}

const Graph = ({
	graph,
	id,
}: GraphProps) => {
	const argGraph = useMemo(() => new ArgGraph(graph), [graph])
	const treeDrawing = useMemo(() => new ArgTreeDrawer(argGraph), [argGraph])

	const [nodeDomElements, setNodeDomElements] = useState(
		new Map<string, HTMLElement>()
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
	}, [argGraph, treeDrawing])

	const width = useMemo(() => Math.max(
		...[...nodeDomElements.values()].map(
			(b) => b.offsetLeft + b.offsetWidth
		),
		0
	), [nodeDomElements])
	const height = useMemo(() => Math.max(
		...[...nodeDomElements.values()].map(
			(b) => b.offsetTop + b.offsetHeight
		),
		0
	), [nodeDomElements])

	return (
		<>
			<div
				className={styles.graph}
				style={{
					minWidth: width + 20,
					height: height + 20,
				}}
			>
				{[...treeDrawing.nodes.values()].map((drawingNode, index) => (
					<Node
						nodeDrawing={drawingNode}
						key={index}
						graphId={id}
					/>
				))}

				{argGraph.edges.map((edge, key) => {
					const siblingEdges = argGraph.edges
						.filter((e) => e.source === edge.source && !e.backtrack)
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
