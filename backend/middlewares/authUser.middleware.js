
import jwt from 'jsonwebtoken'
import userModel from '../models/user.model.js';
import blackListModel from '../models/blackListToken.model.js';

export const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const isBlackListed = await blackListModel.findOne({ token });
    if (isBlackListed) return res.status(401).json({ success: false, message: "Token expired/blacklisted" });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ success: false, message: "Token invalid/expired" });
    }

    const user = await userModel.findById(decoded._id);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.log("Auth middleware error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
