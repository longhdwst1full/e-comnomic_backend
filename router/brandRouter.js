import express from "express";
import { createBrand, deleteBrand, getaBrand, getAllBrand, updateBrand } from "../controllers/brandCtrl";
import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createBrand)
router.put("/:id", authMiddleware, isAdmin, updateBrand)
router.delete("/:id", authMiddleware, isAdmin, deleteBrand)
router.get("/:id", getaBrand)
router.get("/", getAllBrand)

export default router