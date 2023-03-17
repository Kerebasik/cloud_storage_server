import { body} from 'express-validator';
import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import {AuthController} from "../controllers/authController";
const authRoutes = express.Router();


authRoutes.post('/registration',
    body('email').isEmail(),
    body('password').isLength({min:3, max:12}), AuthController.registration
)

authRoutes.post('/login', AuthController.login
 )

authRoutes.post('/auth', authMiddleware, AuthController.auth
 )

export default authRoutes;