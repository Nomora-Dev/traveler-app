import { ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { verifyOtp, requestOtp } from '../services/user';
import { useAuth } from '../context/AuthContext';

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();
    const mobileNumber = location.state?.mobileNumber;

    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [timer, setTimer] = useState(29);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);

    useEffect(() => {
        if (!mobileNumber) {
            console.warn("Mobile number not found in location state. Redirecting to login.");
            navigate("/login");
            return;
        }

        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [timer, mobileNumber, navigate]);

    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        //Focus next input
        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus();
        }
    };

    const handleResend = async () => {
        if (!mobileNumber) return;
        setResendError(null);
        setResendLoading(true);
        try {
            await requestOtp(mobileNumber);
            setTimer(29); // Reset timer
        } catch (err) {
            console.error("Error resending OTP:", err);
            setResendError("Failed to resend OTP. Please try again.");
        } finally {
            setResendLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!mobileNumber) return;
        const enteredOtp = otp.join("");
        if (enteredOtp.length !== 6) {
            setError("Please enter the complete 6-digit OTP.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            console.log("Verifying OTP:", enteredOtp, "for mobile:", mobileNumber);
            const response = await verifyOtp(mobileNumber, enteredOtp);
            console.log("OTP verified successfully:", response);
            if (response.token) {
                login(response.token);
                navigate("/home");
            } else {
                setError("No token received from server");
            }
        } catch (err) {
            console.error("Error verifying OTP:", err);
            setError("Invalid OTP or an error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!mobileNumber) {
        return null;
    }

    return (
        <div className='flex flex-col items-center justify-start min-h-screen px-8 py-10'>
            <div className="w-full flex items-center justify-between mb-10">
                <Link to="/login">
                    <ArrowLeft className='w-7 h-7 text-icon-color' />
                </Link>
                <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-br from-hero-peach to-hero-green flex items-center justify-center text-white font-bold text-[24px] mr-[15px] shadow-md animate-pulse">
                    N
                </div>
                <div className='w-7'></div>
            </div>

            <h2 className='text-heading-black text-2xl font-semibold mt-8 mb-2'>Enter Verification Code</h2>
            <p className='text-text-gray text-sm mb-10'>
                OTP sent to {mobileNumber ? `${mobileNumber.slice(0, 3)} ${mobileNumber.slice(3, 8)} ${mobileNumber.slice(8)}` : "your number"}
            </p>

            <div className='flex items-center justify-center gap-2 sm:gap-3 mb-10'>
                {otp.map((data, index) => {
                    return (
                        <input
                            className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-semibold border border-primary-stroke rounded-md bg-white focus:border-hero-peach focus:ring-1 focus:ring-hero-peach outline-none"
                            type="text"
                            name="otp"
                            maxLength={1}
                            key={index}
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onFocus={e => e.target.select()}
                        />
                    );
                })}
            </div>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button 
                onClick={handleContinue} 
                className='w-full max-w-md py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-md my-4 disabled:opacity-70'
                disabled={loading}
            >
                {loading ? "Verifying..." : "Continue"}
            </button>

            <div className='flex flex-col items-center justify-center gap-1 text-sm text-text-gray my-4'>
                {resendError && <p className="text-red-500 text-sm mb-1">{resendError}</p>}
                {timer > 0 ? (
                    <>
                        <span>Didn't receive the code?</span>
                        <button
                            className='text-text-gray font-medium'
                            disabled
                        >
                            Resend in {timer}s
                        </button>
                    </>
                ) : (
                    <>
                        <span>Didn't receive the code?</span>
                        <button
                            onClick={handleResend}
                            className='text-blue-700 font-medium hover:underline disabled:opacity-70'
                            disabled={resendLoading}
                        >
                            {resendLoading ? "Resending..." : "Resend"}
                        </button>
                    </>
                )}
            </div>

            {/* <div className='mt-auto flex items-center gap-2 text-text-gray text-sm'>
                <ShieldCheck className='w-5 h-5 text-green-500' />
                Your data is secure and protected
            </div> */}
        </div>
    );
};

export default OtpVerification; 