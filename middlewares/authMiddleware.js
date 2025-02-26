export const adminAuth = (req,res,next) => {
    console.log("Admin auth being checked")
    const token = "abc"
    const isAuthorized = token === "xyz"
    if(isAuthorized) {
        next()
    }
    else {
        res.status(401).send("Unauthorized request")
    } 
}

export const userAuth = (req,res,next) => {
    console.log("User auth being checked")
    const token = "abc"
    const isAuthorized = token === "xyz"
    if(isAuthorized) {
        next()
    }
    else {
        res.status(401).send("Unauthorized request")
    }
}
// module.exports = { adminAuth }