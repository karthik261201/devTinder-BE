import validator from "validator";

export const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body

    if(!firstName) {
        throw new Error("please enter firstname");
    }
    else if(!lastName) {
        throw new Error("please enter lastname");
    }
    else if(!validator.isEmail(emailId)) {
        throw new Error("please enter a valid email")
    }
    else if(!validator.isStrongPassword(password)) {
        throw new Error("please enter a strong password")
    }
}