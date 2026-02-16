import jwt from "jsonwebtoken";
import User from "../modals/userModal.js";

export const authenticateUser = async(req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token is missing or invalid" });
    }
    const token = authHeader.split(" ")[1]; // [Bearer, Token]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, email, role } = decoded;
        const user=await User.findById(id)
        if(!user){
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(401).json({ message: "Token verification failed", error: error.message });
    }
};

export const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
};