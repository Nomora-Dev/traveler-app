import { ArrowRight, Phone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { requestOtp, verifyOtp } from '../services/user'
import { useAuth } from '../context/AuthContext'

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [mobileNumber, setMobileNumber] = useState("")
    const [prefix, setPrefix] = useState("+91")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [otp, setOtp] = useState(new Array(6).fill(""))
    const [timer, setTimer] = useState(0)
    const [showOtp, setShowOtp] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)

    useEffect(() => {
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1)
            }, 1000)
            return () => clearInterval(intervalId)
        }
    }, [timer])

    const handleOtpChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return false

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

        if (element.nextSibling && element.value) {
            (element.nextSibling as HTMLInputElement).focus()
        }
    }

    const handleRequestOtp = async () => {
        if (mobileNumber.length !== 10) {
            setError("Please enter a valid 10-digit mobile number.")
            return
        }
        setError(null)
        setLoading(true)
        const fullMobileNumber = prefix + mobileNumber
        try {
            console.log('Requesting OTP for:', fullMobileNumber)
            await requestOtp(fullMobileNumber)
            console.log('OTP requested successfully')
            setShowOtp(true)
            setTimer(29)
        } catch (err) {
            console.error("Error requesting OTP:", err)
            setError("Failed to send OTP. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleResendOtp = async () => {
        if (mobileNumber.length !== 10) return
        setError(null)
        setResendLoading(true)
        const fullMobileNumber = prefix + mobileNumber
        try {
            await requestOtp(fullMobileNumber)
            setTimer(29)
        } catch (err) {
            console.error("Error resending OTP:", err)
            setError("Failed to resend OTP. Please try again.")
        } finally {
            setResendLoading(false)
        }
    }

    const handleVerifyOtp = async () => {
        const fullMobileNumber = prefix + mobileNumber
        const enteredOtp = otp.join("")
        if (enteredOtp.length !== 6) {
            setError("Please enter the complete 6-digit OTP.")
            return
        }
        setError(null)
        setLoading(true)
        try {
            console.log("Verifying OTP:", enteredOtp, "for mobile:", fullMobileNumber)
            const response = await verifyOtp(fullMobileNumber, enteredOtp)
            console.log("OTP verified successfully:", response)
            if (response.token) {
                login(response.token)
                navigate("/home")
            } else {
                setError("No token received from server")
            }
        } catch (err) {
            console.error("Error verifying OTP:", err)
            setError("Invalid OTP or an error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col items-center justify-start h-screen px-8'>
            <div className="w-[50px] h-[50px] mt-16 rounded-full bg-gradient-to-br from-hero-peach to-hero-green flex items-center justify-center text-white font-bold text-[24px] mr-[15px] shadow-md animate-pulse">
                N
            </div>

            <h2 className='text-heading-black text-2xl font-semibold mt-12 mb-4'>Welcome to Nomora</h2>
            <p className='text-text-gray text-sm'>Seamless travel experience with Nomora</p>
            <img src="splash.png" alt="splash" className='w-full h-auto my-10' />
            <div className='flex flex-col w-full items-center justify-center gap-8'>
                <div className="w-full text-left">
                    <h1 className="text-heading-black text-3xl font-medium">Login</h1>
                </div>

                {!showOtp ? (
                    <>
                        <div className='w-full flex items-center justify-start gap-1 border-b-2 border-primary-stroke p-2'>
                            <Phone className='w-7 h-7 text-icon-color mr-2' />
                            <select 
                                value={prefix} 
                                onChange={(e) => setPrefix(e.target.value)} 
                                className='outline-none bg-transparent text-text-gray mr-1 p-2'
                            >
                                <option value="+91">+91</option>
                            </select>
                            <input 
                                type="tel"
                                placeholder='Mobile Number' 
                                className='outline-none bg-transparent text-text-gray placeholder:text-text-gray w-full'
                                value={mobileNumber} 
                                onChange={(e) => setMobileNumber(e.target.value)}
                                maxLength={10}
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                        <button 
                            onClick={handleRequestOtp} 
                            className='w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-md my-4 disabled:opacity-70'
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Get OTP"}
                            {!loading && <ArrowRight />}
                        </button>
                    </>
                ) : (
                    <>
                        <p className='text-text-gray text-sm mb-2'>
                            OTP sent to {`${mobileNumber.slice(0, 3)} ${mobileNumber.slice(3, 8)} ${mobileNumber.slice(8)}`}
                        </p>
                        <div className='flex items-center justify-center gap-2 sm:gap-3 mb-4'>
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl font-semibold border border-primary-stroke rounded-md bg-white focus:border-hero-peach focus:ring-1 focus:ring-hero-peach outline-none"
                                    type="text"
                                    name="otp"
                                    maxLength={1}
                                    value={data}
                                    onChange={e => handleOtpChange(e.target, index)}
                                    onFocus={e => e.target.select()}
                                />
                            ))}
                        </div>
                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        <button 
                            onClick={handleVerifyOtp} 
                            className='w-full py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-hero-peach to-hero-green text-white rounded-md my-4 disabled:opacity-70'
                            disabled={loading}
                        >
                            {loading ? "Verifying..." : "Continue"}
                        </button>
                        <div className='flex flex-col items-center justify-center gap-1 text-sm text-text-gray'>
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
                                        onClick={handleResendOtp}
                                        className='text-blue-700 font-medium hover:underline disabled:opacity-70'
                                        disabled={resendLoading}
                                    >
                                        {resendLoading ? "Resending..." : "Resend"}
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Login