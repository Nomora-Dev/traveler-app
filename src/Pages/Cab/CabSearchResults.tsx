import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HourlySearchResults from '../../Components/Cab/HourlySearchResults';
import TransferCabSearchResults from '../../Components/Cab/TransferCabSearchResults';
import MultidaySearchResults from '../../Components/Cab/MultidaySearchResults';

const CabSearchResults = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { searchResults, type, mode } = location.state || {};

    if (!searchResults || !type) {
        navigate('/cab');
        return null;
    }

    const renderResults = () => {
        switch (type) {
            case 'hourly':
                return <HourlySearchResults searchResults={searchResults} />;
            case 'city':
                return <TransferCabSearchResults searchResults={searchResults} />;
            case 'terminal':
                return <TransferCabSearchResults searchResults={searchResults} mode={mode} />;
            case 'multiday':
                return <MultidaySearchResults searchResults={searchResults} tripDetails={location.state.tripDetails} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
                <div className="flex items-center px-4 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-semibold ml-2">Search Results</h1>
                </div>
            </div>
            {renderResults()}
        </div>
    );
};

export default CabSearchResults; 