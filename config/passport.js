import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    passReqToCallback:true,
  },
async(request , accessToken, refreshToken, profile, done)=> {
  try {
    let user  = await User.find({googleId: profile.id})

    if(!user)
    {
        user = new User({
            username: profile.displayName,
            email: profile.emails[0].value,
            picture:profile.photos[0].value,
            googleId: profile.id
        })
        await user.save();
    }

    //Generate token 
    const  token  = jwt.sign(
        {id: user.id, username: user.username, email:user.email, picture: user.picture},
        process.env.JWT_TOKEN,
        {expiresIn: "7d"}
    )
    console.log("Authenticated", user)
    console.log("Generated Token", token)
    console.log("Oauth Access Token ", accessToken);
    console.log("Oauth Resfresh token ", refreshToken)

    return done(null, {user, token, accessToken, refreshToken})
  } catch (error) {
    console.error("Google  auth  error")
    return done(error, null)
  }
}
))

passport.serializeUser((user, done)=>{
    done(null, user.user? user.user.id:user.id)
})
passport.deserializeUser(async(id, done)=>{
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
          done(error , null)
    }
})