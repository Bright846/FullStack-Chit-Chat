import User from "../models/userModel.models.js";
import Message from "../models/msgModel.models.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getAllUser = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filterredUser = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filterredUser);

    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ message: "Interval Server Error" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });


        res.status(200).json(messages);
    } catch (error) {
        console.log("Error", error);
        res.status(500).json("Internal Server Error");
    }
}

export const sendMsg = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imgUrl = null;

        // If image is provided, upload to Cloudinary
        if (image) {
            const uploadRes = await cloudinary.uploader.upload(image);
            imgUrl = uploadRes.secure_url;
        }

        // At least one of text or image must be provided
        if (!text && !imgUrl) {
            return res.status(400).json({ message: "Message must have text or image." });
        }

        const newMsg = new Message({
            senderId,
            receiverId,
            text,
            image: imgUrl
        });
        await newMsg.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMsg", newMsg);
        }
        res.status(201).json(newMsg);

    } catch (error) {
        console.log("Error in sending message", error.message);
        return res.status(500).json({ message: "Error in sending message" });
    }
}
