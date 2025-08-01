import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

const MyOreder = () => {
  const [myOrders, setmyOrders] = useState([]);
  const { currency, axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user", {
        params: { userId: user._id },
      });
      if (data.success) {
        setmyOrders(data.orders || []);
      } else {
        console.log("Fetch failed:", data.message);
        setmyOrders([]);
      }
    } catch (error) {
      console.log("Error fetching orders:", error);
      setmyOrders([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div className="mt-16 pb-16">
      <div className="flex flex-col items-end w-max mb-8">
        <p className="text-2xl font-medium uppercase">My orders</p>
        <div className="w-20 h-0.5 bg-primary rounded-full"></div>
      </div>
      {Array.isArray(myOrders) && myOrders.length > 0 ? (
        myOrders.map((order, index) => (
          <div
            key={order._id || index}
            className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-4xl"
          >
            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
              <span>OrderID : {order._id}</span>
              <span>Payment : {order.paymentType}</span>
              <span>
                Total Amount : {currency}
                {order.amount}
              </span>
            </p>
            {Array.isArray(order.items) && order.items.length > 0 ? (
              order.items.map((item, index) => (
                <div
                  key={index}
                  className={`relative bg-white text-gray-500 ${
                    order.items.length !== index + 1 ? "border-b" : ""
                  } border-gray-300 flex flex-col md:flex-row md:items-center justify-between
                  p-4 py-5 md:gap-16 w-full max-w-4xl`}
                >
                  <div className="flex items-center mb-4 md:mb-0">
                    <div className="bg-primary/10 p-4 rounded-lg">
                      <img
                        src={item.product?.image[0] || "/default-image.png"}
                        alt={item.product?.name || "Product"}
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h2>{item.product?.name || "Unknown Product"}</h2>
                      <p>Category: {item.product?.category || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center md:ml-8 mb-4 md:mb-0">
                    <p>Quantity: {item.quantity || "1"}</p>
                    <p>Status: {order.status || "N/A"}</p>
                    <p>
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-primary text-lg font-medium">
                    Amount:{currency}
                    {item.product?.offerPrice * item.quantity || 0}
                  </p>
                </div>
              ))
            ) : (
              <p>No items in this order</p>
            )}
          </div>
        ))
      ) : (
        <p>No orders found</p>
      )}
    </div>
  );
};

export default MyOreder;
