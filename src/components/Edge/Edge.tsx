// Edge component
import { Box, Button, Typography } from "@mui/material"
import { useMemo, useState } from "react"
import { ArgEdge } from "../../util/ArgGraph"
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
		() => (!edge.backtrack ? {
			x: from.offsetLeft + from.offsetWidth / 2 + (index - maxIndex / 2) * 20 + 10,
			y: from.offsetTop + from.offsetHeight,
		} : {
			x: from.offsetLeft + from.offsetWidth / 2 - 30,
			y: from.offsetTop,
		}),
		[from, index]
	)

	const toPos = useMemo(
		() => (!edge.backtrack ? {
			x: to.offsetLeft + to.offsetWidth / 2,
			y: to.offsetTop,
		} : {
			x: to.offsetLeft + to.offsetWidth / 2 + (index - maxIndex / 2) * 20 + 10 - 30,
			y: to.offsetTop + to.offsetHeight,
		}),
		[to]
	)

	const angle = useMemo(
		() => Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x),
		[fromPos, toPos]
	)

	const lineWidth = 2

	return (
		<>
			<Box
				className={`edge ${styles.edge} ${hovered ? styles.hovered : ""} ${edge.backtrack ? styles.dashed : ""}`}
				sx={{
					position: "absolute",
					left: fromPos.x,
					top: fromPos.y,
					width: Math.sqrt(
						Math.pow(toPos.x - fromPos.x, 2) +
							Math.pow(toPos.y - fromPos.y, 2)
					),
					transform: `translateY(-10px) rotate(${angle}rad)`,
					transformOrigin: "0 50%",
					opacity: 0.6,
					"& .line": {
						background: theme => edge.backtrack ? `repeating-linear-gradient(
							90deg,
							${theme.palette.grey[700]} 0%,
							${theme.palette.grey[700]} 10%,
							transparent 10%,
							transparent 20%
						)` : theme.palette.primary.main,
						position: "absolute",
						width: "100%",
						height: `${lineWidth}px`,
						top: "50%",
						left: 0,
						transform: "translateY(-50%)",
					},
					"& .arrowTop": {
						position: "absolute",
						width: `${lineWidth * 8}px`,
						height: `${lineWidth}px`,
						right: 0,
						transform: "translateY(9px) rotate(30deg)",
						transformOrigin: "right",
						background: theme => edge.backtrack ? theme.palette.grey[700] : theme.palette.primary.main,
					},
					"& .arrowBottom": {
						position: "absolute",
						width: `${lineWidth * 8}px`,
						height: `${lineWidth}px`,
						right: 0,
						transform: "translateY(9px) rotate(-30deg)",
						transformOrigin: "right",
						background: theme => edge.backtrack ? theme.palette.grey[700] : theme.palette.primary.main,
					},
				}}
			>
				<div className="line"></div>
				<div className="arrowTop"></div>
				<div className="arrowBottom"></div>
			</Box>
			{label && <Button
				sx={{
					left: fromPos.x + (toPos.x - fromPos.x) / 2,
					top:
						fromPos.y +
						(toPos.y - fromPos.y) / 2 - 20,
					transform: "translateX(-50%)",
					textTransform: "none",
					position: "absolute",
					"&:hover": {
						backdropFilter: "blur(10px)",
					},
					zIndex: 10
				}}
				className="label"
			>
				<Typography variant="body2" sx={{
					lineHeight: 1,
					mb: -0.5,
					mt: -0.2,
					p: 0.5,
					
				}} color="text.secondary">
					{labels.map((l) => (
						<div key={l}>{l}</div>
					))}
				</Typography>
			</Button>}
		</>
	)
}

export default Edge
