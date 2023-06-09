import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';


// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PCategory",
        require: true
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: String,
            url: String,
        },
    ],
    color: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Color"
        }
    ],
    tags: String,
    ratings: [
        {
            star: Number,
            comment: String,
            postedby: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    totalrating: {
        type: String,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false,
});

productSchema.plugin(mongoosePaginate)
//Export the model
export default mongoose.model('Product', productSchema);