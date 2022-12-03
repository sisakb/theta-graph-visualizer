// Node component

import { useMemo } from "react"
import { ArgNode } from "../../ArgGraph"
import { NodeDrawing } from "../../ArgTreeDrawer"
import styles from "./Node.module.scss"

interface NodeProps {
	nodeDrawing: NodeDrawing
	graphId: string
	onHover: (node: ArgNode | null) => void
	hovered: boolean
	selected: boolean
	onSelect: (node: ArgNode | null) => void
}

const Node = ({ nodeDrawing, graphId, onHover, hovered, selected, onSelect }: NodeProps) => {
	const { node } = nodeDrawing
	const { stateName, predicates } = node

	return (
		<div
			id={`${graphId}-${node.id}`}
			className={`${styles.nodeContainer} ${
				node.isInitial ? styles.initial : ""
			} ${hovered ? styles.hovered : ""} ${selected ? styles.selected : ""}`}
			style={{
				position: "absolute",
				left: nodeDrawing.x * 110 + 20,
				top: nodeDrawing.y === 0 ? 0 : (nodeDrawing.y - 1) * 150 + 110,
			}}
			onMouseEnter={() => onHover(node)}
			onMouseLeave={() => onHover(null)}
			onClick={() => onSelect(node)}
		>
			{!node.isInitial && (
				<div className={`${styles.node} ${node.isError ? styles.errorNode : ""}`}>
					{stateName}
					<div className={styles.predicates}>
						{predicates.map((p) => (
							<div key={p}>{p}</div>
						))}
					</div>
				</div>
			)}
			{node.isInitial && <div className={styles.initialNode}></div>}
		</div>
	)
}

export default Node
