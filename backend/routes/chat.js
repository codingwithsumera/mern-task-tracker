import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", chat);

export default router;
