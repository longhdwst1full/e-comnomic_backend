import Brand from "../model/brandModel"
import asyncHandler from "express-async-handler"
import { validateMongodb } from "../utils/validateMongdb"

const createBrand = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Brand.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//update 
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const updateProduct = await Brand.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//delete 
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const deleteProduct = await Brand.deleteOne({ _id: id })
        res.json({
            message: "Xoa thanh cong",
            data: deleteProduct
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getaBrand = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const findProduct = await Brand.findById(id)
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const result = await Brand.find();
        res.status(200).json(result)


    } catch (error) {
        throw new Error(error)
    }
})

export {
    getAllBrand,
    getaBrand,
    createBrand,
    updateBrand,
    deleteBrand
}