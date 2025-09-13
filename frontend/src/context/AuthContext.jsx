import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

// URL-ul backend-ului live de pe Vercel
const API_URL = "https://ecommerce-backend-taupe-theta.vercel.app/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // LOGIN
  const login = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data.message || res.statusText);
        return false;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  // REGISTER
  const register = async (username, password) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Register failed:", data.message || res.statusText);
        return false;
      }

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error("Register error:", err);
      return false;
    }
  };

  // LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
