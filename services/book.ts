import Low from "lowdb"
import FileSync from "lowdb/adapters/FileSync"
import { join } from "path"
import { Book, BookDB } from "types"

const file = join(__dirname, "..", "db", "books.json")
const adapter = new FileSync<BookDB>(file)
const db = Low(adapter)

const store = (book: Book) => {
	db.get("books").push(book).write()
}

const getAll = (userId: string): Book[] => {
	return db.get("books").filter({ userId }).value()
}

const BookService = {
	store,
	getAll,
}

export default BookService
