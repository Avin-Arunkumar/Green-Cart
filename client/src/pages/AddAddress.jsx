// export default AddAddress;
import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const InputField = ({
  type,
  placeholder,
  name,
  handleChange,
  address,
  className = "",
}) => (
  <input
    className={`w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition ${className}`}
    type={type}
    placeholder={placeholder}
    onChange={handleChange}
    name={name}
    value={address[name]}
    required
  />
);

const AddAddress = () => {
  const { axios, user, navigate } = useAppContext();
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    Zipcode: "", // Corrected to match schema
    country: "",
    phone: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    console.log("Submitting address:", address);
    try {
      const { data } = await axios.post(
        "/api/address/add",
        { address },
        { withCredentials: true }
      );
      if (data.success) {
        toast.success(data.message);
        navigate("/cart");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(
        "Address submission error:",
        error.response?.data || error.message
      );
      toast.error(error.response?.data?.message || "Failed to save address");
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/cart");
    }
  }, [user, navigate]);

  return (
    <div className="mt-16 pb-16">
      <p className="text-2xl md:text-3xl text-gray-500">
        Add Shipping <span className="font-semibold text-primary">Address</span>
      </p>
      <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
        <div className="flex-1 max-w-md">
          <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="firstName"
                type="text"
                placeholder="First Name"
                handleChange={handleChange}
                address={address}
              />
              <InputField
                name="lastName"
                type="text"
                placeholder="Last Name"
                handleChange={handleChange}
                address={address}
              />
            </div>
            <InputField
              name="email"
              type="email"
              placeholder="Email address"
              handleChange={handleChange}
              address={address}
            />
            <InputField
              name="street"
              type="text"
              placeholder="Enter your Street"
              handleChange={handleChange}
              address={address}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="city"
                type="text"
                placeholder="Enter your City"
                handleChange={handleChange}
                address={address}
              />
              <InputField
                name="state"
                type="text"
                placeholder="Enter your State"
                handleChange={handleChange}
                address={address}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                name="Zipcode"
                type="text"
                placeholder="Enter your Zipcode"
                handleChange={handleChange}
                address={address}
              />
              <InputField
                name="country"
                type="text"
                placeholder="Enter your Country"
                handleChange={handleChange}
                address={address}
              />
            </div>
            <InputField
              name="phone"
              type="text"
              placeholder="Phone Number"
              handleChange={handleChange}
              address={address}
            />
            <button className="w-full mt-6 bg-primary text-white py-3 hover:bg-primary-dull transition cursor-pointer uppercase">
              Save address
            </button>
          </form>
        </div>
        <img
          className="md:mr-0 mb-6 md:mt-0"
          src={assets.add_address_iamge}
          alt="Add-Address"
        />
      </div>
    </div>
  );
};

export default AddAddress;
