// import express from "express";
const express = require("express")

const app = express()

app.get("/user",
    (req,res,next) => {
        console.log("Handling Route 1..")
        // res.send("1st response")
        next()
    },
    (req,res,next) => {
        console.log("Handling Route 2..")
        // res.send("2nd response")
        next()
    },
    (req,res,next) => {
        console.log("Handling Route 3..")
        // res.send("3rd response")
        next()
    },
    (req,res,next) => {
        console.log("Handling Route 4..")
        // res.send("4th response")
        next()
    },
    (req,res,next) => {
        console.log("handling Route 5..")
        res.send("5th response")
    }
)

app.listen(3000, () => {
    console.log("Server is successfully running on Port 3000");
})