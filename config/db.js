import mongoose from "mongoose";

const dbConnect= ()=>{
    try {
        const conn= mongoose.connect("mongodb://localhost:27017/digitic")
    } catch (error) {
        console.log(error)
    }
}

export default dbConnect