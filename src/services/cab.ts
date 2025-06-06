import axios from 'axios';
import type { LocationSuggestion, TransferBooking, HourlySearchResponse, TerminalTransferBooking, MultidaySearchResponse } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

export const getLocationSuggestions = async (location: string): Promise<LocationSuggestion> => {
    try {
        const response = await axios.get<LocationSuggestion>(`${API_BASE_URL}/maps/search-location?input=${encodeURIComponent(location)}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        // If no data is returned or data is empty, return a proper response
        if (!response.data || !response.data.data || response.data.data.length === 0) {
            return {
                success: false,
                message: 'No locations found. Please try a different search term.',
                data: []
            };
        }
        
        return response.data;
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
        // Return a proper error response instead of throwing
        return {
            success: false,
            message: 'Failed to fetch location suggestions. Please try again.',
            data: []
        };
    }
}

export const getTransferBooking = async (bookingData: TransferBooking) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transfers/search`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: bookingData
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transfer booking:', error);
        throw error;
    }
}

export const getTerminalTransferBooking = async (bookingData: TerminalTransferBooking) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transfers/search-terminal`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: bookingData
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching transfer booking:', error);
        throw error;
    }
}

export const getHourlyTransferBooking = async (params: any): Promise<HourlySearchResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rentals/search`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching hourly transfer booking:', error);
        return {
            success: false,
            data: {
                suppliers: [],
                route_info: {
                    pickup_location: '',
                    drop_location: '',
                    distance_km: 0,
                    duration: ''
                }
            }
        };
    }
}

export const getTerminalSuggestions = async (query: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/transfers/terminal/search`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching terminal suggestions:', error);
        return {
            success: false,
            message: 'Failed to fetch terminal suggestions. Please try again.',
            data: []
        };
    }
};

export const getMultidayTransferBooking = async (params: any): Promise<MultidaySearchResponse> => {
    const response = await axios.get(`${API_BASE_URL}/rentals/search`, { params });
    return response.data;
};

export const createBooking = async (bookingData: any) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/bookings/create`, bookingData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating booking:', error);
        throw error;
    }
};

export const getBookingDetails = async (bookingId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/bookings/details/${bookingId}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching booking details:', error);
        throw error;
    }
};
