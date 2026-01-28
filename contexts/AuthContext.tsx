"use client";
import { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const email = Cookies.get("userEmail");
    const userId = Cookies.get("userId");

    if (token && email) {
      setUser({ token, email, userId });
    }
  }, []);

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    Cookies.remove("userId");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
