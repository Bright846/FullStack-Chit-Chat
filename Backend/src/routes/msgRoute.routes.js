import express from 'express';
import { protectRoutes } from '../middleware/auth.middleware.js';
import { getAllUser, getMessage, sendMsg } from '../controllers/msgCtrl.controller.js';

const router = express.Router();

router.get("/users", protectRoutes, getAllUser)
router.get("/:id", protectRoutes, getMessage)
router.post("/send/:id", protectRoutes, sendMsg);

export default router;