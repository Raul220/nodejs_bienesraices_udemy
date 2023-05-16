import express from 'express'
import { forgotPasswordForm, loginForm, registryForm, registry, confirm, resetPassword } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', loginForm)

router.get('/registry', registryForm)
router.post('/registry', registry)

router.get("/confirm/:token", confirm)

router.get('/forgot-password', forgotPasswordForm)
router.post('/forgot-password', resetPassword)

export default router