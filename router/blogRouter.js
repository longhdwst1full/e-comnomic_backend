import express from "express";
import { createBlog, deleteBlog, disLiketheBlog, getAllBlog, getBlog, likeBlog, updateBlog } from "../controllers/blogCtrl";
import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";

const router = express.Router();


router.post("/", authMiddleware, isAdmin, createBlog)
router.put('/likes', authMiddleware, likeBlog)
router.put('/dislikes', authMiddleware, disLiketheBlog)
router.put("/:id", authMiddleware, isAdmin, updateBlog)
router.get("/:id", getBlog)
router.get("/", getAllBlog)
router.delete("/:id", authMiddleware, isAdmin, deleteBlog)

export default router