import express from 'express';
import { createEnquiry, deleteEnquiry, getAllEnquiry, getaEnquiry, updateEnquiry } from '../controllers/enqCtrl';
import { authMiddleware, isAdmin } from '../middlewares/authMiddlewares';

const router = express.Router();

router.post("/", createEnquiry);
router.put("/:id", authMiddleware, isAdmin, updateEnquiry);
router.delete("/:id", authMiddleware, isAdmin, deleteEnquiry);
router.get("/:id", getaEnquiry);
router.get("/", getAllEnquiry);

export default router;