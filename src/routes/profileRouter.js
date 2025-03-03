import { Router } from "express";
const profileRouter = Router()
import { userAuth } from "../middlewares/auth.js";

profileRouter.get("/profile", userAuth, async (req,res) => {
    try {
        const user = req.user
        res.send(user)
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

export default profileRouter