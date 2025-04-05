import express from "express"
import passport from "passport";
const router = express.Router()
import { authenticateToken } from "../middleware/authMiddleware.js";
import { loginSuccess} from "../controllers/authController.js";

router.get('/google',
    passport.authenticate('google', { scope: ['profile','email'] }));
  

  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login', session:false }),
     (req, res)=>{
       if(!req.user)
       {
        return res.status(401).json({message: "Authentication failed"})
       }
       const {token, accessToken, resfreshToken} = req.user;
       if(!token){
        return res.status(401).json({message:"NO token  found"})
       }

       res.cookie("token", token,{
        httpOnly:true,
        sameSite:"None",
        secure: process.env.NODE_ENV ==="production",
        maxAge: 7* 24* 60*60*1000
       })

       res.cookie("accessToken", accessToken,{
        httpOnly:true,
        sameSite:"None",
        secure: process.env.NODE_ENV ==="production",
        maxAge: 1* 24* 60*60*1000
       })

       res.cookie("resfreshToken", resfreshToken,{
        httpOnly:true,
        sameSite:"None",
        secure: process.env.NODE_ENV ==="production",
        maxAge: 1* 24* 60*60*1000
       })
       console.log("Token Stored ", {token, accessToken, resfreshToken})
       return res.redirect (`${process.env.CLIENT_URL}/home?token=${token}`)
    });

router.get("/login/success",authenticateToken, loginSuccess, (req, res)=>{
    if(!req.user){
        return res.status(401).json({message:"Not  authenticated ."})
    }
    res.status(200).json({
        user: req.user,
        token: req.user.token
    })
} )


router.get("/logout", (req, res)=>{
    res.clearCookie("token")
    res.clearCookie("accessToken")
    res.clearCookie("resfreshToken")
    req.logout(()=>{
        res.redirect(`${process.env.CLIENT_URL}/`)
    })
})




export default router;