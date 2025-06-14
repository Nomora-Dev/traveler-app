import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { checkTokenValidity } from '../services/user';
import TokenExpiryModal from '../Components/TokenExpiryModal';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    user: any;
    isAuthenticated: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
    showExpiryModal: (message?: string) => void;
    validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const [isExpiryModalOpen, setIsExpiryModalOpen] = useState(false);
    const [expiryMessage, setExpiryMessage] = useState<string>("");
    const [user, setUser] = useState<any>(null);
    const navigate = useNavigate();

    // Check token validity on initial load
    useEffect(() => {
        const validateInitialToken = async () => {
            const storedToken = localStorage.getItem('token');
            console.log(storedToken);
            if (storedToken) {
                const isValid = await checkTokenValidity();
                if (!isValid) {
                    handleTokenExpiry();
                } else {
                    setToken(storedToken);
                    setIsAuthenticated(true);
                }
            }
        };

        validateInitialToken();
    }, []);

    const handleTokenExpiry = () => {
        logout();
        showExpiryModal();
    };

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    const showExpiryModal = (message?: string) => {
        setExpiryMessage(message || "Your session has expired. Please login again.");
        setIsExpiryModalOpen(true);
    };

    const validateToken = async (): Promise<any> => {
        if (!token) return false;
        
        const res = await checkTokenValidity();
        if (res.status !== 200) {
            handleTokenExpiry();
            navigate('/login');
            return false;
        }
        setUser(res.data.data);
        return true;
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, token, login, logout, showExpiryModal, validateToken }}>
            {children}
            <TokenExpiryModal 
                isOpen={isExpiryModalOpen}
                onClose={() => setIsExpiryModalOpen(false)}
                message={expiryMessage}
            />
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 