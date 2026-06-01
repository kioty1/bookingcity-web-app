import { useState, useEffect } from 'react';
import { AuthUserType } from '../types/auth.types';


export const Auth = () => {
  const [user, setUser] = useState<AuthUserType | false | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          setUser(false);
          return;
        }

        const data = await response.json();

        if (data.user) {
          setUser(data.user);
        } else {
          setUser(false);
        }
      } catch (error) {
        setUser(false);
      }
    };

    checkAuth();
  }, []);

  return user;
};