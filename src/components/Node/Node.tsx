// Node component

import { Box, Button, Chip, Stack, Typography } from "@mui/material"
import { NodeDrawing } from "../../util/ArgTreeDrawer"
import { useSelector } from "../../util/store"
import styles from "./Node.module.scss"

interface NodeProps {
	nodeDrawing: NodeDrawing
	graphId: string
}

const predicatesEqualOrNegated = (p1: string, p2: string) => p1 === p2 || p1 === `not (${p2})` || p2 === `not (${p1})`

const Node = ({ nodeDrawing, graphId }: NodeProps) => {
	const { node } = nodeDrawing
	const { stateName, predicates } = node

	const hovered = false
	const selected = false

	const selectedPrecision = useSelector((store) => store.selectedPrecision)

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
						},
						border: selectedPrecision && predicates.some(p => predicatesEqualOrNegated(selectedPrecision, p)) ? theme => `1px solid ${theme.palette.secondary.main}` : undefined,
						backgroundColor: selectedPrecision && predicates.some(p => predicatesEqualOrNegated(selectedPrecision, p)) ? theme => `${theme.palette.secondary.main}40` : undefined,
					}}
					variant="outlined"
					color={node.isError ? "error" : "primary"}
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
										fontWeight: selectedPrecision && predicatesEqualOrNegated(selectedPrecision, p) ? "bold" : "normal",
										color: selectedPrecision && predicatesEqualOrNegated(selectedPrecision, p) ? "secondary.main" : "text.secondary",
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
