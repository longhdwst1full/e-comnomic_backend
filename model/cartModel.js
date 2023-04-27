import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    quantity: {
        type: Number,
        require: true
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Color"
    },
    price: {
        type: Number,
        require: true
    },

}, {
    versionKey: false,
    timestamps: true,
});

//Export the model
export default mongoose.model('Cart', cartSchema);