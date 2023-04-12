import express from "express";
import { createBlog, deleteBlog, disLiketheBlog, getAllBlog, getBlog, likeBlog, updateBlog, uploadImages } from "../controllers/blogCtrl";
import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";
import { blogImageResize, uploadPhoto } from "../middlewares/uploadImages";

const router = express.Router();


router.post("/", authMiddleware, isAdmin, createBlog)
router.put("/upload/:id",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 2), 
    blogImageResize,
    uploadImages)

router.put('/likes', authMiddleware, likeBlog)
router.put('/dislikes', authMiddleware, disLiketheBlog)

router.put("/:id", authMiddleware, isAdmin, updateBlog)
router.get("/:id", getBlog)

router.delete("/:id", authMiddleware, isAdmin, deleteBlog)

router.get("/", getAllBlog)

export default router