import express from "express";
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getaProduct, updateProduct
} from "../controllers/productsCtrl";

const router = express.Router();

router.post("/", createProduct)
router.get("/:id", getaProduct)
router.get("/", getAllProducts)
router.put("/:id", updateProduct)
router.delete("/:id", deleteProduct)

export default router