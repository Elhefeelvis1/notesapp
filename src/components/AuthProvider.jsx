import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient.js';
import BouncingLoader from './BouncingLoader.jsx';

// 1. Create Context
const AuthContext = createContext({});

// 2. The Provider
export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false); 
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook for easy access
export const useAuth = () => useContext(AuthContext);

// 4. Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { session, loading } = useAuth(); 
  const location = useLocation();

  if (loading) return <BouncingLoader />;

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;