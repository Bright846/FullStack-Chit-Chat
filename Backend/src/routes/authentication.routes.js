import express from "express";
import User from "../models/userModel.models.js";
import { chkAuth, Login, Logout, Signup, updateProfile } from "../controllers/auth.controllers.js";
import { protectRoutes } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", Login);

router.post("/signup", Signup);

router.post("/logout", Logout);

router.put("/update-profile", protectRoutes, updateProfile)

router.get("/check", protectRoutes, chkAuth);

export default router;