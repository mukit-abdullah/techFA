import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(process.env.REACT_APP_ACCESS_TOKEN_KEY);
    if (token) setUser(jwtDecode(token));
  }, []);

  const login = (token) => {
    localStorage.setItem(process.env.REACT_APP_ACCESS_TOKEN_KEY, token);
    setUser(jwtDecode(token));
  };

  const logout = () => {
    localStorage.removeItem(process.env.REACT_APP_ACCESS_TOKEN_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
