const processPredicate = (rawPredicate: string) => {
	const matches = rawPredicate.match(/(<=|<|>|>=)\s(.*)\s(.*)/)
	if (matches) {
		const [_, operator, left, right] = matches
		return rawPredicate.replace(_, `${left} ${operator} ${right}`)
	} else {
		return rawPredicate
	}
}

export default processPredicate