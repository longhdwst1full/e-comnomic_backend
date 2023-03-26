import express from "express";
import {
    addToWishlist,
    createProduct,
    deleteProduct,
    getAllProducts,
    getaProduct,
    rating,
    updateProduct
} from "../controllers/productsCtrl";
import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct)
router.put("/wishlist", authMiddleware, addToWishlist)
router.put("/rating", authMiddleware,rating)
router.get("/:id", getaProduct)
router.put("/:id", authMiddleware, isAdmin, updateProduct)
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)
router.get("/", getAllProducts)

export default router