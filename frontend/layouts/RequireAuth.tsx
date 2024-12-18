import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import React from 'react';

function RequireAuth({ children }: { children: React.ReactNode }) {
    const auth = useAuth();
    const location = useLocation();

    if (!auth || !auth.user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

export default RequireAuth;