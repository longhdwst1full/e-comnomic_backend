import fs from "fs";
import asyncHandler from "express-async-handler"
import Blog from "../model/blogModel"
import cloudinaryUploadImg from "../utils/cloudinary"
import { validateMongodb } from "../utils/validateMongdb"


const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body)
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})

const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const update = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        })
        res.json(update)
    } catch (error) {
        throw new Error(error)
    }
})

const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const newBlog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes");
        const update = await Blog.findByIdAndUpdate(id,
            { $inc: { numViews: 1 } },
            { new: true });
        res.json(newBlog)
    } catch (error) {
        throw new Error(error)
    }
})


const getAllBlog = asyncHandler(async (req, res) => {
    try {
        const result = await Blog.find();
        res.json(result)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongodb(id)
    try {
        const result = await Blog.findByIdAndDelete(id);
        res.json(result)
    } catch (error) {
        throw new Error(error)
    }
})


const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodb(blogId)

    // find the blog which you want to be liked 
    const blog = await Blog.findById(blogId)
    // find user login
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isLiked = blog?.isLiked;
    // find if the user has disliked the blog
    const alreadyDisliked = blog?.dislikes.find((userId => userId?.toString() === loginUserId?.toString()));

    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, {
            new: true
        });
        res.json(blog)
    }


    if (isLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, {
            new: true
        });
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { likes: loginUserId },
            isLiked: true
        }, {
            new: true
        });
        res.json(blog)
    }

});

const disLiketheBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongodb(blogId)

    // find the blog which you want to be liked 
    const blog = await Blog.findById(blogId)
    // find user login
    const loginUserId = req?.user?._id
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisliked;
    // find if the user has disliked the blog
    const alreadyliked = blog?.likes.find((userId => userId?.toString() === loginUserId?.toString()));

    if (alreadyliked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { likes: loginUserId },
            isLiked: false
        }, {
            new: true
        });
        res.json(blog)
    }


    if (isDisLiked) {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $pull: { dislikes: loginUserId },
            isDisliked: false
        }, {
            new: true
        });
        res.json(blog)
    }
    else {
        const blog = await Blog.findByIdAndUpdate(blogId, {
            $push: { dislikes: loginUserId },
            isDisliked: true
        }, {
            new: true
        });
        res.json(blog)
    }

});


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
            fs.unlinkSync(path)
        }
        
        const findBlog = await Blog.findByIdAndUpdate(id, {
            images: urls.map(file => {
                return file
            }),

        }, {
            new: true
        });
        res.json(findBlog);

    } catch (error) {
        throw new Error(error)
    }
})

export {
    getBlog,
    updateBlog,
    createBlog,
    deleteBlog,
    getAllBlog,
    likeBlog,
    disLiketheBlog,
    uploadImages
}