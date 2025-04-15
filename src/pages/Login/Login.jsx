"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { validateEmail } from "../../utils/helper"
import { useDispatch } from "react-redux"
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice"
import { toast } from "react-toastify"
import { loginUser } from "../../services/api"
import logo from "./../../assets/images/logomoi4m.png"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showVerificationPopup, setShowVerificationPopup] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleEmailSupport = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=memmomind.io@gmail.com&su=Yêu cầu xác thực tài khoản&body=Xin chào MemmoMind,%0D%0A%0D%0ATôi đang gặp vấn đề với việc xác thực tài khoản.%0D%0A%0D%0AEmail đăng ký của tôi là: " +
      email +
      "%0D%0A%0D%0AVui lòng hỗ trợ tôi xác thực tài khoản để có thể sử dụng dịch vụ.%0D%0A%0D%0AXin cảm ơn!",
      "_blank",
    )
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ")
      return
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu")
      return
    }
    setError("")
    dispatch(signInStart())
    try {
      const data = await loginUser(email, password)
      if (data?.token) {
        localStorage.setItem("token", data.token)
      } else {
        console.warn("❌ Không nhận được token từ server!")
      }

      if (data?.user?.isVerified === false) {
        setShowVerificationPopup(true)
        dispatch(signInFailure("Tài khoản chưa được xác thực"))
        return
      }

      dispatch(signInSuccess(data))
      navigate("/homepage")
    } catch (errorMessage) {
      toast.error("Tài khoản hoặc mật khẩu không đúng!")
      dispatch(signInFailure(errorMessage))
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f5ff]">
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600 text-center">Tài khoản chưa xác thực</h2>
            <p className="mb-4">
              Tài khoản của bạn chưa được xác thực. Hãy gửi email tự động để được hỗ trợ nhanh nhất nhé!.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEmailSupport}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="mr-2"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                </svg>
                Gửi Email hỗ trợ
              </button>
              <button
                onClick={() => setShowVerificationPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center">
            <img src={logo || "/placeholder.svg"} alt="NotePlus Logo" className="h-10" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2">Đăng Nhập</h1>

        <form onSubmit={handleLogin}>
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

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <label htmlFor="remember-me" className="flex items-center cursor-pointer">
                <div className="relative mr-2">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="sr-only"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <div
                    className={`w-4 h-4 rounded-full border ${rememberMe ? "bg-[#1f1c2f] border-[#1f1c2f]" : "bg-white border-gray-300"
                      } flex items-center justify-center`}
                  >
                    {rememberMe && (
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
                <span className="text-gray-500">Ghi nhớ tài khoản</span>
              </label>
            </div>
            <Link to="/forgot-password" className="text-[#1f1c2f] hover:underline">
              Quên mật khẩu?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#1f1c2f] transition-colors"
          >
            Đăng nhập
          </button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-600">Bạn chưa có tài khoản? </span>
          <Link to="/signup" className="text-[#1f1c2f] font-bold hover:underline">
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login
