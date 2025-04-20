import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
// const express = require("express")
import { connectDB } from "./config/database.js";
import 'dotenv/config'

import authRouter from "./routes/authRouter.js";
import profileRouter from "./routes/profileRouter.js";
import requestRouter from "./routes/requestRouter.js";
import userRouter from "./routes/userRouter.js";

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

connectDB().then(() => {
    console.log("DB connected successfully")
    app.listen(process.env.PORT, () => {
        console.log("Server is successfully running on Port 3000");
    })
}).catch((err) => {
    console.error("DB connection failed")
}) ;