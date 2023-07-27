export const getShortenText = (str) => {
	const string = String(str)
	return `${string.substring(0, 10)}...${string.substring(59)}`
}
