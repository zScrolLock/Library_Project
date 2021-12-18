import { Response } from "express";
import { getRepository, Like } from "typeorm";
import User from "../models/Auth";
import Book from "../models/Book";
import Reserved from "../models/Reserved";
import bookView from "../views/book-view";

export default {
    async retrieveBook(request: any, response: Response) {
        const { id } = request.params;
        const bookRepo = getRepository(Book);

        const book = await bookRepo.findOneOrFail(id, { relations: ['images']});
        return response.send(bookView.render(book));
    },

    async showAll(request: any, response: Response) {
        const bookRepo = getRepository(Book);

        const book = await bookRepo.find({
            order: {
                id: "ASC"
            },
            relations: ['images']
        })

        return response.json(bookView.renderMany(book))
    },

    async createBook(request: any, response: Response) {
        const { title, description, author, pages, quantity } = request.body;

        let newPages: number = +pages
        let newQuantity: number = +quantity

        const bookRepo = getRepository(Book);

        const requestImages = request.files as Express.Multer.File[];
        const images = requestImages.map(image => {
            return { path: image.filename }
        })

        const newBook = bookRepo.create({
            title,
            description,
            author,
            pages: newPages,
            quantity: newQuantity,
            images
        })
        return response.status(201).json(await bookRepo.save(newBook));
    },

    async retrieveFromTitle(request: any, response: Response) {
        const { title } = request.body;
        const bookRepo = getRepository(Book);
        return response.json(await bookRepo.find({
            title: Like(`%${title}%`)
        }))
    },

    async retrieveReserveds(request: any, response: Response) {
        const { id } = request.userData
        const relationRepo = getRepository(Reserved)

        const relationResult = await relationRepo.find({user_id: id})
        return response.status(200).send(relationResult)
    },

    async reservedBook(request: any, response: Response){
        const { book_id, reservedDate } = request.body
        const { id } = request.userData
        const relationRepo = getRepository(Reserved)
        
        function addDays(date: Date) {
            date.setDate(date.getDate() + 7)
            return date
        }

        const newRelate = relationRepo.create({
            book_id,
            user_id: id,
            devolution: addDays(new Date(reservedDate) || new Date()),
            createdAt: new Date(reservedDate) || new Date()
        })

        let result = await relationRepo.save(newRelate)
        return response.send(result)
    },

    async updateBookInfo(request: any, response: Response) {
        const { id, role } = request.userData
        const { book_id } = request.params;
        const { title, description, author, pages, quantity, status } = request.body

        const bookRepo = getRepository(Book);
        const authRepo = getRepository(User);

        let bookResult = await bookRepo.findOne(book_id)
        if(!bookResult) return response.status(400).send({ok: false})

        let authResult = await authRepo.findOne(id, role)
        if(!authResult) return response.status(400).send({ok: false, why: 'cannot-perform-method'})

        bookResult.title = title || bookResult.title 
        bookResult.description = description || bookResult.description
        bookResult.author = author || bookResult.author 
        bookResult.pages = pages || bookResult.pages
        bookResult.quantity = quantity || bookResult.quantity
        bookResult.status = status || bookResult.status

        let result = await bookRepo.save(bookResult)
        return response.send(result)
    }
}