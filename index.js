const express = require('express')

//Create app
const app = express()

//Routing
app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/we', (req, res) => {
    res.json({ message: 'Our page'})
})

//Define a port and run the project
const port = 3000
app.listen(port, () => {
    console.log(`Server runing at port: ${port}`)
})