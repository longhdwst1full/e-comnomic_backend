import Color from "../model/colorModel"
import asyncHandler from "express-async-handler"
import { validateMongodb } from "../utils/validateMongdb"

const createColor = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Color.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//update 
const updateColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const updateProduct = await Color.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//delete 
const deleteColor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const deleteProduct = await Color.deleteOne({ _id: id })
        res.json({
            message: "Xoa thanh cong",
            data: deleteProduct
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getaColor = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const findProduct = await Color.findById(id)
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllColor = asyncHandler(async (req, res) => {
    try {
        const result = await Color.find();
        res.status(200).json(result)


    } catch (error) {
        throw new Error(error)
    }
})

export {
    getAllColor,
    getaColor,
    createColor,
    updateColor,
    deleteColor
}