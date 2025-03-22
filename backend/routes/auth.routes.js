import express from "express";
import {getMe,signup,login,logout} from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/protect.js";

const router=express.Router();

router.get("/me",protectRoute,getMe)

router.post("/signup",signup);

router.post("/logout",logout);

router.post("/login",login);


export default router