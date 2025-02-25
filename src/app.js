// import express from "express";
const express = require("express")

const app = express()

app.get("/user",(req,res) => {
    console.log(req.query)
    res.send({firstname: "Karthik", lastname: "Narayanan"})
})

app.post("/user",(req,res) => {
    res.send("Data saved successfully saved to the DB")
})

app.delete("/user",(req,res) => {
    res.send("Deleted successfully")
})

app.use("/test",(req,res) => {
    res.send("Hello from test page")
})

app.listen(3000, () => {
    console.log("Server is successfully running on Port 3000");
})