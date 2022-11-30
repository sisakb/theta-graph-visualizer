type Metadata = { [key: string]: string }

export interface IJSONNode {
	label?: string
	metadata?: Metadata
}

export interface IJSONEdge {
	source: string
	target: string
	label?: string
	metadata?: Metadata
}

export interface IJSONGraph {
	directed?: boolean
	type?: string
	nodes: { [id: string]: IJSONNode }
	edges: IJSONEdge[]
}