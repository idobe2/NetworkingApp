import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from './tokenStorage';
import clientApi from '../api/ClientApi';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { WEB_GOOGLE_CLIENT_ID } from '../core/config';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        if (!token) {
          console.log('No token found');
          return;
        }
        console.log('Checking token...');
        const valid = await clientApi.get('/check');
        console.log('Valid:', valid?.data.message);
        if (valid?.data.message === 'Authenticated') {
          console.log('User is authenticated');
          setIsAuthenticated(true);
          
          const isSignedInWithGoogle = await GoogleSignin.isSignedIn();
          if (isSignedInWithGoogle) {
            console.log('User is signed in with Google, reconfiguring...');
            GoogleSignin.configure({
              webClientId: WEB_GOOGLE_CLIENT_ID,
              offlineAccess: true,
            });
          }
        }
      } catch (error) {
        console.error('Error checking token:', error);
      } finally {
        setTimeout(() => { setLoading(false); }, 3000);
      }
    };

    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
