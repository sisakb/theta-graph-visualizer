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

const predicatesEqualOrNegated = (p1: string, p2: string) =>
	p1 === p2 || p1 === `not (${p2})` || p2 === `not (${p1})`

const Node = ({ nodeDrawing, graphId, iteration }: NodeProps) => {
	const { node } = nodeDrawing
	const { stateName, predicates } = node

	const hovered = false

	const selectedPrecision = useSelector((store) => store.selectedPrecision)
	const containsSelectedPrecision = useMemo(
		() =>
			selectedPrecision &&
			predicates.some((p) =>
				predicatesEqualOrNegated(selectedPrecision, p)
			),
		[selectedPrecision, predicates]
	)
	const showErrorTrace = useSelector((store) => store.showErrorTrace)
	const { node: selectedNode, iteration: selectedIteration } =
		useSelector((store) => store.selectedNode) || {}
	const setSelectedNode = useSelector((store) => store.setSelectedNode)

	const precisionInIteration = useSelector(store => store.processedData?.iterations[iteration]?.precisions)
	const newPrecisionInIteration = useMemo(() => precisionInIteration?.filter(p => p.isNew).map(p => p.label), [precisionInIteration])
	const precisionInSelectedIteration = useSelector(store => store.processedData?.iterations.at(selectedIteration || 0)?.precisions)
	const newPrecisionInSelectedIteration = useMemo(() => precisionInSelectedIteration?.filter(p => p.isNew).map(p => p.label), [precisionInSelectedIteration])

	const isSameAsSelected = useMemo(() => {
		if (!selectedNode || (typeof selectedIteration !== "number")) return false
		if (iteration === selectedIteration) return selectedNode.id === node.id
		if (Math.abs(iteration - selectedIteration) > 1) return false
		const labelsMatch = selectedNode.stateName === stateName
		//const subset = (node.predicates.length === 0 || node.predicates.every((p) => selectedNode?.predicates.includes(p)))
		//const superset = (selectedNode?.predicates.every((p) => node.predicates.includes(p)))
		const superSetWithOnlyNewPrecision = (selectedNode?.predicates.every((p) => node.predicates.includes(p)) && node.predicates.filter(p => !selectedNode.predicates.includes(p)).every(p => {
			if (newPrecisionInIteration?.includes(p)) return true
			return Boolean(newPrecisionInIteration?.find(p2 => predicatesEqualOrNegated(p, p2)))
		}))

		const subsetWithOnlyNewPrecision = (node?.predicates.every((p) => selectedNode.predicates.includes(p)) && selectedNode.predicates.filter(p => !node.predicates.includes(p)).every(p => {
			if (newPrecisionInSelectedIteration?.includes(p)) return true
			return Boolean(newPrecisionInSelectedIteration?.find(p2 => predicatesEqualOrNegated(p, p2)))
		}))

		if (iteration < selectedIteration) return labelsMatch && subsetWithOnlyNewPrecision
		if (iteration > selectedIteration) return labelsMatch && superSetWithOnlyNewPrecision

		return labelsMatch
	}, [selectedIteration, selectedNode, stateName, iteration])

	const isSelectedNode = useMemo(() => selectedNode?.id === node.id && selectedIteration === iteration, [selectedNode, selectedIteration, iteration])

	//const secondaryColor = containsSelectedPrecision || isSelectedNode

	return (
		<div
			id={`${graphId}-${node.id}`}
			className={`${styles.nodeContainer} ${
				node.isInitial ? styles.initial : ""
			} ${hovered ? styles.hovered : ""} ${
				isSameAsSelected ? styles.selected : ""
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
							backgroundColor: containsSelectedPrecision
								? (theme) => `${theme.palette.secondary.main}70`
								: undefined,
							border: containsSelectedPrecision
								? (theme) =>
									`1px solid ${theme.palette.secondary.main}`
								: undefined,
						},
						border: containsSelectedPrecision
							? (theme) =>
								`1px solid ${theme.palette.secondary.main}`
							: undefined,
						backgroundColor: containsSelectedPrecision
							? (theme) => `${theme.palette.secondary.main}40`
							: undefined,
					}}
					variant={
						(showErrorTrace && node.isInErrorTrace) || isSameAsSelected
							? "contained"
							: "outlined"
					}
					color={
						node.isError || (showErrorTrace && node.isInErrorTrace)
							? "error"
							: (isSelectedNode ? "secondary" : "primary")
					}
					onClick={() => setSelectedNode(isSelectedNode ? null : { node, iteration })}
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
										fontWeight:
											selectedPrecision &&
											containsSelectedPrecision &&
											predicatesEqualOrNegated(
												selectedPrecision,
												p
											)
												? "bold"
												: "normal",
										color:
											selectedPrecision &&
											containsSelectedPrecision &&
											predicatesEqualOrNegated(
												selectedPrecision,
												p
											)
												? "secondary.main"
												: undefined,
									}}
									key={index}
								>
									{p}
								</Typography>
							))}
							{/*selectedNode?.stateName === node.stateName && <Typography sx={{ fontSize: 12 }}>
								{(node.predicates.length === 0 || node.predicates.every((p) => selectedNode?.predicates.includes(p))) && "Subset "}
								{(selectedNode?.predicates.every((p) => node.predicates.includes(p))) && "Superset"}{(selectedNode?.predicates.every((p) => node.predicates.includes(p)) && node.predicates.filter(p => !selectedNode.predicates.includes(p)).every(p => {
									if (newPrecisionInIteration?.includes(p)) return true
									return Boolean(newPrecisionInIteration?.find(p2 => predicatesEqualOrNegated(p, p2)))
								})) && "(only new)"}
							</Typography>*/}
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
