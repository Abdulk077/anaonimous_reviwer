import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
//loading dot env
dotenv.config();
const prisma = new PrismaClient();

export const signup = async (req, res) => {
    const { email, password } = req.body;

    // 1. Precise Gmail Regex
    // This checks for: alphanumeric start, allowed dots, and exactly @gmail.com at the end
    const gmailRegex = /^[a-z0-9](\.?[a-z0-9]){2,}@gmail\.com$/i;

    if (!gmailRegex.test(email)) {
        return res.status(400).json({
            error: "Invalid email. Only valid @gmail.com addresses are permitted.",
        });
    }

    // 2. Password Strength check
    if (!password || password.length < 8) {
        return res.status(400).json({
            error: "Password is too weak. Minimum 8 characters required.",
        });
    }
    const passwordWithSalt = password + process.env.SECRET_SALT;

    try {
        // 3. Hash and Store
        // adding salt to password
        const hashedPassword = await bcrypt.hash(passwordWithSalt, 10);
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(), // Always store lowercase to avoid login issues
                password: hashedPassword,
            },
        });

        res.status(201).json({
            message: "Student account registered successfully!",
            publicId: user.id,
        });
    } catch (err) {
        if (err.code === "P2002") {
            return res.status(409).json({ error: "Email already in use." });
        }
        res.status(500).json({ error: "Internal server error." });
    }
};
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        // 1. Add the same Pepper during login check
        const passwordWithPepper = password + process.env.SECRET_SALT;

        // 2. Compare
        const isMatch = await bcrypt.compare(passwordWithPepper, user.password);

        if (isMatch) {
            // Use the separate JWT_SECRET for the token
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1d" },
            );
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }}
        catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
    };