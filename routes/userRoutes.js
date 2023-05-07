import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('Hello World')
})

router.get('/we', (req, res) => {
    res.json({ message: 'Our page'})
})

export default router