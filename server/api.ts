import express, { Request, Response } from "express"
import verifyToken from "@/middlewares/verifyToken"
import { ApiResponse, UserLocals, UserProps } from "types"

const server = express()
const router = express.Router()

router.get("/", (_, res) => {
	return res.json("Hello world !")
})

router.get("/profile", verifyToken, (req: Request, res: Response<ApiResponse<UserProps>, UserLocals>) => {
	return res.json({
		message: "Success get user profile",
		data: res.locals.user,
	})
})

server.use("/api", router)

export default server
