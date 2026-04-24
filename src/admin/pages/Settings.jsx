import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import API_BASE_URL from '../../config/api';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('New passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to change password');
      }

      setSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0 }}>Account Settings</h1>
        <p style={{ color: '#64748b' }}>Manage your admin security credentials</p>
      </div>

      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Lock size={20} color="var(--gold)" /> Change Password
        </h3>

        {error && (
          <div style={errorStyle}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        {success && (
          <div style={successStyle}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
          <div>
            <label style={labelStyle}>Current Password</label>
            <input 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              style={inputStyle}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={{ borderTop: '1px solid #edf2f7', margin: '10px 0', paddingTop: '20px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            style={btnStyle}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : (
              <>
                Update Password <Save size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

const cardStyle = {
  background: '#fff',
  padding: '30px',
  borderRadius: '20px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
  border: '1px solid #edf2f7'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: '600',
  color: '#475569',
  marginBottom: '8px'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  borderRadius: '10px',
  border: '1px solid #e2e8f0',
  background: '#f8fafc',
  fontSize: '0.95rem',
  outline: 'none'
};

const btnStyle = {
  width: '100%',
  padding: '14px 24px',
  background: '#1a1f2e',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  fontSize: '0.95rem',
  fontWeight: '600',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  marginTop: '20px',
  transition: '0.2s',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const errorStyle = {
  background: '#fee2e2',
  color: '#ef4444',
  padding: '15px',
  borderRadius: '12px',
  marginBottom: '20px',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  border: '1px solid #fecaca'
};

const successStyle = {
  background: '#f0fdf4',
  color: '#22c55e',
  padding: '15px',
  borderRadius: '12px',
  marginBottom: '20px',
  fontSize: '0.9rem',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  border: '1px solid #bbf7d0'
};

export default Settings;
