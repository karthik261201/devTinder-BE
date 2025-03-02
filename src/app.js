import express from "express";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
// const express = require("express")
import { connectDB } from "./config/database.js";
import User from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import validator from "validator";

import { userAuth } from "./middlewares/auth.js";

const app = express()

app.use(express.json())
app.use(cookieParser())

app.post("/signup", async (req,res) => {
    try {
        // validate signup date
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body

        // encrypt the password
        const hashPassword = await bcrypt.hash(password,10)

        // creating new instance of User Model
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            emailId: emailId,
            password: hashPassword
        })

        await user.save()
        res.send("User Added Successfully!")

    } catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

app.post("/login", async (req,res) => {
    try{
        const { emailId, password } = req.body
        const isEmailValid = validator.isEmail(emailId)
        if(!isEmailValid) {
            throw new Error("email not valid")
        }
        const user = await User.findOne({emailId: emailId})
        if(!user) {
            throw new Error("invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid) {
            // create JWT token 
            const token  = await user.getJWT()
            res.cookie("token",token)
            res.send("Login Successful!")
        }
        else {
            throw new Error("invalid credentials")
        }
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

app.get("/profile", userAuth, async (req,res) => {
    try {
        const user = req.user
        res.send(user)
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

app.get("/sendCR", userAuth, async (req,res) => {
    const user = req.user
    res.send(user.firstName+" has sent the connection request")
})

connectDB().then(() => {
    console.log("DB connected successfully")
    app.listen(3000, () => {
        console.log("Server is successfully running on Port 3000");
    })
}).catch((err) => {
    console.error("DB connection failed")
}) ;