import Enquiry from "../model/enqModel"
import asyncHandler from "express-async-handler"
import { validateMongodb } from "../utils/validateMongdb"

const createEnquiry = asyncHandler(async (req, res) => {
    try {
        const newProduct = await Enquiry.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//update 
const updateEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const updateProduct = await Enquiry.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//delete 
const deleteEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const deleteProduct = await Enquiry.findOneAndDelete(id)
        res.json({
            message: "Xoa thanh cong",
            data: deleteProduct
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getaEnquiry = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)

    try {
        const findProduct = await Enquiry.findById(id)
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllEnquiry = asyncHandler(async (req, res) => {
    try {
        const result = await Enquiry.find();
        res.status(200).json(result)


    } catch (error) {
        throw new Error(error)
    }
})

export {
    getAllEnquiry,
    getaEnquiry,
    createEnquiry,
    updateEnquiry,
    deleteEnquiry
}