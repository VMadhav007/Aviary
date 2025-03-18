import express from "express";
import dotenv from "dotenv";

const PORT =process.env.PORT||5000

import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const app=express();

console.log(process.env.MONGO_URI);

app.use("/api/auth",authRoutes);

app.listen(PORT,()=>{
    console.log(`server running at port ${PORT}`);
    connectMongoDB();
})
