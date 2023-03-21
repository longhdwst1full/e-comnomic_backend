import express from 'express';
import { blockUser, createUser, deleteaUser, getAllUsers, getaUser, loginUserCtrl, unblockUser, updateaUser } from '../controllers/userCtrl';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlewares';

const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUserCtrl)
router.get('/all-users', getAllUsers)
router.get('/:id', authMiddleware, isAdmin, getaUser)
router.delete('/:id', deleteaUser)
// router.patch('/:id', updateaUser)
router.put('/edit-user', authMiddleware, updateaUser)
router.put("/block-user/:id", authMiddleware, isAdmin, blockUser)
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)


export default router