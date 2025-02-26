import express from "express";
// const express = require("express")
import { connectDB } from "./config/database.js";
import User from "./models/user.js";

const app = express()

app.post("/signup",async (req,res) => {
    // creating new instance of User Model
    const user = new User({
        firstName: "Karthik",
        lastName: "Narayanan",
        emailId: "karthik043@gmail.com",
        password: "karthik@26"
    })

    try {
        await user.save()
        res.send("User Added Successfully!")
    } catch(err) {
        res.status(400).send("error in saving: "+err.message)
    }
})

connectDB().then(() => {
    console.log("DB connected successfully")
    app.listen(3000, () => {
        console.log("Server is successfully running on Port 3000");
    })
}).catch((err) => {
    console.error("DB connection failed")
}) ;