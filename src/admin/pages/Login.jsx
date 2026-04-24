import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, LogIn, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(username, password);
    
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setError(result.error || 'Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const handleSetup = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/setup`, { method: 'POST' });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      alert('Error setting up default admin');
    }
  };

  return (
    <div style={pageStyle}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={loginCard}
      >
        <div style={headerStyle}>
          <div style={logoBadge}>N</div>
          <h2 style={{ margin: '10px 0 5px 0', fontSize: '1.5rem', fontWeight: '800' }}>Admin Portal</h2>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Enter your credentials to access the panel</p>
        </div>

        {error && (
          <div style={errorStyle}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={labelStyle}>Username</label>
            <div style={inputWrapper}>
              <User size={18} style={inputIcon} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={inputWrapper}>
              <Lock size={18} style={inputIcon} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={inputStyle}
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={btnStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Authenticating...' : (
              <>
                Login Securely <LogIn size={18} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '30px', textAlign: 'center' }}>
          <button onClick={handleSetup} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '0.8rem', cursor: 'pointer', textDecoration: 'underline' }}>
            Initialize Default Admin (First Time Only)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Styles
const pageStyle = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f8fafc',
  padding: '20px'
};

const loginCard = {
  background: '#fff',
  padding: '40px',
  borderRadius: '24px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
  width: '100%',
  maxWidth: '400px',
  border: '1px solid #edf2f7'
};

const headerStyle = {
  textAlign: 'center',
  marginBottom: '30px'
};

const logoBadge = {
  width: '50px',
  height: '50px',
  background: '#1a1f2e',
  color: 'var(--gold)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: '900',
  margin: '0 auto'
};

const errorStyle = {
  background: '#fee2e2',
  color: '#ef4444',
  padding: '12px',
  borderRadius: '8px',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontSize: '0.85rem',
  fontWeight: '500'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#334155',
  marginBottom: '8px'
};

const inputWrapper = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const inputIcon = {
  position: 'absolute',
  left: '12px',
  color: '#94a3b8'
};

const inputStyle = {
  width: '100%',
  padding: '12px 12px 12px 40px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'all 0.2s'
};

const btnStyle = {
  width: '100%',
  padding: '14px',
  background: '#1a1f2e',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '1rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '10px',
  transition: '0.2s',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

export default Login;
