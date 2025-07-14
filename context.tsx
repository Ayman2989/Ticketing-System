"use client";

import { useRouter } from "next/navigation";
import React, { createContext, ReactNode, useEffect, useState } from "react";

interface userInfo {
  employee_id: string;
  employee_name: string;
  email: string;
  password: string;
  role: string;
  contact_number: number | undefined;
  designation: string;
  status: string;
}

interface UserContextType {
  userInfo: userInfo;
  setUserInfo: (user: userInfo) => void;
  logout: () => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (x: boolean) => void;
}

interface userProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextType>({
  userInfo: {
    employee_id: "",
    employee_name: "",
    email: "",
    password: "",
    role: "",
    contact_number: undefined,
    designation: "",
    status: "",
  },
  isAuthenticated: false,
  setUserInfo: () => {},
  logout: () => {},
  setIsAuthenticated: () => {},
});

export const UserProvider: React.FC<userProviderProps> = ({ children }) => {
  const router = useRouter();

  const [userInfo, setUserInfo] = useState<userInfo>({
    employee_id: "",
    employee_name: "",
    email: "",
    password: "",
    role: "",
    contact_number: undefined,
    designation: "",
    status: "",
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // 🧠 Only access localStorage in the browser
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userInfo");
      if (storedUser) {
        setUserInfo(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (userInfo.employee_id) {
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      } else {
        localStorage.removeItem("userInfo"); // Clear storage on logout
      }
    }
  }, [userInfo]);

  const logout = () => {
    setIsAuthenticated(false);
    setUserInfo({
      employee_id: "",
      employee_name: "",
      email: "",
      password: "",
      role: "",
      contact_number: undefined,
      designation: "",
      status: "",
    });
    if (typeof window !== "undefined") {
      localStorage.removeItem("userInfo");
      router.push("/login");
      window.location.reload();
    }
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        setUserInfo,
        logout,
        isAuthenticated,
        setIsAuthenticated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
