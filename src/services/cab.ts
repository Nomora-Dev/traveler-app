import axios from 'axios';
import type { LocationSuggestion, TransferBooking } from '../types/types';

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
