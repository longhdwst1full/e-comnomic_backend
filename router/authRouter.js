import express from 'express';

import { authMiddleware, isAdmin } from '../middlewares/authMiddlewares';
import {

    blockUser, createOrderNew, createUser,
    deleteaUser,
    emptyCart,
    forgotPasswordToken,
    getAllOrders,
    getAllUsers,
    getMyorder,
    getOrderByUserId,
    getOrders,
    getUserCart,
    getWishlist,
    getaUser,
    handleRefreshToken,
    loginAdmin,
    loginUserCtrl,
    logout,
    removeProductFromCart,
    resetPassword,
    saveAddress,
    unblockUser,
    updateOrderStatus,
    updatePassword,
    updateQuantityProductFromCart,
    updatedUser,
    userCart
} from '../controllers/userCtrl';
import { checkout, paymentVerification } from '../controllers/payment';


const router = express.Router();
// 
router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
// 
router.put('/reset-password/:token', resetPassword)
router.put('/changepassword', authMiddleware, updatePassword)
// 
router.post('/login', loginUserCtrl)
router.post('/login-admin', loginAdmin)
router.post('/cart', authMiddleware, userCart)
router.post('/order/checkout', authMiddleware, checkout)
router.post('/order/paymentVerification', authMiddleware, paymentVerification)

// router.post('/cart/applycoupon', authMiddleware, applyCoupon)


router.get('/all-users', getAllUsers)
router.post('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/getmyorders', authMiddleware, getMyorder)
// router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
// router.get("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);

router.get('/cart', authMiddleware, getUserCart)
router.get('/wishlist', authMiddleware, getWishlist)
router.get('/:id', authMiddleware, getaUser)

router.put('/order/update-order/:id', authMiddleware, isAdmin, updateOrderStatus)

router.delete('/empty-cart', authMiddleware, emptyCart)
router.delete('/delete-product-cart', authMiddleware, removeProductFromCart)
router.post('/update-product-cart/:cartItemId/:newQuantity', authMiddleware, updateQuantityProductFromCart)
router.delete('/:id', authMiddleware, isAdmin, deleteaUser)
// router.patch('/:id', updateaUser)

router.put('/edit-user', authMiddleware, updatedUser)
router.put('/save-address', authMiddleware, saveAddress)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)


export default router