import { NextFunction, Request, Response } from "express"
import TokenService from "@/services/token"
import UserService from "@/services/user"
import { ApiResponse, UserLocals } from "types"
import {
	ERR_INVALID_ACCESS_TOKEN,
	ERR_INVALID_AUTHORIZATION_HEADER,
	ERR_USER_NOT_FOUND,
} from "@/messages/apiResponse"

const verifyToken = (req: Request, res: Response<ApiResponse<{}>, UserLocals>, next: NextFunction) => {
	const header = req.header("Authorization")
	if (!header) return res.status(400).json({ message: ERR_INVALID_AUTHORIZATION_HEADER, data: {} })
	const token = header.split(" ")[1]

	try {
		const payload = TokenService.verifyAccessToken(token)
		if (payload.type !== "access")
			return res.status(401).json({ message: ERR_INVALID_ACCESS_TOKEN, data: {} })

		const user = UserService.findId(payload.id)
		if (!user)
			return res.status(404).json({
				message: ERR_USER_NOT_FOUND,
				data: {},
			})

		res.locals.user = user
		next()
	} catch (err) {
		console.log(err)
		return res.status(401).json({
			message: ERR_USER_NOT_FOUND,
			data: {},
		})
	}
}

export default verifyToken
