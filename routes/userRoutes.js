import express from 'express'
import { forgotPasswordForm, loginForm, registryForm } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', loginForm)
router.get('/registry', registryForm)
router.get('/forgot-password', forgotPasswordForm)

export default router