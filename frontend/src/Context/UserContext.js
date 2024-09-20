import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    fname: localStorage.getItem("fname") || "",
    lname: localStorage.getItem("lname") || "",
    email: localStorage.getItem("email") || "",
    profileImage: localStorage.getItem("profileImage") || null,
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
