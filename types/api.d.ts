declare module "types" {
	import { JwtPayload } from "jsonwebtoken"

	export interface UserProps {
		id: string
		name: string
		email: string
	}

	export interface User extends UserProps {
		password: string
	}

	export interface UserLocals {
		user: UserProps
	}

	export interface UserDB {
		users: User[]
	}

	export interface Book {
		id: string
		userId: string
		title: string
		description: string
		authors: string[]
	}

	export interface BookDB {
		books: Book[]
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
