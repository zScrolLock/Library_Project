import * as jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";

export const checkAuth = (request: any, response: Response, next: NextFunction) => {
    try {
        const decoded = jwt.verify(`Bearer ${request.headers.authorization}`.split(" ")[1], `${process.env.JWT_KEY}`);
        request.userData = decoded
        next();
    } catch(error) {
        console.log(error)
        return response.status(401).json({
            code: 401,
            message: 'Auth failed - Unauthorized'
        })
    }
}