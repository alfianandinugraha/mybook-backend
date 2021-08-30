import express, { Request, Response } from "express"
import Ajv from "ajv"
import { v4 } from "uuid"
import { ApiResponse, User } from "types"
import UserService from "@/services/user"

const server = express()
const router = express.Router()
const ajv = new Ajv()

const userRequestSchema = {
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

router.use(express.json())
router.post("/register", (req: Request, res: Response<ApiResponse<{} | User>>) => {
	const isValid = ajv.validate(userRequestSchema, req.body)
	if (!isValid) return res.status(400).json({ message: "Invalid body", data: {} })

	const { name, password, email } = req.body
	const isUserAlreadyExist = UserService.findEmail(email)
	if (isUserAlreadyExist) return res.status(400).json({ message: "User already exist", data: {} })

	const userId = v4()
	const user: User = {
		id: userId,
		name,
		password,
		email,
	}
	UserService.register(user)
	return res.json({
		message: "Register user successfully",
		data: {
			id: userId,
			name,
			email,
		},
	})
})

server.use("/api/auth", router)

export default server
