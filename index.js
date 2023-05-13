import express from 'express'
import userRoutes from './routes/userRoutes.js'
import db from "./config/db.js"

//Create app
const app = express()

// DB Conection
try {
    await db.authenticate();
    console.log("Success conection.")

} catch (e) {
    console.log(e)
}

//Enable pug
app.set('view engine', 'pug')
app.set('views', './views')

//Public folder
app.use( express.static('public') )

//Routing
app.use('/auth', userRoutes)

//Define a port and run the project
const port = 3000
app.listen(port, () => {
    console.log(`Server runing at port: ${port}`)
})