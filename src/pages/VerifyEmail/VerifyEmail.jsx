"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { verifyEmail } from "../../services/api"
import logo from "./../../assets/images/logomoi4m.png"
import { CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react"

const VerifyEmail = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const urlParams = new URLSearchParams(location.search)
    const token = urlParams.get("token")

    const [verificationStatus, setVerificationStatus] = useState(null)

    useEffect(() => {
        if (!token) {
            setVerificationStatus("invalid")
        } else {
            // Call API to verify email
            verifyEmail(token)
                .then(() => {
                    setVerificationStatus("success")
                })
                .catch(() => {
                    setVerificationStatus("failed")
                })
        }
    }, [token])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f5ff]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                        <img src={logo || "/placeholder.svg"} alt="NotePlus Logo" className="h-10" />
                    </div>
                </div>

                <div className="text-center">
                    {verificationStatus === "success" ? (
                        <>
                            <div className="flex justify-center mb-4">
                                <CheckCircle className="h-16 w-16 text-green-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác thực thành công!</h2>
                            <p className="text-gray-600 mb-8">
                                Tài khoản của bạn đã được xác thực. Bây giờ bạn có thể đăng nhập.
                            </p>
                        </>
                    ) : verificationStatus === "failed" ? (
                        <>
                            <div className="flex justify-center mb-4">
                                <XCircle className="h-16 w-16 text-red-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Xác thực thất bại!</h2>
                            <p className="text-gray-600 mb-8">Vui lòng kiểm tra lại hoặc thử lại sau.</p>
                        </>
                    ) : verificationStatus === "invalid" ? (
                        <>
                            <div className="flex justify-center mb-4">
                                <AlertCircle className="h-16 w-16 text-amber-500" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Liên kết không hợp lệ!</h2>
                            <p className="text-gray-600 mb-8">
                                Vui lòng kiểm tra lại email của bạn.
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="flex justify-center mb-4">
                                <Loader className="h-16 w-16 text-[#1e2a4a] animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Đang xác thực...</h2>
                            <p className="text-gray-600 mb-8">Vui lòng đợi trong khi chúng tôi xác thực Email của bạn!</p>
                        </>
                    )}

                    <button
                        onClick={() => navigate("/login")}
                        className="w-full py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#2a3a5a] transition-colors"
                    >
                        Quay lại trang Đăng nhập
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VerifyEmail
