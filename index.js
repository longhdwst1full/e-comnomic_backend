import express from 'express';
import dotenv from "dotenv"
import dbConnect from './config/db';
import routerUser from './router/authRouter';
import routerProduct from './router/productsRouter';
import morgan from 'morgan';
import { errHandler, notFound } from './middlewares/errorHanler';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routerBlog from './router/blogRouter';
// 3:30:00
dotenv.config()

const app = express()
dbConnect()
app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())

app.use("/api/user", routerUser)
app.use("/api/product", routerProduct)
app.use("/api/blog", routerBlog)

app.use(notFound)

app.use(errHandler)

app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT)
})