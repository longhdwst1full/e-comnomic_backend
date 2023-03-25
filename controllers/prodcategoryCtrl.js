import PCategory from "../model/prodcategoryModel"
import asyncHandler from "express-async-handler"

const createCategory = asyncHandler(async (req, res) => {
    try {
        const newProduct = await PCategory.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//update 
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {

        const updateProduct = await PCategory.findByIdAndUpdate( id , req.body, {
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
    try {

        const deleteProduct = await PCategory.findOneAndDelete(id)
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

    try {
        const findProduct = await PCategory.findById(id)
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const result = await PCategory.find();
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