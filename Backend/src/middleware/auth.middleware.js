import jwt from 'jsonwebtoken';
import User from "../models/userModel.models.js";

export const protectRoutes = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) return res.status(401).json({ msg: "You are not logged in" });

        const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;

        next();

    } catch (error) {
        console.error("Error", error);
    }
}
