import Low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { join } from "path"
import bcrypt from "bcrypt"
import { User, UserDB, UserProps } from "types"

const file = join(__dirname, "..", "db", "users.json")
const adapter = new FileSync<UserDB>(file)
const db = Low(adapter)

const findEmail = (email: string): UserProps | undefined => {
	return db.get("users").find({ email }).omit("password").value()
}

const findId = (id: string): UserProps | undefined => {
	return db.get("users").find({ id }).omit("password").value()
}

const login = (email: string, password: string): User | undefined => {
	const user = db.get("users").find({ email }).value()
	if (!user) return undefined

	const isValidPassword = bcrypt.compareSync(password, user.password)
	if (!isValidPassword) return undefined

	return user
}

const register = (user: User) => {
	const newUser = {
		...user,
		password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(5)),
	}
	return db.get("users").push(newUser).write()
}

const UserService = {
	register,
	findEmail,
	login,
	findId,
}

export default UserService
