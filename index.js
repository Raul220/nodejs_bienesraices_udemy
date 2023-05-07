import express from 'express'
import userRoutes from './routes/userRoutes.js'

//Create app
const app = express()

//Routing
app.use('/', userRoutes)

//Define a port and run the project
const port = 3000
app.listen(port, () => {
    console.log(`Server runing at port: ${port}`)
})