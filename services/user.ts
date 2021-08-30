import Low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { join } from "path"
import bcrypt from "bcrypt"
import { User, UserDB } from "types"

const file = join(__dirname, "..", "db", "users.json")
const adapter = new FileSync<UserDB>(file)
const db = Low(adapter)

const findEmail = (email: string): User | undefined => {
	return db.get("users").find({ email }).value()
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
}

export default UserService
