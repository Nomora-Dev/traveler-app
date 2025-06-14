import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useRef } from 'react';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, validateToken } = useAuth();
    const [isChecking, setIsChecking] = useState(true);
    const hasValidated = useRef(false);

    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated && !hasValidated.current) {
                hasValidated.current = true;
                await validateToken();
            }
            setIsChecking(false);
        };

        checkAuth();
    }, [isAuthenticated, validateToken]);

    if (isChecking) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute; 