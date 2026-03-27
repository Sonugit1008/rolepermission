import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ msg: "Unauthorized user" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

export default auth;