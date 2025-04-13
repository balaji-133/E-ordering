import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://kundrapubalaji251:Balaji12345@cluster0.zamvxj2.mongodb.net/food-del').then(()=>{
        console.log("MongoDB connected successfully")
    })
}