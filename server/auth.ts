import express, { Request, Response } from "express"
import Ajv from "ajv"
import { v4 } from "uuid"
import { ApiResponse, Token, User } from "types"
import UserService from "@/services/user"
import TokenService from "@/services/token"

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
router.post("/register", (req: Request, res: Response<ApiResponse<{} | Token>>) => {
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
		data: TokenService.getAll({ id: userId }),
	})
})

router.post("/login", (req, res) => {
	const isValid = ajv.validate(
		{
			...userRequestSchema,
			required: ["email", "password"],
		},
		req.body
	)
	if (!isValid) return res.status(400).json({ message: "Invalid body", data: {} })

	const { email, password } = req.body
	const user: User | undefined = UserService.login(email, password)
	if (!user)
		return res.status(404).json({
			message: "User not found",
			data: {},
		})
	return res.json({ message: "Login successfully", data: TokenService.getAll({ id: user.id }) })
})

server.use("/api/auth", router)

export default server
