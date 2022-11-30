import Graph from "./Graph"

import it1 from "./data/iteration1.json"
import it2 from "./data/iteration2.json"
import it3 from "./data/iteration3.json"
import it4 from "./data/iteration4.json"
import it5 from "./data/iteration5.json"
import { useState } from "react"
import { ArgNode } from "./ArgGraph"

const iterations = [it1, it2, it3, it4, it5]

const App = () => {
	const [hoveredNode, setHoveredNode] = useState<ArgNode | null>(null)
	const [selectedNode, setSelectedNode] = useState<ArgNode | null>(null)

	return (
		<div style={{ display: "flex" }}>
			{iterations.map((it, index) => (
				<Graph
					hoveredNode={hoveredNode}
					setHoveredNode={setHoveredNode}
					selectedNode={selectedNode}
					setSelectedNode={setSelectedNode}
					graph={it.graph}
					id={`iteration-${index}`}
					key={index}
					name={`Iteration ${index}`}
				/>
			))}
		</div>
	)
}

export default App
