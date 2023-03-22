import Product from "../model/productsModel"
import asyncHandler from "express-async-handler"
import slugify from "slugify"

const createProduct = asyncHandler(async (req, res) => {
    try {
        if (req.body?.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//update 
const updateProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate({ id }, req.body, {
            new: true
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

//delete 
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
       
        const deleteProduct = await Product.findOneAndDelete(id)
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params

    try {
        const findProduct = await Product.findByID(id)
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    try {
        const getAllProducts = await Product.find();
        res.json(getAllProducts)
    } catch (error) {
        throw new Error(error)
    }
})

export {
    getAllProducts,
    getaProduct,
    createProduct,
    updateProduct,
    deleteProduct
}