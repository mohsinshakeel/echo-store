import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { validateToken, isTokenBlacklisted } from "../service/auth.js";

dotenv.config();

const verifyToken = async (req, res, next) => {
  let token;

  let authHeader = req.headers["authorization"];

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ error: "no token , Authorization denied" });
  }

  try {
    // Check if token is blacklisted
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      return res.status(401).json({ 
        error: "Token has been revoked",
        code: "TOKEN_REVOKED",
        message: "Token has been revoked"
      });
    }

    // Validate token using Redis
    const decoded = await validateToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        error: "Invalid or expired token",
        code: "INVALID_TOKEN",
        message: "Invalid or expired token"
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        error: "Access token expired",
        code: "TOKEN_EXPIRED",
        message: "Access token expired"
      });
    }
    return res.status(401).json({ 
      error: "Invalid token",
      code: "INVALID_TOKEN",
      message: "Invalid token"
    });
  }
};

export default verifyToken;
