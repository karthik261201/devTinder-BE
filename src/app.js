// import express from "express";
const express = require("express")

const app = express()

app.use("/hello",(req,res) => {
    res.send("Hello from Hello page")
})

app.use("/test",(req,res) => {
    res.send("Hello from test page")
})

app.use((req,res) => {
    res.send("Hello from the main server");
})

app.listen(3000, () => {
    console.log("Server is successfully running on Port 3000");
})