
import asyncHandler from "express-async-handler"
import BCategory from "../model/blogCatModel"
import { validateMongodb } from "../utils/validateMongdb"

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newProduct = await BCategory.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//update 
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const updateProduct = await BCategory.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//delete 
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const deleteProduct = await BCategory.findOneAndDelete(id)
        res.json({
            message: "Xoa thanh cong",
            data: deleteProduct
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getaCategory = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const findProduct = await BCategory.findById(id)
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const result = await BCategory.find();
        res.status(200).json(result)


    } catch (error) {
        throw new Error(error)
    }
})

export {
    getAllCategory,
    getaCategory,
    createCategory,
    updateCategory,
    deleteCategory
}