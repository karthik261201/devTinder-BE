import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("invalid email")
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if(!["male", "female", "Others"].includes(value)) {
                throw new Error("Gender data not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.pnrao.com/wp-content/uploads/2023/06/dummy-user-male.jpg",
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("invalid url")
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user",
    },
    skills: {
        type: [String]
    }
},{
    timestamps: true
})

UserSchema.methods.getJWT = async function () {
    const user = this
    const token = await jwt.sign({_id:user._id}, "DEV@Connect$777", {expiresIn: "7d"})
    return token
}

UserSchema.methods.validatePassword = async function (passwordFromUser) {
    const user = this
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordFromUser,passwordHash)
    return isPasswordValid
}

export default mongoose.model("User",UserSchema)