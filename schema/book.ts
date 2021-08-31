const requestBookSchema = {
	type: "object",
	properties: {
		title: {
			type: "string",
		},
		authors: {
			type: "array",
		},
		description: {
			type: "string",
		},
	},
	required: ["title", "authors", "description"],
	additionalProperties: false,
}

export { requestBookSchema }
