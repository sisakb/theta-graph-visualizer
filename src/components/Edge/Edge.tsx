// Edge component
import { useMemo, useState } from "react"
import { ArgEdge } from "../../ArgGraph"
import styles from "./Edge.module.scss"

interface EdgeProps {
	from: HTMLElement
	to: HTMLElement
	label?: string
	index: number
	maxIndex: number
	graphId: string
	edge: ArgEdge
}

const Edge = ({ from, to, index, maxIndex, edge }: EdgeProps) => {
	const { label, labels } = edge
	const [hovered, setHovered] = useState(false)

	const fromPos = useMemo(
		() => ({
			x: from.offsetLeft + from.offsetWidth / 2 + (index - maxIndex / 2) * 20 + 10,
			y: from.offsetTop + from.offsetHeight,
		}),
		[from, index]
	)

	const toPos = useMemo(
		() => ({
			x: to.offsetLeft + to.offsetWidth / 2,
			y: to.offsetTop,
		}),
		[to]
	)

	const angle = useMemo(
		() => Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x),
		[fromPos, toPos]
	)

	return (
		<>
			<div
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				className={`${styles.edge} ${hovered ? styles.hovered : ""}`}
				style={{
					position: "absolute",
					left: fromPos.x,
					top: fromPos.y,
					width: Math.sqrt(
						Math.pow(toPos.x - fromPos.x, 2) +
							Math.pow(toPos.y - fromPos.y, 2)
					),
					transform: `translateY(-10px) rotate(${angle}rad)`,
					transformOrigin: "0 50%",
				}}
			>
				<div className={styles.line}></div>
				<div className={styles.arrowTop}></div>
				<div className={styles.arrowBottom}></div>
			</div>
			{label && <div
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				className={styles.edgeLabel}
				style={{
					left: fromPos.x + (toPos.x - fromPos.x) / 2,
					top:
						fromPos.y +
						(toPos.y - fromPos.y) / 2 +
						(index - maxIndex / 2) * 20 - 15,
					transform: "translateX(-50%)",
				}}
			>
				{labels.map((l) => (
					<div key={l}>{l}</div>
				))}
			</div>}
		</>
	)
}

export default Edge
