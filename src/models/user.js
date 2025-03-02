import mongoose from "mongoose";
import validator from "validator";

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

export default mongoose.model("User",UserSchema)