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

const get = (id: string): Book | undefined => {
	return db.get("books").find({ id }).value()
}

const update = (id: string, newBook: Book) => {
	return db.get("books").find({ id }).assign(newBook).write()
}

const deleteBook = (id: string) => {
	return db.get("books").remove({ id }).write()
}

const BookService = {
	store,
	getAll,
	delete: deleteBook,
	get,
	update,
}

export default BookService
