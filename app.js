const express = require ('express')
const app = express()
 
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

/* Middlewares */
app.use(bodyParser.json())

/* Routes */
const authRoute = require('./routes/auth')
const postRoute = require('./routes/posts')
const commentRoute = require('./routes/comments')

app.use('/api/user', authRoute)
app.use('/api/posts', postRoute)
app.use('/api/comments', commentRoute)

app.get('/', (req, res) => {
   res.send('Hello World');
})

/* DB config */
mongoose.connect(process.env.DB_CONNECTOR, () => {
    console.log('Connected to DB')
})

/* Listener */
app.listen(3000, () => {
   console.log('Listening on port 3000');
})