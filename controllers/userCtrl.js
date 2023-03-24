import User from "../model/userModel"
import asyncHandler from 'express-async-handler';
import { generateToken } from "../config/jwtToken";
import { validateMongodb } from "../utils/validateMongdb";
import { generateRefreshToken } from "../config/refreshToken";
import jwt from "jsonwebtoken";
import sendEmail from "./emailCtrl";
import crypto from "crypto"

const createUser = asyncHandler(async (req, res) => {
    const findUser = await User.findOne({ email: req.body?.email })
    if (!findUser) {
        // create user
        const newUser = User.create(req.body)
        res.json(newUser)
    }
    else {
        throw new Error('User already exists')
    }
});
// login a user
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
        // refreshToken 
        const refreshToken = await generateRefreshToken(findUser?._id)
        const updateUser = await User.findByIdAndUpdate(
            findUser.id,
            {
                refreshToken: refreshToken
            },
            {
                new: true
            })
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        });


        res.json({
            _id: findUser?._id,
            firstName: findUser?.firstName,
            lastName: findUser?.lastName,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }
    else {
        throw new Error("Invalid Creadentrals")
    }
})

// handle refresh token
const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    // console.log(cookie);
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken
    console.log(refreshToken)
    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error("No refresh token present in db or not matched");

    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        console.log(decoded)
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with the refresh token")
        }
        const accessToken = generateToken(user?._id)
        res.json({ accessToken })
    })
})

//logout functionality
const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error("No refresh token in cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
})

// get all uers
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})
// get a single user
const getaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    // check id 
    validateMongodb(id)
    try {
        const result = await User.findById(id)
        res.json(result)
    } catch (error) {
        throw new Error(error)
    }
})
// detete a single user
const deleteaUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id);

    try {
        const userDelete = await User.findByIdAndDelete(id)
        res.json(userDelete)
    } catch (error) {
        throw new Error(error)
    }
})
// update  a user
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    // check id 
    validateMongodb(_id)
    try {
        const result = await User.findByIdAndUpdate(_id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true
        })
        res.json(result)
    } catch (error) {
        throw new Error(error)
    }
})


const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const block = await User.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { new: true }
        )
        res.json({
            message: "User blocked",
            data: block
        })

    } catch (error) {
        throw new Error(error)
    }
})

const unblockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const unblock = await User.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { new: true }
        )

        res.json({
            message: "User unblocked",
            data: unblock
        })
    } catch (error) {
        throw new Error(error)
    }
})


// update password 
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { password } = req.body
    validateMongodb(_id)
    const user = await User.findById(_id);
    if (password) {
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);

    }
    else {
        res.json(user)
    }
})

// forgot password token
const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error(`User not found with this email`);
    try {
        // Generate a password reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Set the token and expiration time on the user object
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // const token = await user.createPasswordResetToken();
        const resetURL = `Hi, please follow this link ti reset your Password . This link is valid till 10 minutes from now . <a href="http://localhost:5000/api/user/reset-password/${resetToken}">Click here</a>`
        const data = {
            to: email,
            text: "Hey User",
            subject: "Forgot Password link",
            html: resetURL

        };
        sendEmail(data);
        res.json(resetToken)
    } catch (error) {
        throw new Error(error)
    }
})

// reset password 
const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken, "hashed token")
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    console.log(user, "uer_df")
    if (!user) throw new Error('Token Expired, Please try again later');
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user)

    // 
    // Reset the user's password and clear the reset token and expiration time
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save the updated user object
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
})
export {
    resetPassword,
    forgotPasswordToken,
    createUser,
    loginUserCtrl,
    getAllUsers,
    deleteaUser,
    blockUser,
    getaUser,
    updateaUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword
}