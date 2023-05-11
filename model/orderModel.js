import mongoose from "mongoose"; // Erase if already required

// Declare the Schema of the Mongo model
const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true
    },

    shippingInfo: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        other: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        },
    },
    paymentInfo: {
        razorpayOrderId: {
            type: String,
            // required: true
        },
        razorpayPaymentId: {
            type: String,
            // required: true
        }
    },

    orderItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            require: true
        },
        quantity: {
            type: Number,
            required: true
        },
        color: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Color",
            require: true
        },
        price: {
            type: Number,
            require: true
        }
    }],
    paidAt: {
        type: Date,
        default: Date.now()
    },
    totalPrice: {
        type: Number,
        require: true
    },
    totalPriceAfterDisccount: {
        type: Number,
        require: true
    }
    ,
    orderStatus: {
        type: String,
        default: 'Orderede',
        // enum: [
        //     "Not Processed",
        //     "Cash on Delivery",
        //     "Processing",
        //     "Cancelled",
        //     "Delivered",
        // ],
    }

}, {
    timestamps: true,
    versionKey: false,

});

//Export the model
export default mongoose.model('Order', orderSchema);