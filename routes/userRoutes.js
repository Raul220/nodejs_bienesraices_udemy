import express from 'express'

const router = express.Router()

router.route('')
    .get((req, res) => {
        res.send('Hello World')
    })
    .post((req, res) => {
        res.json({ message: 'Response type post' })
    })

export default router