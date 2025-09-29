import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.JWT_SECRET_KEY;
const refresh_key = process.env.REFRESH_SECRET_KEY;

const setUser = (user) => {
  return jwt.sign(user, secret_key, { expiresIn: "10m" });
};

const setrefresh = (user) => {
  return jwt.sign(user, refresh_key);
};

const getUser = (token) => {
  return jwt.verify(token, secret_key);
};

const getrefresh = (refresh) => {
  return jwt.verify(refresh, refresh_key);
};

export {
  setUser,
  setrefresh,
  getUser,
  getrefresh,
};
