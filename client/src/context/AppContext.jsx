import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContent = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isSeller, setIsSeller] = useState(false);
  const value = { navigate, user, setUser, setIsSeller, isSeller };
  return <AppContent.Provider value={value}>{children}</AppContent.Provider>;
};
export const useAppContext = () => {
  return useContext(AppContent);
};
