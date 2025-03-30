import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";


import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();
const PORT =process.env.PORT||5000;


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


console.log(process.env.MONGO_URI);

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);
    connectMongoDB();
})
