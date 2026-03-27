import jwt from "jsonwebtoken";
import User from "../models/User.js";

const isAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    const user = await User.findByPk(req.user.id);
    if (!user || (user.user_type != process.env.USER_TYPE_ADMIN)) {
      return res.status(403).json({ msg: "Admin access required" });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Token is not valid or admin check failed",
      error: error.message,
    });
  }
};

export default isAdmin;