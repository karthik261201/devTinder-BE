import jwt from "jsonwebtoken"
import User from "../models/user.js"

export const userAuth = async (req,res,next) => {
    try {
        const { token } = req.cookies
        if(!token) {
            throw new Error("token invalid!!")
        }
        const decodedObj = await jwt.verify(token,"DEV@Connect$777")
        const { _id } = decodedObj
        const user = await User.findById(_id)
        if(!user) {
            throw new Error("user does not exist")
        }
        req.user = user
        next()
    } catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
}