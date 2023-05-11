import jwt from "jsonwebtoken";

import asyncHandler from "express-async-handler";
import User from "../model/userModel";
// 1:28:32 check postmen
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    // try {
    //     // kiểm tra xem user có đăng nhập không
    //     if (!req.headers.authorization) {
    //         throw new Error("Bạn phải đăng nhập để thực hiện hành động này");
    //     }

    //     // lấy jwt token từ header
    //     const token = req.headers.authorization.split(" ")[1];
    //     jwt.verify(token,  process.env.SECRET, async (err, payload) => {
    //         if (err) {
    //             if (err.name === "JsonWebTokenError") {
    //                 return res.status(401).json({
    //                     message: "Token không hợp lệ",
    //                 });
    //             }
    //             if (err.name === "TokenExpiredError") {
    //                 return res.status(401).json({
    //                     message: "Token hết hạn",
    //                 });
    //             }
    //         }
    //         // lấy thông tin user từ database
    //         const user = await User.findById(payload._id);
    //         // kiểm tra xem user có đủ quyền để thực hiện hành động đó không
           
    //         req.user = user;

    //         next();
    //     });
    // } catch (error) {
    //     res.status(401).json({ message: error.message });
    // }


    if (req?.headers?.authorization?.startsWith("Bearer")) {
        token = req.headers?.authorization?.split(" ")[1];
        try {
            const decoded = jwt.verify(token, process.env.SECRET)
            // console.log("decoded", decoded);
            const user = await User.findById(decoded?.id);
            req.user = user;
            next();
        } catch (err) {
          
                if (err.name === "JsonWebTokenError") {
                    return res.json({
                        message: "Token không hợp lệ",
                    });
                }
                if (err.name === "TokenExpiredError") {
                    return res.json({
                        message: "Token hết hạn",
                    });
                }
         
            throw new Error("Not authorized token expired, Please login again")
        }
    }
    else {
        throw new Error("There is no token attached to header")
    }

})
// check admin co quyền đc sửa tk user
const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });
    if (adminUser.role !== "admin") {
        throw new Error("You are not an admin")
    } else {
        next();
    }
})
export { authMiddleware, isAdmin }