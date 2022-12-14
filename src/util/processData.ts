import ArgGraph from "./ArgGraph"
import ArgTreeDrawer from "./ArgTreeDrawer"
import processPrecision from "./processPrecision"

export interface ThetaWebDebuggerLoggerOutput {
	title: string
	date: string
	iterations: {
		iteration: number
		precision: string
		arg: {
			graph: {
				directed: boolean
				type: string
				nodes: {
					[id: string]: {
						label: string
						metadata: {
							style: string
						}
					}
				}
				edges: {
					source: string
					target: string
					label: string
					metadata: {
						style: string
					}
				}[]
			}
		}
	}[],
	traces: string[]
}

const processData = (data: ThetaWebDebuggerLoggerOutput) => {
	const allPrecisions = data.iterations.map(iter => iter.precision).map(processPrecision)
	const iterations = data.iterations.map((iter, index) => {
		const prevPrecisions = allPrecisions[index - 1]
		const precisions = allPrecisions[index].map((p) => ({
			label: p,
			isNew: !prevPrecisions || !prevPrecisions.includes(p),
		}))
		const trace = data.traces[index] || ""
		const argGraph = new ArgGraph(iter.arg.graph, trace)
		const argDrawing = new ArgTreeDrawer(argGraph)

		return {
			precisions,
			trace,
			argGraph,
			argDrawing,
		}
	})

	return {
		iterations,
	}
}

export default processData
