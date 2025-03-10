import { Router } from "express";
const requestRouter = Router()
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res) => {
    try{
        const fromUserId = req.user._id
        const { toUserId, status } = req.params

        const allowedStatus = ["ignored", "interested"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: "Invalid status type"})
        }

        const toUser = await User.findById(toUserId)
        if(!toUser) {
            return res.status(400).json({ message: "User not found" })
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        })
        if(existingConnectionRequest) {
            return res.status(400).json({ message: "Connection Request already exists" })
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data = await connectionRequest.save()
        res.json({ message: "Connection Request Sent Successfully!" })
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
    try{
        const loggedInUser = req.user
        const { status, requestId } = req.params

        const allowedStatus = ["accepted", "rejected"]
        if(!allowedStatus.includes(status)) {
            return res.status(400).json({message: "invalid status type"})
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest) {
            res.status(400).json({message: "connection request not found"})
        }

        connectionRequest.status = status
        const data = await connectionRequest.save()
        res.json({ message: "Connection Request "+ status, data })
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

export default requestRouter