import multer from "multer"
import sharp from "sharp"
import fs from "fs"
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {

        // const uploadPath = path.join(__dirname, '../public//images');
        cb(null, path.join(__dirname, '../public/images'));
        // cb(null, uploadPath);

        // fs.mkdir('./uploads/',(err)=>{
        //     cb(null, './uploads/');
        //  });
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    }
    else {
        cb({
            message: "Unsupported file format"
        }, false)
    }
}

const uploadPhoto = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 2000000 }
})

const productImageResize = async (req, res, next) => {
    if (!req.file) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public//images//product//${file.filename}`);
            fs.unlinkSync(`public/images/product/${file.filename}`)
        })
    );
    next();
};

const blogImageResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/blogs/${file.filename}`);
            fs.unlinkSync(`public/images/blogs/${file.filename}`)
        })
    );
    next();
}
const productsImageResize = async (req, res, next) => {
    if (!req.files) return next();
    await Promise.all(
        req.files.map(async (file) => {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`public/images/products/${file.filename}`);
            fs.unlinkSync(`public/images/products/${file.filename}`)
        })
    );
    next();
}



export { uploadPhoto, productImageResize, productsImageResize, blogImageResize }