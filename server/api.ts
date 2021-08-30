import express from "express"

const server = express()
const router = express.Router()

router.get("/", (_, res) => {
	return res.json("Hello world !")
})

server.use("/api", router)

export default server
