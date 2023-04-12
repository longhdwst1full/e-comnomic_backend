import express from "express";

import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";
import { createColor, deleteColor, getAllColor, getaColor, updateColor } from "../controllers/colorCtrl";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createColor)
router.put("/:id", authMiddleware, isAdmin, updateColor)
router.delete("/:id", authMiddleware, isAdmin, deleteColor)
router.get("/:id", getaColor)
router.get("/", getAllColor)

export default router