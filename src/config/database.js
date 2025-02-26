import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect("mongodb+srv://karthiknarayanan2612:1Gc3Sp9MKHMaFxBq@namastenode.yhl2f.mongodb.net/devConnect")
}