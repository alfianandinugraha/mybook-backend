import express, { Request, Response } from "express"
import Ajv from "ajv"
import { v4 } from "uuid"
import { ApiResponse, Token, User } from "types"
import UserService from "@/services/user"
import TokenService from "@/services/token"
import { userRequestSchema } from "@/schema/user"
import {
	ERR_FAILED_GENERATE_ACCESS_TOKEN,
	ERR_INVALID_AUTHORIZATION_HEADER,
	ERR_INVALID_BODY,
	ERR_USER_ALREADY_EXIST,
	ERR_USER_NOT_FOUND,
	SUCCESS_GENERATE_ACCESS_TOKEN,
} from "@/logs/apiResponse"
import { UserRegisterRequest } from "ApiRequest"

const server = express()
const router = express.Router()
const ajv = new Ajv()

router.use(express.json())
router.post(
	"/register",
	(req: Request<null, null, UserRegisterRequest>, res: Response<ApiResponse<{} | Token>>) => {
		const isValid = ajv.validate(userRequestSchema, req.body)
		if (!isValid) return res.status(400).json({ message: ERR_INVALID_BODY, data: {} })

		const { email } = req.body
		const isUserAlreadyExist = UserService.findEmail(email)
		if (isUserAlreadyExist?.id) return res.status(400).json({ message: ERR_USER_ALREADY_EXIST, data: {} })

		const userResult = UserService.register(req.body)

		return res.json({
			message: "Register user successfully",
			data: TokenService.generateToken({ id: userResult.id }),
		})
	}
)

router.post("/login", (req, res) => {
	const isValid = ajv.validate(
		{
			...userRequestSchema,
			required: ["email", "password"],
		},
		req.body
	)
	if (!isValid) return res.status(400).json({ message: ERR_INVALID_BODY, data: {} })

	const { email, password } = req.body
	const user: User | undefined = UserService.login(email, password)
	if (!user)
		return res.status(404).json({
			message: ERR_USER_NOT_FOUND,
			data: {},
		})
	return res.json({ message: "Login successfully", data: TokenService.generateToken({ id: user.id }) })
})

router.post("/access", (req: Request, res: Response) => {
	const header = req.header("Authorization")
	if (!header) return res.status(400).json({ message: ERR_INVALID_AUTHORIZATION_HEADER, data: {} })
	const token = header.split(" ")[1]

	try {
		const decode = TokenService.verifyRefreshToken(token)
		return res.json({
			message: SUCCESS_GENERATE_ACCESS_TOKEN,
			data: {
				accessToken: TokenService.generateAccessToken({ id: decode.id }),
			},
		})
	} catch (err) {
		return res.json({
			message: ERR_FAILED_GENERATE_ACCESS_TOKEN,
			data: {},
		})
	}
})

server.use("/api/auth", router)

export default server
