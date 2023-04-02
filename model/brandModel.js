import mongoose from "mongoose";

const brandSchema= new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        index:true,
        required: true
    }
},{
    timestamps:true,
    versionKey:false,

})

export default mongoose.model("Brand",brandSchema)