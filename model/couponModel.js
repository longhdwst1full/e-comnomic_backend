import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false,

})


export default mongoose.model("Coupon", couponSchema)