import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import type { User } from '@capacitor-firebase/authentication';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let listenerHandle: { remove: () => Promise<void> } | undefined;

    FirebaseAuthentication.addListener('authStateChange', (change) => {
      setUser(change.user);
      setLoading(false);
    }).then((handle) => {
      listenerHandle = handle;
    });

    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await FirebaseAuthentication.signInWithEmailAndPassword({ email, password });
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await FirebaseAuthentication.createUserWithEmailAndPassword({ email, password });
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await FirebaseAuthentication.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      await FirebaseAuthentication.signInWithGoogle();
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const context = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithGoogle
  };

  return (
    <AuthContext.Provider value={context}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
