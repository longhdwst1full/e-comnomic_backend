import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getaProduct, updateProduct
} from "../controllers/productsCtrl";
import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct)
router.get("/:id", getaProduct)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts)

export default router