"use client"

import { useState } from "react"
import { forgotPassword } from "../../services/api"
import { useNavigate, Link } from "react-router-dom"
import logo from "./../../assets/images/logomoi4m.png"
import { Mail } from "lucide-react"

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [emailFocused, setEmailFocused] = useState(false)

    const navigate = useNavigate()

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        if (!email) {
            setError("Vui lòng nhập địa chỉ email!")
            return
        }
        setError("")
        try {
            await forgotPassword(email)
            setIsModalOpen(true)
        } catch (errorMessage) {
            setError(errorMessage)
        }
    }

    const handleVerification = () => {
        setIsModalOpen(false)
        navigate("/login")
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f5ff]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                        <img src={logo || "/placeholder.svg"} alt="NotePlus Logo" className="h-10" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-center mb-2">Quên mật khẩu</h1>
                <p className="text-gray-500 text-center mb-6">Nhập email của bạn để đến trang đặt lại mật khẩu.</p>

                <form onSubmit={handleForgotPassword}>
                    <div className="mb-6 relative">
                        <div className="relative">
                            <input
                                type="text"
                                id="email"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2a4a] peer"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onFocus={() => setEmailFocused(true)}
                                onBlur={() => setEmailFocused(false)}
                                required
                            />
                            <label
                                htmlFor="email"
                                className={`absolute text-gray-500 duration-300 transform ${emailFocused || email ? "text-xs -translate-y-4 top-2 left-2 bg-white px-1" : "text-base top-3 left-4"
                                    } transition-all pointer-events-none`}
                            >
                                Email
                            </label>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#2a3a5a] transition-colors"
                    >
                        Xác nhận
                    </button>

                    <div className="text-center mt-6">
                        <Link to="/login" className="text-[#1e2a4a] font-bold hover:underline">
                            Trở về trang Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                        <div className="flex justify-center mb-4">
                            <Mail className="h-16 w-16 text-[#1e2a4a]" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">📧 Kiểm tra email của bạn!</h2>
                        <p className="text-gray-600 mb-6">
                            Vui lòng kiểm tra email để khôi phục mật khẩu. Nếu không thấy email, vui lòng kiểm tra hòm <strong>Thư rác</strong>.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <a
                                className="px-6 py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#2a3a5a] transition-colors"
                                href="https://mail.google.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleVerification}
                            >
                                Kiểm tra email!
                            </a>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ForgotPassword
