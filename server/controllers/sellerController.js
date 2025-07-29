import jwt from "jsonwebtoken";
import User from "../models/user.js";

//Login Seller : /api/seller/login

export const sellerLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "node" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res.json({ success: true, message: "Logged In" });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
// Seller isAuth : /api/seller/is-auth

export const isSellerAuth = (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.json({ success: false, message: "Not Authorized" });
    }
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (
      !tokenDecode ||
      !tokenDecode.email ||
      tokenDecode.email !== process.env.SELLER_EMAIL
    ) {
      return res.json({ success: false, message: "Not Authorized" });
    }
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: "Invalid or expired token" });
  }
};

// Logout Seller : /api/seller/logout

export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
