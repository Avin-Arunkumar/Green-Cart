import jwt from "jsonwebtoken";
import User from "../models/user";

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
export const isAuth = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    return res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
