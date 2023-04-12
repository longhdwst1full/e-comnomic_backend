
import asyncHandler from "express-async-handler"
import Coupon from "../model/couponModel"
import { validateMongodb } from "../utils/validateMongdb"

const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

//update 
const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updateCoupon)
    } catch (error) {
        throw new Error(error)
    }
})

//delete 
const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongodb(id)
    try {

        const deleteCoupon = await Coupon.findOneAndDelete(id)
        res.json({
            message: "Xoa thanh cong",
            data: deleteCoupon
        })
    } catch (error) {
        throw new Error(error)
    }
})

const getaCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const findCoupon = await Coupon.findById(id)
        res.json(findCoupon)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllCoupon = asyncHandler(async (req, res) => {
    try {
        const result = await Coupon.find();
        res.status(200).json(result)

    } catch (error) {
        throw new Error(error)
    }
})

export {
    getAllCoupon,
    getaCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon
}