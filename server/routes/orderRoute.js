import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  getAllOrders,
  getuserOrders,
  placeOrderCOD,
  placeOrderStripe,
} from "../controllers/orderController.js";
import authSeller from "../middlewares/authSeller.js";

const orderRouter = express.Router();

orderRouter.post("/cod", authUser, placeOrderCOD);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.get("/user", authUser, getuserOrders);
orderRouter.get("/seller", authSeller, getAllOrders);

export default orderRouter;
