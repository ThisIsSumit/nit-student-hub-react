import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token, rollNo: localStorage.getItem('rollNo') });
    }
  }, []);

  const login = (token, rollNo) => {
    localStorage.setItem('token', token);
    localStorage.setItem('rollNo', rollNo);
    setUser({ token, rollNo });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rollNo');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}