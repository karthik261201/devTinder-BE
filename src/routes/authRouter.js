import { Router } from "express";
const authRouter = Router()
import { validateSignUpData } from "../utils/validation.js";
import User from "../models/user.js";
import validator from "validator";
import bcrypt from "bcrypt"

authRouter.post("/signup", async (req,res) => {
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

authRouter.post("/login", async (req,res) => {
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

authRouter.post("/logout", async (req,res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logged Out Successfully")
})

export default authRouter