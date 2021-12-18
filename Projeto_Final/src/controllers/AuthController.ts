import { Request, Response } from "express";
import { getRepository } from "typeorm";
import User from "../models/Auth";
import * as JWT from 'jsonwebtoken'
import Book from "../models/Book";
import * as _ from 'lodash'
import Mail from "../models/Mail";
import * as dotenv from 'dotenv'
dotenv.config()

enum userRole {
    NORMAL = "NORMAL",
    EMPLOYEE = "EMPLOYEE"
}

export default {
    async login(request: Request, response: Response) {
        const { username, password, email } = request.body;
        const authUser = getRepository(User);

        if(!username){
            const result = await authUser.findOne({
                email,
                password
            })

            if(!result) return response.status(400).send({
                ok: false,
                why: 'User not found'
            }) 

            const token = JWT.sign({
                id: result.id,
                name: result.username,
                role: result.role
            }, process.env.JWT_KEY)

            return response.status(200).send({
                ok: true,
                user: result.name,
                token: token
            })
        } else {
            const result = await authUser.findOne({
                username,
                password
            })

            if(!result) return response.status(400).send({
                ok: false,
                why: 'User not found'
            }) 

            const token = JWT.sign({
                id: result.id,
                name: result.username,
                role: result.role
            }, process.env.JWT_KEY)

            return response.status(200).send({
                ok: true,
                user: result.name,
                token: token
            })
        }
    },

    async register(request: Request, response: Response) {
        const {
            first_name,
            last_name,
            username,
            password,
            email,
            adminCode
        } = request.body
        const userAuth = getRepository(User)
        
        let findUser = await userAuth.findOne({username: username})
        if(findUser) return response.send({ok: false, why: 'username-already'})

        findUser = await userAuth.findOne({email: email})
        if(findUser) return response.send({ok: false, why: 'email-already'})

        let newUser;
        
        if(adminCode === process.env.ADMIN_CODE){
            newUser = userAuth.create({
                first_name,
                last_name,
                username: username.toLowerCase(),
                password,
                name: first_name + ' ' + last_name,
                email: email.toLowerCase(),
                role: userRole.EMPLOYEE
            })
        } else {
            newUser = userAuth.create({
                first_name,
                last_name,
                username: username.toLowerCase(),
                password,
                name: first_name + ' ' + last_name,
                email: email.toLowerCase()
            })
        }

        return response.status(201).json(await userAuth.save(newUser))
    },

    async getUser(request: any, response: Response){
        const { id, name } = request.userData
        const authRepo = getRepository(User);

        const user = await authRepo.findOne(id, name);
        if(!user) return response.status(400).send({ok: false})
        return response.status(200).send(user)
    },

    async addFavoriteBook(request: any, response: Response){
        const { id } = request.userData
        const { book_id } = request.body

        const authRepo = getRepository(User)
        const bookRepo = getRepository(Book)

        let bookResult = await bookRepo.findOne(book_id)
        if(!bookResult) return response.status(400).send({ok: false})
        
        let authResult = await authRepo.findOne(id, { relations: ['favorites']})
        if(!authResult) return response.status(400).send({ok: false})

        const index = _.find(authResult.favorites, function(o){
            return o.id === bookResult.id
        })

        if(index) return response.send({ok: false, message: 'alredy-relate'})

        authResult.favorites.push(bookResult)
        let result = await authRepo.save(authResult)
        return response.status(200).send(result)
    },

    async removeFav(request: any, response: Response) {
        const { id } = request.userData
        const { book_id } = request.params;

        const authRepo = getRepository(User)
        const bookRepo = getRepository(Book)

        let bookResult = await bookRepo.findOne(book_id)
        if(!bookResult) return response.status(400).send({ok: false})
        
        let authResult = await authRepo.findOne(id, { relations: ['favorites']})
        if(!authResult) return response.status(400).send({ok: false})

        authResult.favorites = authResult.favorites.filter(book => {
            return book.id === book_id
        })

        let result = await authRepo.save(authResult)
        return response.status(200).send(result)
    },

    async retrieveFavs(request: any, response: Response) {
        const { id } = request.userData
        const authRepo = getRepository(User)

        let favsResult = await authRepo.find({ relations: ['favorites'], where: {'id': id}})
        if(!favsResult) return response.status(400).send({ok: false})

        return response.status(200).send(favsResult)
    },

    async updateUserInfo(request: any, response: Response) {
        const { id } = request.userData
        const { first_name, last_name, email} = request.body

        const authRepo = getRepository(User)
        let authResult = await authRepo.findOne(id)

        if(!authResult) return response.status(400).send({ok: false, why: 'user-not-foud'})

        authResult.first_name = first_name || authResult.first_name 
        authResult.last_name =  last_name || authResult.last_name
        authResult.email = email || authResult.email
        authResult.name = authResult.first_name + ' ' + authResult.last_name

        let result = await authRepo.save(authResult)
        return response.status(200).send(result)
    },

    async sendMail(request: any, response: Response){
        const { id } = request.userData
        const { title, about, message } = request.body
        const mailRepo = getRepository(Mail)

        const newMail = mailRepo.create({
            user_id: id,
            createdAt: new Date(),
            title,
            about,
            message
        })
        return response.status(201).json(await mailRepo.save(newMail));
    },

    async retrieveMails(request: any, response: Response) {
        const { id } = request.userData
        const mailRepo = getRepository(Mail)

        let mailsResult = await mailRepo.find({user_id: id})
        if(!mailsResult) return response.status(400).send({ok: false})

        mailsResult = _.orderBy(mailsResult, ['createdAt', 'user_id'], ['desc'])
  
        return response.status(200).send(mailsResult)
    }
}