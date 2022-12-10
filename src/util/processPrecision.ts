import processPredicate from "./processPredicate"

const processPrecision = (precision: string) => {
	if (precision === "(GlobalCfaPrec (PredPrec))") return []
	const [_, precisions] = precision.match(/\(GlobalCfaPrec\s*\(PredPrec\s(.*)\)\)/) ?? []
	if (precisions) {
		return precisions.replace(/\)\s*\(/g, ";").trim().split(";").map(p => p.replace(/^\(/g, "").replace(/\)$/g, "")).map(processPredicate)
	} else {
		return [precision]
	}
}

export default processPrecision