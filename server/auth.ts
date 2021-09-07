import express, { Request, Response } from "express"
import Ajv from "ajv"
import { ApiResponse, Token, User } from "types"
import UserService from "@/services/user"
import TokenService from "@/services/token"
import { userRequestLoginSchema, userRequestRegisterSchema } from "@/schema/user"
import {
	ERR_FAILED_GENERATE_ACCESS_TOKEN,
	ERR_INVALID_AUTHORIZATION_HEADER,
	ERR_INVALID_BODY,
	ERR_USER_ALREADY_EXIST,
	ERR_USER_NOT_FOUND,
	SUCCESS_GENERATE_ACCESS_TOKEN,
} from "@/messages/apiResponse"
import { UserLoginRequest, UserRegisterRequest } from "ApiRequest"
import cors from 'cors'

const server = express()
const router = express.Router()
const ajv = new Ajv()

server.use(cors())
router.use(express.json())
router.post(
	"/register",
	(req: Request<null, null, UserRegisterRequest>, res: Response<ApiResponse<{} | Token>>) => {
		const isValid = ajv.validate(userRequestRegisterSchema, req.body)
		if (!isValid) return res.status(400).json({ message: ERR_INVALID_BODY, data: {} })

		const userResult = UserService.register(req.body)
		if (!userResult) return res.status(400).json({ message: ERR_USER_ALREADY_EXIST, data: {} })

		return res.json({
			message: "Register user successfully",
			data: TokenService.generateToken({ id: userResult.id }),
		})
	}
)

router.post("/login", (req: Request<null, null, UserLoginRequest>, res: Response<ApiResponse<{}>>) => {
	const isValid = ajv.validate(userRequestLoginSchema, req.body)
	if (!isValid) return res.status(400).json({ message: ERR_INVALID_BODY, data: {} })

	const { email, password } = req.body
	const user = UserService.login(email, password)
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

		if (decode.type != "refresh")
			return res.status(401).json({
				message: ERR_INVALID_AUTHORIZATION_HEADER,
				data: {},
			})

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
