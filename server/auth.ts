import express from "express"

const server = express()
const router = express.Router()

router.post("/register", (_, res) => {
	return res.json("Register user")
})

server.use("/api/auth", router)

export default server
