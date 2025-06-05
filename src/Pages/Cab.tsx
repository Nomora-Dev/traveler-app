import { useState } from 'react';
import CityTransfer from '../Components/Cab/Transfers/CityTransfer';
import TerminalTransfer from '../Components/Cab/Transfers/TerminalTransfer';
import Navbar from '../Components/Navbar';
import MultidayRental from '../Components/Cab/MultidayRental/MultidayRental';
import Hourly from '../Components/Cab/HourlyRental/Hourly';

const tabList = [
    { label: 'City', value: 'city' },
    { label: 'Multiday', value: 'multiday' },
    { label: 'Terminal', value: 'terminal' },
    // { label: 'Rental', value: 'rental' },
    { label: 'Hourly', value: 'hourly' },
];

// const OutstationTransfer = () => <div className="py-20 text-center text-text-gray">Outstation Transfer UI coming soon...</div>;
// const RentalTransfer = () => <div className="py-20 text-center text-text-gray">Rental Transfer UI coming soon...</div>;

const Cab = () => {
    const [tab, setTab] = useState('city');

    let Content;
    if (tab === 'city') Content = <CityTransfer />;
    else if (tab === 'terminal') Content = <TerminalTransfer />;
    else if (tab === 'multiday') Content = <MultidayRental />;
    // else if (tab === 'rental') Content = <RentalTransfer />;
    else if (tab === 'hourly') Content = <Hourly />;

    return (
        <div className="min-h-screen bg-white pb-20 font-sans">
            <div className="w-full max-w-md mx-auto px-0 pt-0">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-lg px-0 pt-0 pb-2 mt-0">
                    {/* Header */}
                    <div className="pt-8 pb-2 px-8 flex flex-col items-center">
                        <h2 className="text-2xl font-semibold text-heading-black mb-2 text-center font-sans">Book {tab === 'terminal' ? 'a Cab' : tab === 'city' ? 'a City Transfer' : tab === 'hourly' ? 'an Hourly Rental' : 'an Outstation Trip'}</h2>
                    </div>
                    {/* Tab Bar */}
                    <div className="flex bg-gray-100 rounded-xl p-1 mb-4 w-[95%] mx-auto gap-2">
                        {tabList.map(t => (
                            <button
                                key={t.value}
                                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150 font-sans ${tab === t.value ? 'bg-gradient-to-r from-hero-peach to-hero-green text-white shadow' : 'text-gray-600'}`}
                                onClick={() => setTab(t.value)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className="px-2 sm:px-8">{Content}</div>
                </div>
            </div>
            <Navbar />
        </div>
    );
};

export default Cab; 