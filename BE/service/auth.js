import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "../configuration/redis_connection.js";

dotenv.config();

const secret_key = process.env.JWT_SECRET_KEY;
const refresh_key = process.env.REFRESH_SECRET_KEY;

const setUser = (user) => {
  const token = jwt.sign(user, secret_key, { expiresIn: "10m" });
  redis.setex(`access_token:${user.id}`, 600, token);
  return token;
};

const setrefresh = (user) => {
  const refreshToken = jwt.sign(user, refresh_key, { expiresIn: "7d" });
  redis.setex(`refresh_token:${user.id}`, 604800, refreshToken);
  
  return refreshToken;
};

const getUser = (token) => {
  return jwt.verify(token, secret_key);
};

const getrefresh = (refresh) => {
  return jwt.verify(refresh, refresh_key);
};

const validateToken = async (token) => {
  try {
    const decoded = jwt.verify(token, secret_key);
    const storedToken = await redis.get(`access_token:${decoded.id}`);
    
    if (!storedToken || storedToken !== token) {
      return null; 
    }
    return decoded;
  } catch (error) {
    return null;
  }
};

const blacklistToken = async (token) => {
  try {
    const decoded = jwt.verify(token, secret_key);
    await redis.del(`access_token:${decoded.id}`);
    await redis.del(`refresh_token:${decoded.id}`);
    return true;
  } catch (error) {
    return false;
  }
};

const isTokenBlacklisted = async (token) => {
  try {
    const decoded = jwt.verify(token, secret_key);
    const exists = await redis.exists(`access_token:${decoded.id}`);
    return !exists; 
  } catch (error) {
    return true;
  }
};

export {
  setUser,
  setrefresh,
  getUser,
  getrefresh,
  validateToken,
  blacklistToken,
  isTokenBlacklisted,
};
