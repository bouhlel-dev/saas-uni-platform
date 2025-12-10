import { Navigate } from 'react-router-dom';
import { authUtils } from '@/lib/auth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    // Check if user is authenticated
    if (!authUtils.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    // Check role if specified
    if (allowedRoles && allowedRoles.length > 0) {
        const userInfo = authUtils.getUserInfo();
        if (!userInfo || !allowedRoles.includes(userInfo.role)) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return <>{children}</>;
};
