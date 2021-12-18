import Book, { statusBook } from "../models/Book";
import imagesView from "./images-view";

export default {
    render(book: Book) {
        return {
            id: book.id,
            title: book.title,
            description: book.description,
            author: book.author,
            pages: book.pages,
            status: book.status,
            quantity: book.quantity,
            images: imagesView.renderMany(book.images)
        }
    },
    renderMany(books: Book[]){
        return books.map((book) => this.render(book))
    }
}