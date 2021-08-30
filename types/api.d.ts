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
}
