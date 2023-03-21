import User from "../model/userModel"
import asyncHandler from 'express-async-handler';
import { generateToken } from "../config/jwtToken";

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
// login
const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
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

// get all uers
const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const getUsers = await User.find()
        return res.json(getUsers)
    } catch (error) {
        throw new Error(error)
    }
})
// get a single user
const getaUser = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const result = await User.findById(id)
        res.json(result)
    } catch (error) {
        throw new Error(error)
    }
})
// detete a single user
const deleteaUser = asyncHandler(async (req, res) => {
    try {
        const userDelete = await User.findByIdAndDelete(req.params?.id)
        return res.json(userDelete)
    } catch (error) {
        throw new Error(error)
    }
})
// update 
const updateaUser = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {
        const result = await User.findByIdAndUpdate(_id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, {
            new: true
        })
        return res.json(result)
    } catch (error) {
        throw new Error(error)
    }
})


const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
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
    updateaUser, unblockUser
}