import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET, { expiresIn: "1d" })
}

export { generateToken }