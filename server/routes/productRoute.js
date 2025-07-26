import express from "express";
import upload from "../configs/multer.js";
import authSeller from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  upload.array("image", 10),
  (err, req, res, next) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({ success: false, message: err.message });
    }
    console.log("Incoming fields:", req.body, req.files);
    next();
  },
  authSeller,
  addProduct
);

productRouter.get("/list", productList);
productRouter.get("/id", productById); // Consider /:id
productRouter.post("/stock", authSeller, changeStock);

export default productRouter;
