import { PrismaClient } from "@prisma/client";
import slugify from "slugify";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();

// --- CREATE POST ---
export const createPost = async (req, res) => {
    try {
        const { title, content, tags, fileUrl, fileType } = req.body;
        //cheacking the required field 
        if (!content) {
            return res.status(400).json({ error: "Title and content are required." });
        }

        // 1. Generate unique slug (Title-based or "post"-based)
        const base = title ? slugify(title, { lower: true, strict: true }) : "post";
        const slug = `${base}-${nanoid(6)}`;

        // 2. Hashtag Logic (Start with #, max 5)
        const processedTags = Array.isArray(tags)
            ? tags.filter(t => t.startsWith('#')).slice(0, 5)
            : [];

        const post = await prisma.post.create({
            data: {
                title,
                content,
                slug,
                tags: processedTags || [],
                fileUrl,
                fileType,
                authorId: req.user.userId, // Assuming your auth middleware attaches user to req
            },
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ error: "Creation failed", message: error.message });
    }
};

// --- GET ALL POSTS (With Pagination) ---
export const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [posts, total] = await prisma.$transaction([
            prisma.post.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { 
                 //   author: { select: { bio: true } } ,
                    _count: { select: { comments: true } }
                }
            }),
            prisma.post.count()
        ]);

        res.json({ posts, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ error: "Fetching failed" });
    }
};

// --- UPDATE POST ---
export const updatePost = async (req, res) => {
    try {

        const { id } = req.params;
        const { title, content, tags } = req.body;
        // checking all the field which is required 
        if (!content || !id) {
            return res.status(400).json({ error: "Title and content are required." });
        }
        // Check ownership first
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post || post.authorId !== req.user.id) {
            return res.status(403).json({ error: "Unauthorized or post not found" });
        }

        const updated = await prisma.post.update({
            where: { id },
            data: {
                title,
                content,
                tags: tags ? tags.filter(t => t.startsWith('#')).slice(0, 5) : undefined
            },
        });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: "Update failed" });
    }
};

// --- DELETE POST ---
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        // checking we got the the id or not 
        if (!id) {
            return res.status(400).json({ error: "Post ID is required." });
        }
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post || (post.authorId !== req.user.id && req.user.role !== "ADMIN")) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        await prisma.post.delete({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Deletion failed" });
    }
};
// getting post by user id 
export const getPostsByUserId = async (req, res) => {
  try {
    // 🟢 FIX: Add curly braces to get the string value, not the whole object
    const { userId } = req.params;

    // Debugging: This should print a string, not an object
    console.log("Fetching posts for ID string:", userId);

    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const posts = await prisma.post.findMany({
      // Now authorId matches the string correctly
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Fetching failed" });
  }
};
// get postdeails by post id
export const getPostDetails = async (req, res) => {
    try {
        const postId = req.params.postId;
        // checking the post id is provided or not
        if (!postId) {
            res.status(400).json({ error: "Post ID is required." });
        }
        // get the post details 
        const post = await prisma.post.findUnique({
            where: { id: postId },
            include: {
                _count: {
                    select: {
                        comments: true
                    }
                }
            }

        });
        res.status(200).json(post);


    } catch (error) {
        res.status(500).json({ error: "Fetching failed" });
    }
};