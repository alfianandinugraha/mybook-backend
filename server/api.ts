import express, { Request, Response } from "express"
import verifyToken from "@/middlewares/verifyToken"
import Ajv from "ajv"
import { ApiResponse, Book, UserLocals, UserProps } from "types"
import { v4 } from "uuid"
import BookService from "@/services/book"
import { requestBookSchema } from "@/schema/book"
import {
	ERR_BOOKS_NOT_FOUND,
	ERR_FAILED_STORE_BOOK,
	ERR_INVALID_BODY,
	SUCCESS_DELETE_BOOK,
	SUCCESS_GET_BOOKS,
	SUCCESS_GET_PROFILE,
	SUCCESS_STORE_BOOK,
	SUCCESS_UPDATE_BOOK,
} from "@/logs/apiResponse"

const server = express()
const router = express.Router()
const ajv = new Ajv()

router.use(express.json())
router.get("/", (_, res) => {
	return res.json("Hello world !")
})

router.get("/profile", verifyToken, (req: Request, res: Response<ApiResponse<UserProps>, UserLocals>) => {
	return res.json({
		message: SUCCESS_GET_PROFILE,
		data: res.locals.user,
	})
})

router.get("/books", verifyToken, (req: Request, res: Response<ApiResponse<{}>, UserLocals>) => {
	const userId = res.locals.user.id
	const books = BookService.getAll(userId)

	if (!books.length) {
		return res.status(404).json({
			message: ERR_BOOKS_NOT_FOUND,
			data: [],
		})
	}

	return res.json({
		message: SUCCESS_GET_BOOKS,
		data: books,
	})
})

router.delete("/books/:id", verifyToken, (req: Request, res: Response<ApiResponse<{}>, UserLocals>) => {
	const id = req.params.id
	const isBookAvailable = BookService.get(id)
	if (!isBookAvailable)
		return res.status(404).json({
			message: ERR_BOOKS_NOT_FOUND,
			data: {},
		})

	BookService.delete(id)
	return res.json({
		message: SUCCESS_DELETE_BOOK,
		data: {},
	})
})

router.put("/books/:id", verifyToken, (req: Request, res: Response<ApiResponse<{}>, UserLocals>) => {
	const isValidBody = ajv.validate(requestBookSchema, req.body)
	if (!isValidBody) return res.status(400).json({ message: ERR_INVALID_BODY, data: {} })

	const id = req.params.id
	const isBookAvailable = BookService.get(id)
	if (!isBookAvailable)
		return res.status(404).json({
			message: ERR_BOOKS_NOT_FOUND,
			data: {},
		})

	const userId = res.locals.user.id
	const newBook = { id, userId, ...req.body }
	BookService.update(id, newBook)

	return res.json({
		message: SUCCESS_UPDATE_BOOK,
		data: newBook,
	})
})

router.post("/books", verifyToken, (req: Request, res: Response<ApiResponse<{}>, UserLocals>) => {
	const isValidBody = ajv.validate(requestBookSchema, req.body)
	if (!isValidBody) return res.status(400).json({ message: ERR_INVALID_BODY, data: {} })

	const bookId = v4()
	const { title, description, authors } = req.body
	const book: Book = {
		id: bookId,
		userId: res.locals.user.id,
		title,
		description,
		authors,
	}

	try {
		BookService.store(book)
		return res.json({
			message: SUCCESS_STORE_BOOK,
			data: book,
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json({
			message: ERR_FAILED_STORE_BOOK,
			data: {},
		})
	}
})

server.use("/api", router)

export default server
