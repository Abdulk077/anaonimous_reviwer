import {
    PrismaClient
} from "@prisma/client";
const prisma = new PrismaClient();

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
                email: true,
                role: true,
                bio: true,
                createdAt: true,
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