import { createContext, useContext, useState } from "react"
import { IThetaIteration } from "../components/Iteration/Iteration"
import data from "../data/wdl-output.json"

interface IStore {
	iterations: IThetaIteration[],
	traces: string[],
	title: string | null,
	date: Date | null,
	selectedPrecision: string | null,
	setSelectedPrecision: (precision: string | null) => void,
	showErrorTrace: boolean,
	setShowErrorTrace: (show: boolean) => void,
}

const StoreContext = createContext<IStore>({
	iterations: [],
	traces: [],
	title: null,
	date: null,
	selectedPrecision: null,
	setSelectedPrecision: () => { /* pass */ },
	showErrorTrace: false,
	setShowErrorTrace: () => { /* pass */ },
})

export const useStore = () => {
	return useContext(StoreContext)
}

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
	
	//const [data, setData] = useState<IThetaIteration[] | null>(null)
	const [selectedPrecision, setSelectedPrecision] = useState<string | null>(null)
	const [showErrorTrace, setShowErrorTrace] = useState<boolean>(false)

	const store: IStore = {
		title: data.title,
		date: new Date(data.date) ?? null,
		iterations: data.iterations as unknown as IThetaIteration[],
		traces: data.traces,
		selectedPrecision,
		setSelectedPrecision,
		showErrorTrace,
		setShowErrorTrace,
	}

	return (
		<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
	)
}

export const useSelector = <T,>(selector: (store: IStore) => T) => {
	const store = useStore()
	return selector(store)
}
