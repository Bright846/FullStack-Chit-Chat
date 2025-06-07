import User from "../models/userModel.models.js";
import createError from 'http-errors';
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";

export const Signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check for missing fields
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: `${email} already exists` });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Generate token (assuming it sets a cookie or returns a token)
        generateToken(newUser._id, res);

        return res.status(201).json({
            userId: newUser._id,
            name: newUser.name,
            email: newUser.email
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create new user" });
    }
};

export const Login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(createError(400, "Email and password are required"));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return next(createError(401, "Invalid credentials"));
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(createError(401, "Invalid credentials"));
        }

        generateToken(user._id, res);
        // Remove sensitive data before sending
        const { password: pwd, ...userData } = user.toObject();

        res.status(200).json({
            status: "success",
            message: `${user.name} logged in successfully`,
            user: userData
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to login user" });
    }
};


export const Logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Logged out successfully" });
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return next(createError(400, "Profile picture is required"));
        }

        const uploadRes = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadRes.secure_url }, { new: true });

        return res.status(200).json({ updatedUser });

    } catch (error) {
        console.log("Error updating user profile");
    }
}

export const chkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Erro in checking user authentication", error.message);
        return res.status(500).json({ message: "Error in checking user authentication" });
    }
}