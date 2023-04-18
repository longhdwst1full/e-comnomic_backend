import express from "express";
import {
    createCoupon,
    deleteCoupon, getaCoupon,
    getAllCoupon, updateCoupon
} from "../controllers/couponCtrl";

import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";

const router = express.Router();

router.get("/", authMiddleware, isAdmin, getAllCoupon)
router.post("/", authMiddleware, isAdmin, createCoupon)
router.get("/:id", authMiddleware, isAdmin, getaCoupon)
router.put("/:id", authMiddleware, isAdmin, updateCoupon)
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon)

export default router