declare module "types" {
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

	export interface Token extends AccessTokenProps {
		refreshToken: string
	}

	export interface ApiResponse<T> {
		message: string
		data: T
	}
}
