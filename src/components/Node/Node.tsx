// Node component

import { Box, Button, Stack, Typography } from "@mui/material"
import { useMemo } from "react"
import { NodeDrawing } from "../../util/ArgTreeDrawer"
import { useSelector } from "../../util/store"
import styles from "./Node.module.scss"

interface NodeProps {
	nodeDrawing: NodeDrawing
	graphId: string
	iteration: number
}

const predicatesEqualOrNegated = (p1: string, p2: string) => p1 === p2 || p1 === `not (${p2})` || p2 === `not (${p1})`

const Node = ({ nodeDrawing, graphId, iteration }: NodeProps) => {
	const { node } = nodeDrawing
	const { stateName, predicates } = node

	const hovered = false

	const selectedPrecision = useSelector((store) => store.selectedPrecision)
	const containsSelectedPrecision = useMemo(() => selectedPrecision && predicates.some(p => predicatesEqualOrNegated(selectedPrecision, p)), [selectedPrecision, predicates])
	const showErrorTrace = useSelector((store) => store.showErrorTrace)
	const {node: selectedNode, iteration: selectedIteration} = useSelector((store) => store.selectedNode) || {}
	const setSelectedNode = useSelector((store) => store.setSelectedNode)

	const selected = useMemo(() => {
		if (!selectedNode || !selectedIteration) return false
		if (iteration === selectedIteration) return (selectedNode.id === node.id)
		const labelsMatch = selectedNode.stateName === stateName

		return labelsMatch
	}, [selectedIteration, selectedNode, stateName, iteration])

	return (
		<div
			id={`${graphId}-${node.id}`}
			className={`${styles.nodeContainer} ${
				node.isInitial ? styles.initial : ""
			} ${hovered ? styles.hovered : ""} ${
				selected ? styles.selected : ""
			}`}
			style={{
				position: "absolute",
				left: nodeDrawing.x * 110 + 20,
				top: nodeDrawing.y === 0 ? 0 : (nodeDrawing.y - 1) * 150 + 110,
			}}
			onMouseEnter={() => setSelectedNode({node, iteration})}
			onMouseLeave={() => setSelectedNode(null)}
		>
			{!node.isInitial && (
				<Button
					sx={{
						width: "100%",
						height: "80px",
						overflow: "hidden",
						alignItems:
							predicates.length > 3 ? "flex-start" : "center",
						"&:hover": {
							overflow: "visible",
							height: "auto",
							minHeight: "80px",
							zIndex: 999,
							backdropFilter: "blur(100px)",
							backgroundColor: containsSelectedPrecision ? theme => `${theme.palette.secondary.main}70` : undefined,
							border: containsSelectedPrecision ? theme => `1px solid ${theme.palette.secondary.main}` : undefined,
						},
						border: containsSelectedPrecision  ? theme => `1px solid ${theme.palette.secondary.main}` : undefined,
						backgroundColor: containsSelectedPrecision ? theme => `${theme.palette.secondary.main}40` : undefined,
					}}
					variant={(showErrorTrace && node.isInErrorTrace) || selected ? "contained" : "outlined"}
					color={node.isError || (showErrorTrace && node.isInErrorTrace) ? "error" : "primary"}
				>
					<Stack>
						<Typography
							sx={{
								textTransform: "none",
								fontWeight: "bold",
							}}
						>
							{stateName}
						</Typography>
						<Typography
							variant="caption"
							sx={{
								textTransform: "none",
								lineHeight: 0.9,
								fontSize: "0.8rem",
							}}
							component="div"
						>
							{predicates.map((p, index) => (
								<Typography
									sx={{
										lineHeight: 0.9,
										fontSize: "0.8rem",
										fontWeight: selectedPrecision && containsSelectedPrecision && predicatesEqualOrNegated(selectedPrecision, p) ? "bold" : "normal",
										color: selectedPrecision && containsSelectedPrecision && predicatesEqualOrNegated(selectedPrecision, p) ? "secondary.main" : "text.secondary",
									}}
									key={index}
								>
									{p}
								</Typography>
							))}
						</Typography>
					</Stack>
				</Button>
			)}
			{node.isInitial && (
				<Box
					sx={{
						width: "20px",
						height: "20px",
						backgroundColor: "primary.main",
						borderRadius: "100%",
						left: "50%",
						bottom: "-10px",
						transform: "translate(-50%, -50%)",
						position: "absolute",
					}}
				/>
			)}
		</div>
	)
}

export default Node
