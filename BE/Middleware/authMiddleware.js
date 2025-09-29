import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const verifyToken = (req, res, next) => {
  let token;

  let authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "no token , Authorization denied" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Access token expired" });
    }
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default verifyToken;
