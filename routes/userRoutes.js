import express from 'express'
import { loginForm } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', loginForm)

export default router