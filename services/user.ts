import Low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { join } from "path"
import { User, UserDB } from "types"

const file = join(__dirname, "..", "db", "users.json")
const adapter = new FileSync<UserDB>(file)
const db = Low(adapter)

const register = (user: User) => {
	db.get("users").push(user)
}

const User = {
	register,
}

export default User
