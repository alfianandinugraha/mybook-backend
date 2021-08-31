import express, { Request, Response } from "express"
import verifyToken from "@/middlewares/verifyToken"
import Ajv from "ajv"
import { ApiResponse, Book, UserLocals, UserProps } from "types"
import { v4 } from "uuid"
import BookService from "@/services/book"

const server = express()
const router = express.Router()
const ajv = new Ajv()

const requestBookSchema = {
	type: "object",
	properties: {
		title: {
			type: "string",
		},
		authors: {
			type: "array",
		},
		description: {
			type: "string",
		},
	},
	required: ["title", "authors", "description"],
	additionalProperties: false,
}

router.use(express.json())
router.get("/", (_, res) => {
	return res.json("Hello world !")
})

router.get("/profile", verifyToken, (req: Request, res: Response<ApiResponse<UserProps>, UserLocals>) => {
	return res.json({
		message: "Success get user profile",
		data: res.locals.user,
	})
})

router.get("/books", verifyToken, (req: Request, res: Response<ApiResponse<{}>, UserLocals>) => {
	const userId = res.locals.user.id
	const books = BookService.getAll(userId)

	if (!books.length) {
		return res.status(404).json({
			message: "Books not found",
			data: [],
		})
	}

	return res.json({
		message: "Success fetch books",
		data: books,
	})
})

router.post("/books", verifyToken, (req: Request, res: Response<ApiResponse<{}>, UserLocals>) => {
	const isValidBody = ajv.validate(requestBookSchema, req.body)
	if (!isValidBody) return res.status(400).json({ message: "Invalid body", data: {} })

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
			message: "Success store book",
			data: book,
		})
	} catch (err) {
		console.log(err)
		return res.status(400).json({
			message: "Failed to store book",
			data: {},
		})
	}
})

server.use("/api", router)

export default server
