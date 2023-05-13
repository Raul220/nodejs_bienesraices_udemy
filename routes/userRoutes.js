import express from 'express'
import { forgotPasswordForm, loginForm, registryForm, registry } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', loginForm)

router.get('/registry', registryForm)
router.post('/registry', registry)

router.get('/forgot-password', forgotPasswordForm)

export default router