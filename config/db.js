import mongoose from "mongoose";
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected successfully!')
    } catch (error) {
        console.log("Failed")
    }
}
export{connectDB}