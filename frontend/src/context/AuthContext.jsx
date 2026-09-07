import { useState } from "react";
import { AuthContext } from "./auth-context";

function getStoredUser() {
  try {
    const savedUser = localStorage.getItem("lateNightPrepUser");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("lateNightPrepUser");
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = (userData) => {
    localStorage.setItem("lateNightPrepUser", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("lateNightPrepUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
