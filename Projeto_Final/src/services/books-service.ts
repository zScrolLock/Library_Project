import { Router } from "express"
import BookController from "../controllers/BookController"
import uploadConfig from "../config/upload";
import { checkAuth } from "../middleware/checkAuth";
import multer from 'multer'

const routes = Router();
const upload = multer(uploadConfig) 

routes.get("/", (req, res) => {
    res.send("Backend Touch");
})

// Retrieve Books by Title
routes.get("/books/search", checkAuth, BookController.retrieveFromTitle);

// Retrieve Book Details
routes.get("/books/:id", checkAuth, BookController.retrieveBook);

// update book info
routes.put("/books/:book_id", checkAuth, BookController.updateBookInfo)

// Retrieve All Books
routes.get("/books", checkAuth, BookController.showAll);

// Create new Book
routes.post("/books", upload.array('images'), checkAuth, BookController.createBook);

// RESERVED BOOK
routes.post("/books/reserved", checkAuth, BookController.reservedBook)

// RETRIEVE RESERVEDS
routes.get("/get-reserved", checkAuth, BookController.retrieveReserveds)

export { routes };