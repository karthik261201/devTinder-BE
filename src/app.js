import express from "express";
import cookieParser from "cookie-parser";
// const express = require("express")
import { connectDB } from "./config/database.js";

import authRouter from "./routes/authRouter.js";
import profileRouter from "./routes/profileRouter.js";
import requestRouter from "./routes/requestRouter.js";

const app = express()

app.use(express.json())
app.use(cookieParser())

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)

connectDB().then(() => {
    console.log("DB connected successfully")
    app.listen(3000, () => {
        console.log("Server is successfully running on Port 3000");
    })
}).catch((err) => {
    console.error("DB connection failed")
}) ;