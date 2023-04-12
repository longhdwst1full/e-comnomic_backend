import express from "express"
import { authMiddleware, isAdmin } from "../middlewares/authMiddlewares";
import { productsImageResize, uploadPhoto } from "../middlewares/uploadImages";
import { deleteImages, uploadImages } from "../controllers/uploadCtrl";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    isAdmin,
    uploadPhoto.array("images", 10),
    productsImageResize,
    uploadImages
);

router.delete("/delete-img/:id", authMiddleware, isAdmin, deleteImages);

export default router;
