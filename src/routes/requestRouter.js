import { Router } from "express";
const requestRouter = Router()
import { userAuth } from "../middlewares/auth.js";

requestRouter.get("/sendCR", userAuth, async (req,res) => {
    const user = req.user
    res.send(user.firstName+" has sent the connection request")
})

export default requestRouter