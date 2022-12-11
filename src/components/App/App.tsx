import {
	AppBar,
	Button,
	Divider,
	ThemeProvider,
	Toolbar,
	Typography,
} from "@mui/material"
import { useStore } from "../../util/store"
import Iteration from "../Iteration/Iteration"
import styles from "./App.module.scss"
import CssBaseline from "@mui/material/CssBaseline"
import { theme } from "./theme"
import TopAppBar from "../TopAppBar"
const App = () => {
	//const [hoveredNode, setHoveredNode] = useState<ArgNode | null>(null)
	//const [selectedNode, setSelectedNode] = useState<ArgNode | null>(null)

	const iterations = useStore().iterations

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<TopAppBar />
			<div className={styles.app}>
				<div className={styles.iterationContainer}>
					{iterations.map((it, index) => (
						<Iteration key={index} iteration={it} />
					))}
				</div>
			</div>
		</ThemeProvider>
	)
}

export default App
