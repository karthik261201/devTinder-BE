import express from "express";
import bcrypt from "bcrypt"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken"
// const express = require("express")
import { connectDB } from "./config/database.js";
import User from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import validator from "validator";

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
        const isPasswordValid = await bcrypt.compare(password,user.password)
        if(isPasswordValid) {
            // create JWT token 
            const token  = jwt.sign({_id:user._id},"DEV@Connect$777")
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

app.get("/profile", async (req,res) => {
    try {
        const cookies = req.cookies
        const { token } = cookies
        if(!token) {
            throw new Error("invalid token")
        }
        const decodedMessage = await jwt.verify(token,"DEV@Connect$777")
        const { _id } = decodedMessage
        const user = await User.findById(_id)
        if(!user) {
            throw new Error("user does not exist")
        }
        res.send(user)
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

// Get user by email
app.get("/user", async (req,res) => {
    try{
        const userEmail = req.body.emailId
        const user = await User.findOne({emailId: userEmail}) 
        if(user) {
            res.send(user)
        }
        else{
            res.status(404).send("user not found")
        }
    } catch(err) {
        res.status(400).send("something went wrong broo")
    }

    // try {
    //     const userEmail = req.body.emailId
    //     const users = await User.find({emailId: userEmail})
    //     if(users.length !== 0) {
    //         res.send(users)
    //     }
    //     else {
    //         res.status(404).send("User not found")
    //     }
    // }catch(err) {
    //     res.status(400).send("something went wrong!")
    // }
})

// Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req,res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch(err) {
        res.status(400).send("Somethin went wrong!")
    }
})

// Detele a user from the database
app.delete("/user", async (req,res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        if(!user) {
            res.status(404).send("user not found")
        }
        else {
            res.send("User Deleted Successfully!")
        }
    } catch(err) {
        res.status(400).send("Somethin went wrong!")
    }
})

// Update data of the user
app.patch("/user/:userId", async (req,res) => {
    const userId = req.params?.userId
    const data = req.body
    try {
        const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"]
        const isUpdateAllowed = Object.keys(data).every(k => ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed")
        }
        if(data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10")
        }
        const user = await User.findByIdAndUpdate(userId, data, {
            returnDocument: "after",
            runValidators: true
        })
        if(!user){
            res.status(404).send("user not found")
        }
        else {
            res.send("User Updated Successfully!")
        }
    } catch(err) {
        res.status(400).send("Update Failed: " + err.message)
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