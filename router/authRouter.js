import express from 'express';
import { blockUser, createUser, deleteaUser, forgotPasswordToken, getAllUsers, getaUser, handleRefreshToken, loginUserCtrl, logout, resetPassword, unblockUser, updateaUser, updatePassword } from '../controllers/userCtrl';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlewares';

const router = express.Router();

router.post('/register', createUser)
router.post('/forgot-password-token', forgotPasswordToken)
router.put('/reset-password/:token', resetPassword)
router.put('/changepassword', authMiddleware, updatePassword)
router.post('/login', loginUserCtrl)
router.get('/all-users', getAllUsers)
router.get('/refresh', handleRefreshToken)
router.get('/logout', logout)
router.get('/:id', authMiddleware, isAdmin, getaUser)
router.delete('/:id', deleteaUser)
// router.patch('/:id', updateaUser)
router.put('/edit-user', authMiddleware, updateaUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)


export default router