import express from "express";
import {
    createCoupon,
    deleteCoupon, getaCoupon,
    getAllCoupon, updateCoupon
} from "../controllers/couponCtrl";

import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createCoupon)
router.get("/", authMiddleware, isAdmin, getAllCoupon)
router.put("/:id", authMiddleware, isAdmin, updateCoupon)
router.delete("/:id", authMiddleware, isAdmin, deleteCoupon)

export default router