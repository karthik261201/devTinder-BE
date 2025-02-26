import express from "express";
// const express = require("express")

const app = express()

import { adminAuth, userAuth } from "../middlewares/authMiddleware.js";

app.get("/user/login",(req,res) => {
    res.send("User Logged In Successfully")
})

app.get("/user/data", userAuth, (req,res) => {
    res.send("User Data sent")
})

app.get("/admin/getAllData", adminAuth, (req,res) => {
    res.send("All Data Sent..")
})

app.get("/admin/deleteUser", adminAuth, (req,res) => {
    res.send("Deleted a user..")
})

app.listen(3000, () => {
    console.log("Server is successfully running on Port 3000");
})