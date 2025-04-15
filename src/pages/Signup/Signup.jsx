"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import logo from "./../../assets/images/logomoi4m.png"
import { registerUser } from "../../services/api"

const Signup = () => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [error, setError] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [firstNameFocused, setFirstNameFocused] = useState(false)
  const [lastNameFocused, setLastNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault()

    if (!firstName || !lastName) {
      setError("Vui lòng nhập tên đầy đủ của bạn")
      return
    }

    if (!validateEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ")
      return
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu!")
      return
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu và xác nhận mật khẩu không khớp!")
      return
    }

    if (!agreeTerms) {
      setError("Bạn phải đồng ý với các điều khoản sử dụng")
      return
    }

    setError("")

    // Call registration API
    try {
      const fullName = `${firstName} ${lastName}`
      // eslint-disable-next-line no-unused-vars
      const data = await registerUser(fullName, email, password)
      setIsModalOpen(true)
    } catch (errorMessage) {
      setError(errorMessage)
    }
  }

  const handleVerification = () => {
    setIsModalOpen(false)
    navigate("/login")
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f5ff]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <img src={logo || "/placeholder.svg"} alt="NotePlus Logo" className="h-10" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Đăng Ký</h1>
        <p className="text-gray-500 text-center mb-6">Nhớ điền đầy đủ thông tin nhé!</p>

        <form onSubmit={handleSignUp}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <input
                type="text"
                id="firstName"
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2a4a] peer"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onFocus={() => setFirstNameFocused(true)}
                onBlur={() => setFirstNameFocused(false)}
                required
              />
              <label
                htmlFor="firstName"
                className={`absolute text-gray-500 duration-300 transform ${firstNameFocused || firstName
                  ? "text-xs -translate-y-4 top-2 left-2 bg-white px-1"
                  : "text-base top-3 left-4"
                  } transition-all pointer-events-none`}
              >
                Họ
              </label>
            </div>

            <div className="relative">
              <input
                type="text"
                id="lastName"
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2a4a] peer"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onFocus={() => setLastNameFocused(true)}
                onBlur={() => setLastNameFocused(false)}
                required
              />
              <label
                htmlFor="lastName"
                className={`absolute text-gray-500 duration-300 transform ${lastNameFocused || lastName
                  ? "text-xs -translate-y-4 top-2 left-2 bg-white px-1"
                  : "text-base top-3 left-4"
                  } transition-all pointer-events-none`}
              >
                Tên
              </label>
            </div>
          </div>

          <div className="mb-4 relative">
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

          <div className="mb-4 relative">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2a4a] peer pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
              />
              <label
                htmlFor="password"
                className={`absolute text-gray-500 duration-300 transform ${passwordFocused || password
                  ? "text-xs -translate-y-4 top-2 left-2 bg-white px-1"
                  : "text-base top-3 left-4"
                  } transition-all pointer-events-none`}
              >
                Mật khẩu
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-4 relative">
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                className="block w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2a4a] peer pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                required
              />
              <label
                htmlFor="confirmPassword"
                className={`absolute text-gray-500 duration-300 transform ${confirmPasswordFocused || confirmPassword
                  ? "text-xs -translate-y-4 top-2 left-2 bg-white px-1"
                  : "text-base top-3 left-4"
                  } transition-all pointer-events-none`}
              >
                Xác nhận mật khẩu
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="terms" className="flex items-center cursor-pointer">
              <div className="relative mr-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="sr-only"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms(!agreeTerms)}
                />
                <div
                  className={`w-4 h-4 rounded-full border ${agreeTerms ? "bg-[#1f1c2f] border-[#1f1c2f]" : "bg-white border-gray-300"
                    } flex items-center justify-center`}
                >
                  {agreeTerms && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-gray-500">Tôi đồng ý với các điều khoản sử dụng!</span>
            </label>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#1f1c2f] transition-colors"
          >
            Đăng ký
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600">Bạn đã có tài khoản? </span>
          <Link to="/login" className="text-[#1f1c2f] font-bold hover:underline">
            Đăng Nhập
          </Link>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold text-gray-800">Xác thực tài khoản!</h2>
            <p className="text-red-500 mt-2 mb-6">
              Vui lòng kiểm tra email để xác thực tài khoản. Nếu không thấy email, vui lòng kiểm tra trong hòm <strong>Thư rác</strong>.
            </p>
            <a
              className="px-6 py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#1f1c2f] inline-block"
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleVerification}
            >
              Xác thực tại đây!
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Signup
