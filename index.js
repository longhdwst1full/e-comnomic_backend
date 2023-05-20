import express from 'express';
import dotenv from "dotenv"
import dbConnect from './config/db';
import routerUser from './router/authRouter';
import routerProduct from './router/productsRouter';
import morgan from 'morgan';
import { errHandler, notFound } from './middlewares/errorHanler';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import routerBlog from './router/blogRouter';
import routerCategory from './router/prodcategoryRouter';
import routerBlogCategory from './router/blogCartRoute';
import routerBrand from './router/brandRouter';
import routerColor from './router/colorRouter';
import routerCoupon from './router/couponRouter';
import enqRouter from "./router/enqRouter";
import uploadRouter from "./router/uploadRouter";
import cors from 'cors'
// 3:30:00
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import session from 'express-session';
dotenv.config()
import User from "./model/userModel"
import AuthGGFB from './router/fb';
const app = express()
dbConnect()
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

passport.use(new FacebookStrategy({
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_API_SECRET,
  callbackURL: "/auth/facebook/callback"
},
  async function (accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile)
    const user = await User.findOne({
      account: profile.id,
      provider: "facebook"
    })
    if (!user) {
      console.log("Add new fb use to db")
      const user = new User({
        _id: profile.id,
        name: profile.displayName,
       mobile:""
      })
      // await user.save()
      return cb(null, profile)

    }
    else {
      console.log("fb user already ")
      return cb(null, profile)
    }
  }
));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_APP_ID,
      clientSecret: process.env.GG_API_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {

      console.log(accessToken, refreshToken, profile, done)
      const user = await User.findOne({ account: profile.id,
        provider: "google"});

      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        _id: profile.id,
        name: profile.displayName
      });

      await newUser.save();
      done(null, newUser);
    }
  )
);

app.use(morgan("dev"))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(session({ secret: 'long123', resave: false, saveUninitialized: true }));

// app.use(
//   session({
//     secret: "long123",
//     resave: false,
//     saveUninitialized: false,
  
//   })
// );




app.use("/api/user", routerUser)
app.use("/api/product", routerProduct)
app.use("/api/blog", routerBlog)
app.use("/api/productcategory", routerCategory)
app.use("/api/blogcategory", routerBlogCategory)
app.use("/api/brand", routerBrand)
app.use("/api/coupon", routerCoupon)
app.use("/api/color", routerColor)
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);

app.use("/auth", AuthGGFB);






app.use(notFound)

app.use(errHandler)

app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT)
})