export function isTimeStamp(obj) {
	return (
		typeof obj === "object" &&
		obj !== null &&
		typeof obj.path === "string" &&
		typeof obj.start === "number" &&
		typeof obj.end === "number"
	)
}
