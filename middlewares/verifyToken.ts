import { NextFunction, Request, Response } from "express"
import TokenService from "@/services/token"
import UserService from "@/services/user"
import { UserLocals } from "types"

const verifyToken = (req: Request, res: Response<{}, UserLocals>, next: NextFunction) => {
	const header = req.header("Authorization")
	if (!header) return res.status(400).json({ message: "Invalid header", data: {} })
	const token = header.split(" ")[1]

	try {
		const payload = TokenService.verifyAccess(token)
		if (payload.type !== "access") return res.status(401).json({})

		const user = UserService.findId(payload.id)
		if (!user) return res.status(404).json({})

		const { password, ...newUser } = user
		res.locals.user = newUser
		next()
	} catch (err) {
		console.log(err)
		return res.status(401).json({})
	}
}

export default verifyToken
