import jwt from "jsonwebtoken";

import asyncHandler from "express-async-handler";
import User from "../model/userModel";
// 1:28:32 check postmen
const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

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
                return res.status(200).json({
                    message: "Token không hợp lệ",
                    err
                });
            }
            if (err.name === "TokenExpiredError") {
                return res.json({
                    message: "Token hết hạn",
                    err
                });
            }

            throw new Error({
                message: "Not authorized token expired, Please login again",
                err
            })
        }
    }
    else {
        throw new Error({
            message: "There is no token attached to header"
        })
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