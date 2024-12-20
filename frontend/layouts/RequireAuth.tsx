import { Navigate, useLocation } from 'react-router-dom';
import React from 'react';
import { useAuthStore } from '../store/authStore'

function RequireAuth({ children }: { children: React.ReactNode }) {
    const {user, status } = useAuthStore((state)=> state)
    const location = useLocation();
    if (status === 'loading') {
        return <></>;
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

export default RequireAuth;