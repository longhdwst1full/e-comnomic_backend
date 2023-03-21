import express from 'express';
import { createUser, deleteaUser, getAllUsers, getaUser, loginUserCtrl, updateaUser } from '../controllers/userCtrl';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlewares';

const router = express.Router();

router.post('/register', createUser)
router.post('/login', loginUserCtrl)
router.get('/all-users', getAllUsers)
router.get('/:id', authMiddleware, isAdmin,getaUser)
router.delete('/:id', deleteaUser)
// router.patch('/:id', updateaUser)
router.put('/:id', updateaUser)


export default router