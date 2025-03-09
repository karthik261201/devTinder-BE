import { Router } from "express";
const requestRouter = Router()
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

requestRouter.get("/request/send/:status/:toUserId", userAuth, async (req,res) => {
    try{
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

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
        res.status(400).json({ message: "Connection Request Sent Successfully!" })
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

export default requestRouter