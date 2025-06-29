// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence 
} from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        setUser(user);
      } catch (error) {
        console.error("Error setting persistence:", error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return { user, loading };
}