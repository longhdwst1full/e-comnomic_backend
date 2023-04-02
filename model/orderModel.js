import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        count: Number,
        color: String,
    }],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Cash on Delivery",
            "Processing",
            "Cancelled",
            "Delivered",
        ],
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, {
    timestamps: true,
    versionKey: false,

});

//Export the model
export default mongoose.model('Order', orderSchema);