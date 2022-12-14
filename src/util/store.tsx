import { createContext, useContext, useMemo, useState } from "react"
import testData from "../data/wdl-output.json"
import { ArgNode } from "./ArgGraph"
import processData, { ThetaWebDebuggerLoggerOutput } from "./processData"

interface IStore {
	processedData: ReturnType<typeof processData> | null,
	setData: (data: ThetaWebDebuggerLoggerOutput | null) => void,
	title: string | null,
	date: Date | null,
	selectedPrecision: string | null,
	setSelectedPrecision: (precision: string | null) => void,
	showErrorTrace: boolean,
	setShowErrorTrace: (show: boolean) => void,
	selectedNode: {node: ArgNode, iteration: number} | null,
	setSelectedNode: (input :{node: ArgNode, iteration: number}|null) => void,
}

const StoreContext = createContext<IStore>({
	title: null,
	date: null,
	setData: () => { /* pass */ },
	processedData: null,
	selectedPrecision: null,
	setSelectedPrecision: () => { /* pass */ },
	showErrorTrace: false,
	setShowErrorTrace: () => { /* pass */ },
	selectedNode: null,
	setSelectedNode: () => { /* pass */ },
})

export const useStore = () => {
	return useContext(StoreContext)
}

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
	
	const [data, setData] = useState<ThetaWebDebuggerLoggerOutput | null>(testData as unknown as ThetaWebDebuggerLoggerOutput)
	const [selectedPrecision, setSelectedPrecision] = useState<string | null>(null)
	const [showErrorTrace, setShowErrorTrace] = useState<boolean>(false)
	const [selectedNode, setSelectedNode] = useState<{node: ArgNode, iteration: number} | null>(null)

	const processedData: ReturnType<typeof processData>|null = useMemo(() => data ? processData(data as unknown as ThetaWebDebuggerLoggerOutput) : null, [data])

	const store: IStore = {
		title: data?.title || null,
		date: data ? new Date(data.date): null,
		setData,
		processedData,
		selectedPrecision,
		setSelectedPrecision,
		showErrorTrace,
		setShowErrorTrace,
		selectedNode,
		setSelectedNode,
	}

	return (
		<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
	)
}

export const useSelector = <T,>(selector: (store: IStore) => T) => {
	const store = useStore()
	return selector(store)
}
