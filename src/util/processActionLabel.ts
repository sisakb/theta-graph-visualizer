const processActionLabel = (label: string) => {
	const assumeMatch = label.match(/assume\s*\((.*)\)/)
	if (assumeMatch) {
		const assumeContent = assumeMatch[1]
		const matches = assumeContent.match(/(<=|<|>|>=)\s(.*)\s(.*)/)
		if (matches) {
			const [_, operator, left, right] = matches
			return `[${assumeContent.replace(
				_,
				`${left} ${operator} ${right}`
			)}]`
		} else {
			return `[${assumeContent}]`
		}
	}
	const assignMatch = label.match(
		/assign\s*(.*)\s*\((\+|-|\/|\*)\s(.*)\s(.*)\)/
	)
	if (assignMatch) {
		const [_, variable, operator, left, right] = assignMatch
		return `${variable} = ${left} ${operator} ${right}`
	}
	return label
}


export default processActionLabel