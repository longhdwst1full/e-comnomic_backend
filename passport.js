import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import passport from "passport";
import User from "./model/userModel"
import dotenv from "dotenv";
dotenv.config()


GITHUB_CLIENT_ID = "your id";
GITHUB_CLIENT_SECRET = "your id";

FACEBOOK_APP_ID = "your id";
FACEBOOK_APP_SECRET = "your id";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GG_APP_ID,
      clientSecret: process.env.GG_API_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {

      console.log(accessToken, refreshToken, profile, done)
      const user = await User.findOne({ _id: profile.id });

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


passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

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
        mobile: ""
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

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });
