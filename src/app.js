import express from "express";
// const express = require("express")
import { connectDB } from "./config/database.js";
import User from "./models/user.js";

const app = express()

app.use(express.json())

app.post("/signup",async (req,res) => {
    // creating new instance of User Model
    const user = new User(req.body)
    try {
        await user.save()
        res.send("User Added Successfully!")
    } catch(err) {
        res.status(400).send("error in saving: "+err.message)
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
app.get("/feed",async (req,res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch(err) {
        res.status(400).send("Somethin went wrong!")
    }
})

// Detele a user from the database
app.delete("/user",async (req,res) => {
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
app.patch("/user",async (req,res) => {
    const userId = req.body.userId
    const data = req.body
    try {
        const user = await User.findByIdAndUpdate(userId,data)
        if(!user){
            res.status(404).send("user not found")
        }
        else {
            res.send("User Updated Successfully!")
        }
    } catch(err) {
        res.status(400).send("Somethin went wrong!")
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