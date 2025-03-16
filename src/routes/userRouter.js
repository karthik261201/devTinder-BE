import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";
const userRouter = Router()

const USER_SAFE_DATA = ["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"]

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",USER_SAFE_DATA)
        res.json({message: "Data fetched successfully",data: connectionRequest})
    }catch(err) {
        res.status(400).send("ERROR: "+ err.message)
    }
})

userRouter.get("/user/connections", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId:  loggedInUser._id, status: "accepted"}
            ]
        }).populate("toUserId",USER_SAFE_DATA).populate("fromUserId",USER_SAFE_DATA)
        
        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId
            }
            else {
                return row.fromUserId
            }
        })
        res.json({ data })
    }catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

userRouter.get("/feed", userAuth, async (req,res) => {
    try{
        const page = req.query.page || 1
        let limit = req.query.limit || 10
        const skip = (page-1)*limit
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set()
        connectionRequest.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString())
            hideUsersFromFeed.add(req.toUserId.toString())
        })
        
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit)
        res.send(users)
    }catch(err) {
        res.status(400).send("ERROR: " + err.message)
    }
})

export default userRouter