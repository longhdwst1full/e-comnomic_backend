import express from "express";
import { createCategory, deleteCategory, getaCategory, getAllCategory, updateCategory } from "../controllers/blogCatCtrl";
import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCategory)
router.put("/:id", authMiddleware, isAdmin, updateCategory)
router.delete("/:id", authMiddleware, isAdmin, deleteCategory)
router.get("/:id", getaCategory)
router.get("/", getAllCategory)

export default router