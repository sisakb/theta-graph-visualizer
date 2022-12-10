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
import { useMemo } from "react"
import { IJSONGraph } from "../../IJSONGraph"
import processPrecision from "../../util/processPrecision"
import { useSelector, useStore } from "../../util/store"
import Graph from "../Graph/Graph"
import styles from "./Iteration.module.scss"

export interface IThetaIteration {
	iteration: number
	arg: {
		graph: IJSONGraph
	}
	precision: string
}

interface IIteartionProps {
	iteration: IThetaIteration
}

const Iteration = ({ iteration }: IIteartionProps) => {
	//const store = useStore()

	const iterations = useSelector((store) => store.iterations)
	const selectedPrecision = useSelector((store) => store.selectedPrecision)
	const setSelectedPrecision = useSelector(
		(store) => store.setSelectedPrecision
	)

	const prevIteration = iterations[iteration.iteration - 2]
	const prevPrecisions = useMemo(
		() => (prevIteration ? processPrecision(prevIteration.precision) : []),
		[prevIteration?.precision]
	)
	const precisions = useMemo(
		() => processPrecision(iteration.precision),
		[iteration.precision]
	).map((p) => ({
		label: p,
		isNew: !prevPrecisions.includes(p),
	}))

	return (
		<Card
			sx={{
				position: "relative",
				overflow: "visible",
			}}
		>
			<CardContent>
				<Typography variant="h6" gutterBottom>
					Iteration #{iteration.iteration}
				</Typography>
				<Divider />
				<Typography
					variant="body2"
					color="text.secondary"
					gutterBottom
					sx={{ mt: 1 }}
				>
					Precision: {!precisions?.length && <em>None</em>}
				</Typography>
				<Stack direction="row" spacing={1}>
					{precisions.map((p, index) => (
						<Badge
							key={index}
							color="success"
							badgeContent="★"							
							invisible={!p.isNew}
							sx={{
								"& .MuiBadge-badge": {
									color: "#fff",
								}
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
										? "primary"
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
						graph={iteration.arg.graph as unknown as IJSONGraph}
						id={`iteration-${iteration.iteration}`}
					/>
				</div>
			</CardContent>
		</Card>
	)
}

export default Iteration
