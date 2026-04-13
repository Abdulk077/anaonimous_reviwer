

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// --- CREATE COMMENT ---
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    // checking the content and postId is provided or not
    if (!content || !postId) {
      return res.status(400).json({ error: "Content and Post ID are required." });
    }
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: req.user.userId,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment" });
  }
};

// --- UPDATE COMMENT ---
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    // cheaking both content and id is provided or not
    if( !content || !id ){
        return res.status(400).json({ error: "Content and Comment ID are required." });
    }
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment || comment.authorId !== req.user.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: "Update failed" });
  }
};

// --- DELETE COMMENT ---
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await prisma.comment.findUnique({ where: { id } });

    // Allow Author OR Admin to delete
    if (!comment || (comment.authorId !== req.user.userId && req.user.role !== "ADMIN")) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await prisma.comment.delete({ where: { id } });
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ error: "Delete failed" });
  }
};
// getting comment by post id not finalyes the rightnow 
export const getCommentsByPostId = async (req, res) => {
    
};