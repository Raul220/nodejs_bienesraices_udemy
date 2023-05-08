import express from 'express'
import { loginForm, registryForm } from '../controllers/userController.js'

const router = express.Router()

router.get('/login', loginForm)
router.get('/registry', registryForm)

export default router