require("dotenv").config()
import apiServer from "@/server/api"

const { API_PORT } = process.env

apiServer.listen(API_PORT, () => {
	console.log(`Server API was running at port http://localhost:${API_PORT}`)
})
