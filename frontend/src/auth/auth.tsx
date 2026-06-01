import React, { useState, useEffect } from 'react';
import { LoginForm } from './loginForm';
import { LoginPage } from '../pages/loginPage';
import { RegistrationPage } from '../pages/RegistrationPage';

export const Auth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
debugger;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          method: 'GET',
          credentials: 'include'
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  return isAuthenticated;
};