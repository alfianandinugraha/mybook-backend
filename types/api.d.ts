declare module "types" {
	import { JwtPayload } from "jsonwebtoken"

	export interface User {
		id: string
		name: string
		email: string
		password: string
	}

	export interface UserDB {
		users: User[]
	}

	export interface AccessTokenProps {
		accessToken: string
	}

	export interface JwtVerifyTokenPayload extends JwtPayload {
		id: string
		type: string
	}

	export interface Token extends AccessTokenProps {
		refreshToken: string
	}

	export interface ApiResponse<T> {
		message: string
		data: T
	}
}
