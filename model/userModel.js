import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto"


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        // required: true,

    },
    lastName: {
        type: String,
        // required: true,

    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        required: true,
        default: 'user'
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: String
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    refreshToken: {
        type: String
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
},
    {
        versionKey: false,
        timestamps: true,
    })

userSchema.pre('save', async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// matchPassword
userSchema.methods.isPasswordMatched = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
};

userSchema.methods.createPasswordResetToken = async function () {
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resettoken)
        .digest("hex");

    this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);//10minutes
    // this.passwordResetToken=resettoken;
    return resettoken;
}

export default mongoose.model("User", userSchema);