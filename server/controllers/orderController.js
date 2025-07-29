import Order from "../models/order.js";
import Product from "../models/product.js";
import mongoose from "mongoose";
import stripe from "stripe";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, addressId } = req.body;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid user ID" });
    }
    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.json({ success: false, message: "Invalid address ID" });
    }
    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      if (!product) throw new Error(`Product ${item.product} not found`);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02);
    const order = await Order.create({
      userId,
      items,
      amount,
      address: addressId,
      paymentType: "COD",
    });
    res.json({
      success: true,
      message: "Order Placed Successfully",
      orderId: order._id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};

// Place order stripe :/api/order/stripe

export const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, addressId } = req.body;
    const { origin } = req.headers;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.json({ success: false, message: "Invalid user ID" });
    }
    if (!addressId || !mongoose.Types.ObjectId.isValid(addressId)) {
      return res.json({ success: false, message: "Invalid address ID" });
    }
    if (!items || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    let productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      if (!product) throw new Error(`Product ${item.product} not found`);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      amount,
      address: addressId,
      paymentType: "Online",
    });

    // Stripe Gateway Initialize
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    // Create line items for stripe
    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        unit_amount: Math.floor(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create session
    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    res.json({
      success: true,
      url: session.url,
      orderId: order._id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.json({ success: false, message: error.message });
  }
};
export const getuserOrders = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.json({ success: false, message: "User ID required" });
    }
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get user orders error:", error);
    res.json({ success: false, message: error.message });
  }
};
// Get All Orders (for seller / admil): /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const { sellerId } = req.user;
    if (!sellerId) {
      return res.json({ success: false, message: "Seller not authenticated" });
    }

    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.json({ success: false, message: error.message });
  }
};
