import { useState, useEffect } from 'react';

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export const Auth = () => {
  const [user, setUser] = useState<AuthUser | false | null>(null);

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