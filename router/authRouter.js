import express from 'express';
import { applyCoupon, blockUser, createOrder, createUser, deleteaUser, emotyCart, forgotPasswordToken, getAllUsers, getaUser, getOrders, getUserCart, getWishList, handleRefreshToken, loginAdminCtrl, loginUserCtrl, logout, resetPassword, saveAddress, unblockUser, updateaUser, updateOrderStatus, updatePassword, userCart } from '../controllers/userCtrl';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlewares';

const router = express.Router();

router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/changepassword', authMiddleware, updatePassword)

router.post('/login', loginUserCtrl)
router.post('/login-admin', loginAdminCtrl)
router.post('/cart', authMiddleware, userCart)
router.post('/cart/applycoupon', authMiddleware, applyCoupon)
router.post('/cart/cash-order', authMiddleware, createOrder)

router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/get-orders',authMiddleware, getOrders)
router.get('/cart', authMiddleware, getUserCart)
router.get('/wishlist', authMiddleware, getWishList)
router.get('/:id', authMiddleware, getaUser)

router.put('/order/update-order/:id', authMiddleware, isAdmin,updateOrderStatus)
router.delete('/cart', authMiddleware, emotyCart)
router.delete('/:id', authMiddleware, isAdmin, deleteaUser)
// router.patch('/:id', updateaUser)
router.put('/edit-user', authMiddleware, updateaUser)
router.put('/save-address', authMiddleware, saveAddress)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)


export default router