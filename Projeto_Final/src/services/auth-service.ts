import { Router } from "express"
import AuthController from "../controllers/AuthController"
import { checkAuth } from "../middleware/checkAuth"
const router_auth = Router()

// login
router_auth.post("/auth/login", AuthController.login)

// register
router_auth.post("/auth/register", AuthController.register)

// update
router_auth.put("/auth/update", checkAuth, AuthController.updateUserInfo)

// get user info
router_auth.get("/user", checkAuth, AuthController.getUser)

// add book to favorites
router_auth.post("/user/fav-books", checkAuth, AuthController.addFavoriteBook)

// get avorites 
router_auth.get("/user/fav-books", checkAuth, AuthController.retrieveFavs)

// delete book from favorites
router_auth.delete("/user/fav-books/:book_id", checkAuth, AuthController.removeFav)

// send mail
router_auth.post("/mail", checkAuth, AuthController.sendMail)

// retrieve mails
router_auth.get("/mail", checkAuth, AuthController.retrieveMails)

export { router_auth }