import { createContext, useContext, useState } from "react"
import { IThetaIteration } from "../components/Iteration/Iteration"
import data from "../data/test.json"

interface IStore {
	iterations: IThetaIteration[],
	selectedPrecision: string | null,
	setSelectedPrecision: (precision: string | null) => void,
}

const StoreContext = createContext<IStore>({
	iterations: [],
	selectedPrecision: null,
	setSelectedPrecision: () => { /* pass */ }
})

export const useStore = () => {
	return useContext(StoreContext)
}

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
	
	const [selectedPrecision, setSelectedPrecision] = useState<string | null>(null)

	const store: IStore = {
		iterations: data as unknown as IThetaIteration[],
		selectedPrecision,
		setSelectedPrecision,
	}

	return (
		<StoreContext.Provider value={store}>{children}</StoreContext.Provider>
	)
}

export const useSelector = <T,>(selector: (store: IStore) => T) => {
	const store = useStore()
	return selector(store)
}
