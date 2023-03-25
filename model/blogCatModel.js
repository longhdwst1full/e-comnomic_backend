import mongoose from "mongoose";


const blogCateSchema = new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        index:true,
        required: true
    }
},
    {
       
        timestamps: true
    }
)

export default mongoose.model("BCategory", blogCateSchema)