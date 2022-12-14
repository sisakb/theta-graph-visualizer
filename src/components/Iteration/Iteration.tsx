// GraphIteration component

import {
	Badge,
	Card,
	CardContent,
	Chip,
	Divider,
	Stack,
	Typography,
} from "@mui/material"
import processData from "../../util/processData"
import { useSelector } from "../../util/store"
import Graph from "../Graph/Graph"
import styles from "./Iteration.module.scss"

interface IIteartionProps {
	iteration: ReturnType<typeof processData>["iterations"][number]
	index: number
}

const Iteration = ({ iteration, index }: IIteartionProps) => {
	const selectedPrecision = useSelector((store) => store.selectedPrecision)
	const setSelectedPrecision = useSelector(
		(store) => store.setSelectedPrecision
	)
	return (
		<Card
			sx={{
				position: "relative",
				overflow: "visible",
			}}
		>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Iteration #{index + 1}
				</Typography>
				<Divider />
				<Typography
					variant="body2"
					color="text.secondary"
					gutterBottom
					sx={{ mt: 1 }}
				>
					Precision: {!iteration.precisions?.length && <em>None</em>}
				</Typography>
				<Stack direction="row" spacing={1}>
					{iteration.precisions.map((p, index) => (
						<Badge
							key={index}
							color="success"
							badgeContent="★"
							invisible={!p.isNew}
							sx={{
								"& .MuiBadge-badge": {
									color: "#fff",
								},
							}}
						>
							<Chip
								clickable
								onClick={() =>
									setSelectedPrecision(
										selectedPrecision === p.label
											? null
											: p.label
									)
								}
								color={
									selectedPrecision === p.label
										? "secondary"
										: "default"
								}
								key={index}
								label={p.label}
							/>
						</Badge>
					))}
				</Stack>
				<div className={styles.graph}>
					<Graph
						iteration={index}
						id={`iteration-${index}`}
						argGraph={iteration.argGraph}
						treeDrawing={iteration.argDrawing}
					/>
				</div>
			</CardContent>
		</Card>
	)
}

export default Iteration
