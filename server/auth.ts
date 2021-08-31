import express, { Request, Response } from "express"
import Ajv from "ajv"
import { v4 } from "uuid"
import { ApiResponse, Token, User } from "types"
import UserService from "@/services/user"
import TokenService from "@/services/token"
import { userRequestSchema } from "@/schema/user"

const server = express()
const router = express.Router()
const ajv = new Ajv()

router.use(express.json())
router.post("/register", (req: Request, res: Response<ApiResponse<{} | Token>>) => {
	const isValid = ajv.validate(userRequestSchema, req.body)
	if (!isValid) return res.status(400).json({ message: "Invalid body", data: {} })

	const { name, password, email } = req.body
	const isUserAlreadyExist = UserService.findEmail(email)
	if (isUserAlreadyExist?.id) return res.status(400).json({ message: "User already exist", data: {} })

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
		data: TokenService.generateToken({ id: userId }),
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
	return res.json({ message: "Login successfully", data: TokenService.generateToken({ id: user.id }) })
})

router.post("/access", (req: Request, res: Response) => {
	const header = req.header("Authorization")
	if (!header) return res.status(400).json({ message: "Invalid header", data: {} })
	const token = header.split(" ")[1]

	try {
		const decode = TokenService.verifyRefreshToken(token)
		return res.json({
			message: "Success generate access token",
			data: {
				accessToken: TokenService.generateAccessToken({ id: decode.id }),
			},
		})
	} catch (err) {
		return res.json({
			message: "Failed",
			data: {},
		})
	}
})

server.use("/api/auth", router)

export default server
