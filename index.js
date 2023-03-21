import express from 'express';
import dotenv from "dotenv"
import dbConnect from './config/db';
import router from './router/authRouter';
import { errHandler, notFound } from './middlewares/errorHanler';

dotenv.config()

const app = express()
dbConnect()
app.use(express.json())


app.use("/api/user", router)

app.use(notFound)

app.use(errHandler)

app.listen(process.env.PORT, () => {
    console.log("listening on port " + process.env.PORT)
})