import jwt from "jsonwebtoken";
import dotenv from "dotenv";    
dotenv.config();
const rolesHierarchy = ["STUDENT", "REVIEWER", "ADMIN"];

export const authorize = (minRole) => {
    return (req, res, next) => {
        // get the token from the header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res
                .status(401)
                .json({ error: "Access denied. Authentication token missing." });
        }

        try {
            //  Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            //  Attach decoded data to req object
            req.user = decoded;

            //  Validate Role Existence
            const userLevel = rolesHierarchy.indexOf(req.user.role);
            const requiredLevel = rolesHierarchy.indexOf(minRole);

            if (requiredLevel === -1) {
                return res
                    .status(500)
                    .json({
                        error: "Server configuration error: Invalid required role.",
                    });
            }

            // 5. Check Hierarchy ($userLevel \geq requiredLevel$)
            if (userLevel >= requiredLevel) {
                next();
            } else {
                res.status(403).json({
                    error: `Forbidden: This action requires ${minRole} permissions.`,
                });
            }
        } catch (err) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid or expired token." });
        }
    };
};
