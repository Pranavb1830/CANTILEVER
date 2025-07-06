import { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 👈 add loading state
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false); // ✅ done loading
  }, []);

  const login = async (username, password) => {
    try {
      const res = await API.post('/auth/login', { username, password });
      const userData = { ...res.data.user, token: res.data.token };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await API.post('/auth/register', { username, email, password });
      const userData = { ...res.data.user, token: res.data.token };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};