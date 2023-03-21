import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const generateToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"3d"})
}

export {generateToken}