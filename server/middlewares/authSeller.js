import jwt from "jsonwebtoken";

const authSeller = async (req, res, next) => {
  const { token } = req.cookies; // Changed from sellerToken to token
  if (!token) {
    return res.json({ success: false, message: "Not Authorized" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.email === process.env.SELLER_EMAIL) {
      next();
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized" });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
export default authSeller;
