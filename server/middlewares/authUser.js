import jwt from "jsonwebtoken";

const authUser = (req, res, next) => {
  const token = req.cookies.token;
  console.log("Received token:", token);
  console.log("Using JWT_SECRET:", process.env.JWT_SECRET);

  if (!token) {
    console.log("No token found in request");
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded:", decoded);
    if (!decoded.id) {
      console.log("Token missing id field:", decoded);
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    console.error("Token verification error:", error.message, error.stack);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authUser;
