import { PrismaClient } from "@prisma/client";

export const changeUserRole = async (req, res) => {
  try {
    const { targetUserId, newRole } = req.body;
    const adminId = req.user.userId; // The Admin making the change

    // 1. SELF-DEMOTION CHECK
    if (adminId === targetUserId) {
      return res.status(400).json({
        error: "Security Restriction",
        message: "You cannot change your own role. Another Admin must do this.",
      });
    }

    // 2. TARGET IS ALREADY ADMIN CHECK
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (targetUser.role === "ADMIN") {
      return res.status(403).json({
        error: "Hierarchy Violation",
        message: "You cannot change the role of another Admin.",
      });
    }

    // 3. EXECUTE UPDATE
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    res.json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
