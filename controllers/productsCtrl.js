import Product from "../model/productsModel"
import User from "../model/userModel"
import asyncHandler from "express-async-handler"
import { validateMongodb } from "../utils/validateMongdb"
import slugify from "slugify"
import PCategory from "../model/prodcategoryModel"


import fs from "fs";
import { cloudinaryUploadImg } from "../utils/cloudinary"

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
    validateMongodb(id)
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
    validateMongodb(id)
    try {
        const _id = id
        const deleteProduct = await Product.findByIdAndDelete(_id)
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const getaProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const findProduct = await Product.findById(id)
            .populate("color")
        res.json(findProduct)

    } catch (error) {
        throw new Error(error)
    }
})

const getAllProducts = asyncHandler(async (req, res) => {
    const { _sort = "createdAt", _order = "asc", _limit = 10, _page = 1, _expand, _categoryId, priceMin, priceMax } = req.query;

    const filter = {};



    if (priceMin && priceMax) {
        filter.price = { $gt: priceMin, $lte: priceMax };
    } else if (priceMin) {
        filter.price = { $gt: priceMin };
    } else if (priceMax) {
        filter.price = { $lt: priceMax };
    }
    const populateOptions = _categoryId ? [{ path: "categoryId", model: "PCategory" }] : [];

    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order === "desc" ? -1 : 1,
        }

    }
    try {
        const respon = await Product.paginate(filter, { ...options, populate: populateOptions })
        if (respon.docs.length === 0) res.status(200).json({
            code: 404,
            message: "No products found"
        });

        const response = {
            data: respon.docs,
            pagination: {
                currentPage: respon.page,
                totalPages: respon.totalPages,
                totalItems: respon.totalDocs,
            },
        };
        return res.status(200).json(response);
    } catch (error) {
        throw new Error(error);
    }
})


const addToWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { prodId } = req.body;
    try {
        const user = await User.findById(_id);
        const alreadyadded = user.wishlist.find((id) => id.toString() === prodId);

        if (alreadyadded) {
            let user = await User.findByIdAndUpdate(_id,
                {
                    $pull: { wishlist: prodId },
                },
                {
                    new: true,
                })

            res.json(user)
        }
        else {
            let user = await User.findByIdAndUpdate(_id,
                {
                    $push: { wishlist: prodId },
                },
                {
                    new: true,
                })

            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})


const rating = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, prodId, comment } = req.body;
    // console.log(res.body)
    try {
        const product = await Product.findById(prodId);
        let alreadyRated = product.ratings.find(userId => userId.postedby.toString() === _id.toString());
        if (alreadyRated) {
            const updateRating = await Product.updateOne({
                ratings: { $elemMatch: alreadyRated },

            }, {
                $set: {
                    "ratings.$.star": star,
                    "ratings.$.comment": comment
                },
            }, {
                new: true
            })

        }
        else {
            const rateProduct = await Product.findByIdAndUpdate(prodId,
                {
                    $push: {
                        ratings: {
                            star: star,
                            comment: comment,
                            postedby: _id
                        },
                    },
                }, {
                new: true
            })

        }
        const getallratings = await Product.findById(prodId);
        let totalRating = getallratings.ratings.length;
        let ratingsum = getallratings.ratings
            .map(item => item.star)
            .reduce((prev, curr) => prev + curr, 0);
        let actualRating = Math.round(ratingsum / totalRating)

        let finalProduct = await Product.findByIdAndUpdate(prodId, {
            totalrating: actualRating,
        }, {
            new: true,
        })
        res.json(finalProduct);
    } catch (error) {
        throw new Error(error)
    }
})


// upload anh
const uploadImages = asyncHandler(async (req, res) => {
    const { id } = req.params;

    validateMongodb(id);

    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = []
        const files = req.files;
        for (const file of files) {
            const { path } = file;
            const newpath = await uploader(path);
            urls.push(newpath);
            fs.unlinkSync(path);

        }

        const findProduct = await Product.findByIdAndUpdate(id, {
            images: urls.map(file => {
                return file
            }),

        }, {
            new: true
        });
        res.json(findProduct);

    } catch (error) {
        throw new Error(error)
    }
})
export {
    uploadImages,
    getAllProducts,
    getaProduct,
    createProduct,
    updateProduct,
    rating,
    deleteProduct,
    addToWishlist
}