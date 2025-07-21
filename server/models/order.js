import mongoose, { model } from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "user" },
    items: [
      {
        product: { type: String, required: true, ref: "user" },
        quantity: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: Number, required: true, ref: "address" },
    status: { type: Number, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);
const Order = mongoose.model.Order || mongoose.model("order", orderSchema);

export default Order;
