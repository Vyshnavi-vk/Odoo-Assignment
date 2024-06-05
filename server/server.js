const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const roomRoutes = require('./routes/roomRoutes')


const app = express()
dotenv.config({ path: '../.env' })
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(express.json())

app.use('/api/room', roomRoutes)


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB')
        const database = mongoose.connection.useDb('test')
        const collection = database.collection('Room')

    })
    .catch((err) => console.log('Error connecting to DB', err))



const PORT = process.env.PORT || 8080

app.listen(5000, () => {
    console.log('Server running on port 5000')
})