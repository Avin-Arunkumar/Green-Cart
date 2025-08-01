import { v2 as cloudinary } from "cloudinary";
import Product from "../models/product.js";

export const addProduct = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Request Files:", req.files);

    if (!req.body.productData) {
      throw new Error("productData is missing");
    }
    let productData = JSON.parse(req.body.productData);

    if (!req.files || req.files.length === 0) {
      throw new Error("No files uploaded");
    }

    const images = req.files;
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        try {
          console.log("Uploading file:", item.originalname);
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          console.log("Upload successful:", result.secure_url);
          return result.secure_url;
        } catch (uploadError) {
          console.error("Cloudinary Upload Error:", uploadError.message);
          throw uploadError;
        }
      })
    );

    const product = await Product.create({ ...productData, image: imagesUrl });
    console.log("Product created:", product._id);
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.error("Error in addProduct:", error.message, error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get Product :/api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//Get single Product :/api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//change product inStock :/api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "stock Updated" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
