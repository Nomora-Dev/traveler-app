import { Home, Car, Briefcase, User } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
    { label: 'Home', icon: Home, to: '/home' },
    { label: 'Cab', icon: Car, to: '/cab' },
    { label: 'Travel', icon: Briefcase, to: '/travel' },
    { label: 'Account', icon: User, to: '/account' },
];

const Navbar = () => {
    const location = useLocation();
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
            <div className="flex justify-around items-center h-16">
                {navItems.map(({ label, icon: Icon, to }) => {
                    const isActive = location.pathname === to;
                    return (
                        <NavLink
                            key={label}
                            to={to}
                            className="flex flex-col items-center justify-center flex-1"
                        >
                            <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-white bg-hero-peach rounded-full p-1' : 'text-gray-400'}`} />
                            <span className={`text-xs ${isActive ? 'text-hero-peach font-semibold' : 'text-gray-500'}`}>{label}</span>
                        </NavLink>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navbar; 