import express from "express";
const app = express()
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from './routes/authRoutes.js'
import patientRoutes from './routes/patientRoutes.js'

dotenv.config()
app.use(express.json())

app.use('/auth',authRoutes)
app.use('/patient', patientRoutes)

//Connecting Database and Then creating server
mongoose.connect(process.env.DB_URL, {}).then(()=>{
    console.log(`DataBase is Connected Successfully`)
    app.listen(process.env.PORT, ()=>{
        console.log(`Backend Server Is Running On PORT ${process.env.PORT}`)
    })
}).catch((err)=> console.log(err))