import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    numViews: {
        type: Number,
        default: 0
    },
    isLiked: {
        type: Boolean,
        default: false
    },
    isDisliked: {
        type: Boolean,
        default: false
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
    ],
    dislikes: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
        },
    ],
    image: {
        type: String,
        default: "https://i.pinimg.com/236x/c6/de/18/c6de1888b5580405a4a715b6a8619868.jpg"
    },
    author: {
        type: String,
        default: "Admin"
    }
},
    {
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true,
        },
        timestamps: true
    }
)

export default mongoose.model("Blog", blogSchema)