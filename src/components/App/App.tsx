import { ThemeProvider } from "@mui/material"
import { useSelector } from "../../util/store"
import Iteration from "../Iteration/Iteration"
import styles from "./App.module.scss"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "./theme"
import TopAppBar from "../TopAppBar"
const App = () => {
	const data = useSelector((store) => store.processedData)
	const title = useSelector((store) => store.title)

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<TopAppBar />
			<div className={styles.app} key={title}>
				<div className={styles.iterationContainer}>
					{data?.iterations.map((it, index) => (
						<Iteration key={index} iteration={it} index={index} />
					))}
				</div>
			</div>
		</ThemeProvider>
	)
}

export default App
