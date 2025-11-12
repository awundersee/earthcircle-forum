import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  /**
   * Versucht JWT zu decodieren
   * -> gibt null zurück, wenn nicht möglich
   */
  const decodeUserFromToken = (token) => {
    if (!token) return null;

    // Muss 3 Teile haben, sonst kein JWT → kein decode!
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.warn("Token ist kein gültiges JWT.");
      return null;
    }

    try {
      // base64-URL → base64 normalisieren
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      const payload = JSON.parse(json);

      return {
        username: payload.username ?? null,
        email: payload.email ?? null,
        ...payload,
      };
    } catch (err) {
      console.error("Token kann nicht decodiert werden:", err);
      return null;
    }
  };

  const login = (token) => {
    // evtl. "Bearer " entfernen
    if (token.startsWith("Bearer ")) {
      token = token.substring(7);
    }

    localStorage.setItem("token", token);
    setLoggedIn(true);

    const decoded = decodeUserFromToken(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setUser(null);
  };

  /**
   * Initial: Token aus localStorage lesen
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
      const decoded = decodeUserFromToken(token);
      setUser(decoded);
    } else {
      setLoggedIn(false);
      setUser(null);
    }
  }, []);

  /**
   * Wenn Tab-wechsel → sync
   */
  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem("token");

      if (token) {
        setLoggedIn(true);
        const decoded = decodeUserFromToken(token);
        setUser(decoded);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ loggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => useContext(AuthContext);
