import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        count: Number,
        color: String,
        price: Number,
    }],
    cartTotal: Number,
    totalAfterDiscount: Number,
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },

}, {
        versionKey:false,
        timestamps: true,
});

//Export the model
export default mongoose.model('Cart', cartSchema);