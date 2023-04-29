import uniqid from 'uniqid';
import User from "../model/userModel"
import Product from "../model/productsModel"
import Coupon from "../model/couponModel"
import Order from "../model/orderModel"
import Cart from "../model/cartModel"
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

// admin a user
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // check admin exists or not
    const findAdmin = await User.findOne({ email });
    if (findAdmin.role !== "admin") throw new Error("Not Authorised")

    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
        // refreshToken 
        const refreshToken = await generateRefreshToken(findAdmin?._id)
        const updateUser = await User.findByIdAndUpdate(
            findAdmin.id,
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
            _id: findAdmin?._id,
            firstName: findAdmin?.firstName,
            lastName: findAdmin?.lastName,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
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
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");

    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });

    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); // forbidden
    }
    await User.findOneAndUpdate(refreshToken, {
        refreshToken: "",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
    });
    res.sendStatus(204); // forbidden
});


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
const updatedUser = asyncHandler(async (req, res) => {
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
        user.passwordResetExpires = Date.now() + 600000; // 10 phút
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

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

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


const getWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;

    try {
        const findUser = await User.findById(_id).populate("wishlist");
        res.json(findUser);
    } catch (error) {
        throw new Error(error)
    }
})

// save user address
const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodb(_id)

    try {
        const updateUserAddress = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,
        }, {
            new: true
        })
        res.json(updateUserAddress)
    } catch (error) {
        throw new Error(error)
    }
})


const userCart = asyncHandler(async (req, res) => {

    const { _id } = req.user;
    validateMongodb(_id);

    try {
        let newCart = await new Cart({
            userId: _id,
            productId: req.body.productId,
            color: req.body.color,
            price: req.body.price,
            quantity: req.body.quantity

        }).save();
        res.json(newCart)
    }
    catch (error) {
        throw new Error(error)
    }
})

// const userCart = asyncHandler(async (req, res) => {
//     const { cart } = req.body;
//     const { _id } = req.user;
//     validateMongodb(_id);

//     try {
//         let products = []
//         const user = await User.findById(_id);
//         // check if user already hava product in cart
//         const aleadyExistCart = await Cart.findOne({ orderby: user._id })

//         if (aleadyExistCart) {
//             aleadyExistCart.remove();

//         }

//         for (let i = 0; i < cart.length; i++) {
//             let object = {};
//             object.product = cart[i]._id;
//             object.count = cart[i].count;
//             object.color = cart[i].color;
//             let getPrice = await Product.findById(cart[i]._id).select("price").exec();
//             object.price = getPrice.price
//             products.push(object);
//         }

//         let cartTotal = 0
//         for (let i = 0; i < products.length; i++) {
//             cartTotal = cartTotal + products[i].price * products[i].count;
//         }

//         let newCart = await new Cart({
//             products,
//             cartTotal,
//             orderby: user?._id
//         }).save();

//         res.json(newCart);


//     }
//     catch (error) {
//         throw new Error(error)
//     }
// })

export const removeProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { cartItemId } = req.body
    validateMongodb(_id);
    try {
        const deleteProducts = await Cart.deleteOne({
            userId: _id,
            _id: cartItemId
        })
        return res.json(deleteProducts);
    } catch (error) {
        throw new Error(error)
    }
})
export const updateQuantityProductFromCart = asyncHandler(async (req, res) => {
    const { _id } = req.user
    validateMongodb(_id);
    const { cartItemId, newQuantity } = req.params
    try {
         
        const cartItem = await Cart.findOne({
            userId: _id,
            _id: cartItemId

        })
        
        cartItem.quantity = newQuantity
        cartItem.save()
        return res.json(cartItem);
    } catch (error) {
        throw new Error(error)
    }
})

const getUserCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodb(_id);

    try {
        const cart = await Cart.find({ userId: _id })
            .populate("productId")
            .populate("color")
        res.json(cart)

    } catch (error) {
        throw new Error(error)
    }
})

const emptyCart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodb(_id);
    try {
        const user = await User.findOne({ _id });
        const cart = await Cart.findOneAndRemove({ orderby: user._id });
        res.json(cart);
    } catch (error) {
        throw new Error(error);
    }
});


// phieu mua hang : counpon 
const applyCoupon = asyncHandler(async (req, res) => {
    const { coupon } = req.body;
    const { _id } = req.user;
    validateMongodb(_id);

    const validCoupon = await Coupon.findOne({ name: coupon });
    if (validCoupon === null) {
        throw new Error("Invalid Coupon");
    }
    const user = await User.findOne({ _id });
    let { cartTotal } = await Cart.findOne({
        orderby: user._id,
    }).populate("products.product");

    let totalAfterDiscount = (
        cartTotal -
        (cartTotal * validCoupon.discount) / 100
    ).toFixed(2);

    await Cart.findOneAndUpdate(
        { orderby: user._id },
        { totalAfterDiscount },
        { new: true }
    );
    res.json(totalAfterDiscount);
});



const createOrder = asyncHandler(async (req, res) => {
    const { COD, couponApplied } = req.body;
    const { _id } = req.user;
    validateMongodb(_id);

    try {
        if (!COD) throw new Error("Create cash order failed");

        const user = await User.findById(_id);
        let userCart = await Cart.findOne({ orderby: user._id });
        let finalAmout = 0;

        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmout = userCart.totalAfterDiscount;

        }
        else {
            finalAmout = userCart.cartTotal;
        }
        let newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmout,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderby: user._id,
            orderStatus: "Cash on Delivery",
        }).save();

        let update = userCart.products.map(item => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } }
                },
            };
        });

        const udpated = await Product.bulkWrite(update, {});
        res.json({ message: "success" })
    } catch (error) {

        throw new Error(error);
    }
})

const getOrders = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongodb(_id);

    try {
        const userOrder = await Order.findOne({ orderby: _id })
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(userOrder)
    } catch (error) {
        throw new Error(error)
    }
})

const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const alluserorders = await Order.find()
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(alluserorders);
    } catch (error) {
        throw new Error(error);
    }
});


const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    validateMongodb(id)

    try {
        const updateOrderStatus = await Order.findByIdAndUpdate(id, {
            orderStatus: status,
            paymentIntent: {
                status: status,
            },

        }, {
            new: true
        })
        res.json(updateOrderStatus)
    } catch (error) {
        throw new Error(error)
    }

})

const getOrderByUserId = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id);
    try {
        const userorders = await Order.findOne({ orderby: id })
            .populate("products.product")
            .populate("orderby")
            .exec();
        res.json(userorders);
    } catch (error) {
        throw new Error(error);
    }
});

export {
    createUser,
    loginUserCtrl,
    getAllUsers,
    getaUser,
    deleteaUser,
    updatedUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishlist,
    saveAddress,
    userCart,
    getUserCart,
    emptyCart,
    applyCoupon,
    createOrder,
    getOrders,
    updateOrderStatus,
    getAllOrders,
    getOrderByUserId,
}