// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const { userId, items, address } = req.body;
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }
    // Calculate Amount using Items
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);
    // Add tax charge (2%)
    amount += Math.floor(amount * 0.02);
    await Order.creat({
      userId,
      items,
      amount,
      address,
      paymentType: "COD",
    });
    return res.json({ success: true, message: "Order Plased Successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
