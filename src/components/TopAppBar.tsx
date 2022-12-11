// TopAppBar component

import { AppBar, Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Stack, Switch, Toolbar, Typography } from "@mui/material"
import FileOpenIcon from "@mui/icons-material/FileOpen"
import { useSelector } from "../util/store"
import { CheckBox } from "@mui/icons-material"

const TopAppBar = () => {


	const title = useSelector((store) => store.title)
	const date = useSelector((store) => store.date)
	const showErrorTrace = useSelector((store) => store.showErrorTrace)
	const setShowErrorTrace = useSelector((store) => store.setShowErrorTrace)

	return (
		<AppBar position="fixed">
			<Toolbar sx={{ gap: 3 }}>
				<Button
					component="label"
					htmlFor="browse-data"
					variant="contained"
					startIcon={<FileOpenIcon />}
				>
					Import
				</Button>
				<input
					type="file"
					id="browse-data"
					style={{ display: "none" }}
					accept=".json"
					onChange={(e) => {
						if (e.target.files) {
							const file = e.target.files[0]
							const reader = new FileReader()
							reader.onload = (e) => {
								if (e.target?.result) {
									const data = JSON.parse(e.target.result as string)
									console.log(data)
								}
							}
							reader.readAsText(file)
						}
					}}
				/>
				<Divider orientation="vertical" flexItem />
				<Stack>
					<Typography>{title}</Typography>
					<Typography variant="caption" color="text.secondary" sx={{
						fontSize: "0.7rem",
						opacity: 0.7
					}}>{date?.toLocaleString()}</Typography>
				</Stack>
				<Box flexGrow={1} />
				<Button variant="outlined" onClick={() => setShowErrorTrace(!showErrorTrace)}>
					<Checkbox sx={{ml: -1, mr: 1, p: 0}} color="primary" checked={showErrorTrace} />
					Show error traces
				</Button>
			</Toolbar>
		</AppBar>
	)
}

export default TopAppBar
