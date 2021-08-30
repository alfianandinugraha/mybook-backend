import Low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { join } from "path"
import { UserDB } from "types"

const file = join(__dirname, "..", "db", "users.json")
const adapter = new FileSync<UserDB>(file)
const db = Low(adapter)
