"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { showToast } from '@/utils/toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations('auth');
  const tCommon = useTranslations('common');

  // Temporary credentials for testing while backend is offline
  const TEMP_CREDENTIALS = {
    email: 'admin@djofo.bj',
    password: 'admin123'
  };

  // Helper function to set cookie
  const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, try the real API
      const response = await fetch('https://api.djofo.bj/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('userData', JSON.stringify(data.data));
        
        // Set cookie for middleware authentication
        setCookie('accessToken', data.access);
        
        showToast.success(t('loginSuccess'));
        router.push('/dashboard');
        return;
      }
    } catch {
      console.log('API not available, using temporary credentials');
    }

    // Fallback to temporary credentials if API is not available
    if (email === TEMP_CREDENTIALS.email && password === TEMP_CREDENTIALS.password) {
      // Simulate API response
      const mockUserData = {
        id: 1,
        email: 'admin@djofo.bj',
        name: 'Admin User',
        role: 'admin'
      };

      const tempToken = 'temp-token-' + Date.now();
      localStorage.setItem('accessToken', tempToken);
      localStorage.setItem('refreshToken', 'temp-refresh-' + Date.now());
      localStorage.setItem('userData', JSON.stringify(mockUserData));
      
      // Set cookie for middleware authentication
      setCookie('accessToken', tempToken);
      
      showToast.success(t('loginSuccess'));
      router.push('/dashboard');
    } else {
      showToast.error(t('loginError'));
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* <h1>Admin Login</h1> */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">{tCommon('email')}</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{tCommon('password')}</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? tCommon('loading') : tCommon('login')}
          </button>
        </form>
        
        {/* Temporary credentials display for testing */}
        {/* <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          background: '#f5f5f5', 
          borderRadius: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          <strong>Test Credentials (Backend Offline):</strong><br />
          Email: <code>{TEMP_CREDENTIALS.email}</code><br />
          Password: <code>{TEMP_CREDENTIALS.password}</code>
        </div> */}
      </div>
    </div>
  );
}