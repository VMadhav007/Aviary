import bcrypt from "bcryptjs";
import User from "../models/user.model.js"
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import dotenv from "dotenv";
dotenv.config();

export const signup=async(req,res)=>{
    try{

        const {fullname, username ,email, password}=req.body;

        const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({error:"Invalid email format"});
        }

        const existingUser =await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error:"Username already taken"});
        }


        const existingEmail =await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({error:"Email already in use"});
        }

        if(password.length<8){
            return res.status(400).json({error : "Password must be atleast 8 characters long"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword= await bcrypt.hash(password,salt)

        const newUser=new User({
            fullname:fullname,  
            username,//since username:username same so can just use single username
            email,
            password:hashedPassword
        });

        if(newUser){
            generateTokenAndSetCookie(newUser.id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                username:newUser.username,
                email:newUser.email,
                followers:newUser.followers,
                following:newUser.following,
                profileImg:newUser.profileImg,
                coverImage:newUser.coverImage,
            })
            }
            else{
                res.send(400).json({error:"Invalid user Data"})
            }
        }
    catch(error){
        console.log("Error with signup ",error.message);
        res.status(500).json({error:"Internal server Error"})
    };
}
export const login=async(req,res)=>{
    try{
        const{username,password}=req.body;
        const user=await User.findOne({username});
        const isPasswordCorrect =await bcrypt.compare(password,user?.password||"");

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid credentials or password"})
        }

        generateTokenAndSetCookie(user.id,res)

        res.status(200).json({
            _id:user._id,
                fullName:user.fullName,
                username:user.username,
                email:user.email,
                followers:user.followers,
                following:user.following,
                profileImg:user.profileImg,
                coverImage:user.coverImage,
        });
    }
    catch(error){
        console.log("Error with signup ",error.message);
        res.status(500).json({error:"Internal server Error"})
    }
};
export const logout=async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logout succesfull"})
    }
    catch(error){
        console.log("Error in logout controller", error.message);
    }
}

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		res.json(user);
	} catch (err) {
		console.error("Error in getMe:", err.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
