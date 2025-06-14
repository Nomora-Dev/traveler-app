import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:5000/api/v1';

interface OtpResponse {
    // Define expected response structure for requesting OTP if needed
    message: string;
    // Add other fields as per your backend response
}

interface VerifyOtpResponse {
    // Define expected response structure for verifying OTP
    success: boolean;
    message: string;
    data: {
        id: number;
        mobile_number: string;
        name: string;
        email: string;
        role: string;
        isNewUser: boolean;
        token: string;
    }
}

export const requestOtp = async (mobile_number: string): Promise<OtpResponse> => {
    try {
        const response = await axios.post<OtpResponse>(`${API_BASE_URL}/users/request-otp`, { mobile_number });
        return response.data;
    } catch (error) {
        console.error('Error requesting OTP:', error);
        // Handle error appropriately in your components
        throw error; // Re-throw or return a specific error structure
    }
};

export const verifyOtp = async (mobile_number: string, otp: string): Promise<VerifyOtpResponse> => {
    try {
        const response = await axios.post<VerifyOtpResponse>(`${API_BASE_URL}/users/verify-otp`, { mobile_number, otp });
        return response.data;
    } catch (error) {
        console.error('Error verifying OTP:', error);
        // Handle error appropriately in your components
        throw error; // Re-throw or return a specific error structure
    }
};

export const checkTokenValidity = async (): Promise<any> => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        
        // const response = await axios.get(`${API_BASE_URL}/users/me`, {
        //     headers: {
        //         Authorization: `Bearer ${token}`
        //     }
        // });
        // return response;
    } catch (error) {
        console.error('Error checking token validity:', error);
        return false;
    }
}; 