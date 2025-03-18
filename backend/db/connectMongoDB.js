import mongoose from "mongoose";
import dotenv from "dotenv";

const connectMongoDB = async()=>{
    try{
        const  conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MONGOdb connected succesfully ${conn.connection.host}`);
    }
    catch(error){
        console.log(`Error connecting to mongoBD ${error.message}`)
        process.exit(1);
    }
}
export default connectMongoDB;