import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import { sendReviewerApplicationEmail } from "../config/mail.config.js";
export const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                role: true,
                bio: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        comments: true,
                    },
                },
            },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        res.status(200).json({ user: user });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
};
// submiting reviewer application
export const submitReviewerApplication = async (req, res) => {
    try {
        const { userId, answers } = req.body;

        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user)
            return res.status(404).json({ success: false, error: "User not found" });

        // Pass data to config function
        await sendReviewerApplicationEmail(user, answers);

        res.status(200).json({
            success: true,
            message: "Application submitted successfully to Admin.",
        });
    } catch (error) {
        console.error("Application Error:", error);
        res.status(500).json({ success: false, error: "Internal server error" });
    }
};