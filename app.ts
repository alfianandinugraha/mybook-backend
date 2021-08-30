require("dotenv").config()
import apiServer from "@/server/api"
import authServer from "@/server/auth"

const { API_PORT, AUTH_PORT } = process.env

apiServer.listen(API_PORT, () => {
	console.log(`Server Auth was running at http://localhost:${API_PORT}/api`)
})

authServer.listen(AUTH_PORT, () => {
	console.log(`Server API was running at http://localhost:${AUTH_PORT}/api/auth`)
})
