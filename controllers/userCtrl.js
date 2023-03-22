import User from "../model/userModel"
import asyncHandler from 'express-async-handler';
import { generateToken } from "../config/jwtToken";
import { validateMongodb } from "../utils/validateMongdb";
import { generateRefreshToken } from "../config/refreshToken";
import jwt from "jsonwebtoken";

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

export {
    createUser,
    loginUserCtrl,
    getAllUsers,
    deleteaUser,
    blockUser,
    getaUser,
    updateaUser,
    unblockUser,
    handleRefreshToken,
    logout
}