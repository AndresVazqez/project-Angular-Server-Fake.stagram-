const express = require('express');
const cors = require('cors');
const { connectDb } = require('./src/utils/database/db');
const UserRoutes = require('./src/api/user/user.routes');
const cloudinary = require('cloudinary').v2;


const PORT = process.env.PORT || 8000;

connectDb(); 

const app = express();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    next()
})

app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4200'],
    credentials: true
}))

app.use(express.json({
    limit: '5mb'
}))

app.use(express.urlencoded({ limit: '5mb', extended: true }))


app.use('/api/users', UserRoutes);

app.use((error, req, res, next) => {
    return res.status(error.status || 500).json(error.message || 'Unexpected error')
})

app.listen(PORT, () => {

    console.log(`Listening on port ${PORT}`)
})


