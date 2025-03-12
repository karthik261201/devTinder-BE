import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
const userRouter = Router()

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate("fromUserId",["firstName", "lastName", "photoUrl", "age", "gender", "about", "skills"])
        res.json({message: "Data fetched successfully",data: connectionRequest})
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

export default userRouter