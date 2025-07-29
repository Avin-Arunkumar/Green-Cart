import Address from "../models/address.js";

// Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const userId = req.user?.id; // Use authenticated user ID
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User ID not found" });
    }

    const { address } = req.body;
    if (!address || typeof address !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Invalid address data" });
    }

    const newAddress = await Address.create({ ...address, userId });
    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error) {
    console.error("Add address error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Addresses : /api/address/list

export const getAddresses = async (req, res) => {
  try {
    const userId = req.user?.id; // Provided by authUser middleware
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "User ID not found" });
    }

    const addresses = await Address.find({ userId });
    res.json({ success: true, addresses });
  } catch (error) {
    console.error("Get addresses error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
