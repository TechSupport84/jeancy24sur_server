import express  from"express"
import cors from "cors"
import dotenv from "dotenv"
import createError from "http-errors"
import cookieParser from "cookie-parser"
import session from "express-session"
import { connectDB } from "./config/db.js"
import userRouter from "./routes/user.js"
import passport from "passport"
import "./config/passport.js"



dotenv.config()

const PORT= process.env.PORT || 3003
const app = express()

app.use(cookieParser())
app.use(cors({
    credentials:true,
    methods:["GET", "POST", "PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"]
}))

app.use(session({
    secret: "jeancy24sur",
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        secure:process.env.NODE_ENV ==="production",
        maxAge:24* 60  * 60* 1000,
    }
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/auth", userRouter)




//error config
app.use((req , res , next)=>{
    next(createError(404, "Not found"))
})

app.use((error, req ,res , next)=>{
console.error("Error", error.message)
res.status(error.status || 500 ).json({
    success: false,
    message: error.message || "Internal  server  error ."
})
})



app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT} `)
    connectDB()
})
