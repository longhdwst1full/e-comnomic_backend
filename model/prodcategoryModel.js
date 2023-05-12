import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        index: true,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false,
})

export default mongoose.model("PCategory", categorySchema)