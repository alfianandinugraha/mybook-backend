const userRequestRegisterSchema = {
	type: "object",
	properties: {
		name: {
			type: "string",
		},
		email: {
			type: "string",
		},
		password: {
			type: "string",
		},
	},
	required: ["name", "email", "password"],
}

const userRequestLoginSchema = {
	...userRequestRegisterSchema,
	required: ["email", "password"],
}

export { userRequestRegisterSchema, userRequestLoginSchema }
