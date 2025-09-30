import userModel from "../Model/userModel.js";
import { setUser, setrefresh, getrefresh, blacklistToken } from "../service/auth.js";

export const signup = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    const existingemail = await userModel.findOne({ email });
    if (existingemail) {
      res.status(401).json({ error: "user with this email already exist" });
    }

    const existingusername = await userModel.findOne({ username });
    if (existingusername) {
      res.status(401).json({ error: "user with this username already exist" });
    }
    const newUser = new userModel({
      name,
      username,
      email,
      password,
    });
    newUser.save().then(() => {
      return res
        .status(201)
        .json({ message: "Signup successful" });
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email, password });

    if (!user) {
      res.status(401).json({ error: "Incorrect crendential" });
    }

    if (password !== user.password) {
      res.status(401).json({ error: "Incorrect password" });
    }

    const access_token = setUser({ id: user._id, role: user.role });
    const refresh_token = setrefresh({ id: user._id, role: user.role });

    res.status(200).json({
      message: "User logged in successfully",
      user,
      access_token,
      refresh_token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const refresh_token = req.cookies.refresh_token ||
      req.body.refresh_token ||
      req.headers['refresh-token'] ||
      req.headers['authorization']?.replace('Bearer ', '');

    if (!refresh_token) {
      return res.status(400).json({ error: "Refresh token required" });
    }

    let decoded;
    try {
      decoded = getrefresh(refresh_token);
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }
    const access_token = setUser({ id: decoded.id, role: decoded.role });
    const new_refresh_token = setrefresh({
      id: decoded.id,
      role: decoded.role,
    });

    res.status(200).json({
      message: "Tokens refreshed successfully",
      access_token,
      refresh_token: new_refresh_token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];
    
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }

    const success = await blacklistToken(token);
    
    if (success) {
      res.status(200).json({ message: "Logged out successfully" });
    } else {
      res.status(400).json({ error: "Failed to logout" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
