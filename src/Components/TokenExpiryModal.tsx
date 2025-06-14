import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface TokenExpiryModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

const TokenExpiryModal = ({ isOpen, onClose, message = "Your session has expired. Please login again." }: TokenExpiryModalProps) => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogin = () => {
        logout();
        navigate('/login');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                <h2 className="text-xl font-semibold text-heading-black mb-4">Session Expired</h2>
                <p className="text-text-gray mb-6">{message}</p>
                <div className="flex justify-end">
                    <button
                        onClick={handleLogin}
                        className="px-4 py-2 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-md hover:opacity-90 transition-opacity"
                    >
                        Login Again
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TokenExpiryModal; 