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

        // filtering
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el])
        console.log(queryObj);
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

        let query = Product.find(JSON.parse(queryStr))


        // sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');

            query = query.sort(sortBy)
        }
        else {
            query = query.sort('-createAt');
        }

        // limiting the fields

        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields)
        }
        else {
            query = query.select("-__V")
        }

        // pagination

        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(limit);

        if (req.query.page) {
            const productCount = await Product.countDocuments();
            if (skip >= productCount) throw new Error("This page does not exist");

        }
        console.log(page, limit, skip);

        const products = await query
        res.json(products)
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