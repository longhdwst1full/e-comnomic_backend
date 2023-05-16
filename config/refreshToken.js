import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_REFRESH, { expiresIn: "3m" })
}

export { generateRefreshToken }