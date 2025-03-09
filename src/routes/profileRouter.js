import { Router } from "express";
const profileRouter = Router()
import { userAuth } from "../middlewares/auth.js";
import { validateEditData } from "../utils/validation.js"

profileRouter.get("/profile/view", userAuth, async (req,res) => {
    try {
        const user = req.user
        res.send(user)
    }catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
    try{
        if(!validateEditData(req)) {
            throw new Error("Invalid Edit Request")
        }
        
        const loggedInUser = req.user
        Object.keys(req.body).forEach(key => loggedInUser[key]=req.body[key])
        await loggedInUser.save()
        res.send(`${loggedInUser.firstName}, your profile Updated Sucessfuly`)
    } catch(err) {
        res.status(400).send("ERROR: "+err.message)
    }
})

export default profileRouter