"use client"

import { useEffect, useRef, useState } from "react"
import { FaUserCircle, FaUser, FaSignOutAlt, FaChevronDown } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import api from "../../services/api"
import { toast } from "react-toastify"
import { signoutSuccess } from "../../redux/user/userSlice"

const ProfileInfo = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const initialUserCheck = useRef(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!initialUserCheck.current) {
      initialUserCheck.current = true
      if (!currentUser) {
        navigate("/")
      } else {
        getUserInfo()
      }
    }
  }, [currentUser, navigate])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getUserInfo = async () => {
    try {
      const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
        withCredentials: true,
      })

      if (!res.data.success) {
        toast.error("Không thể lấy thông tin người dùng!")
        return
      }

      setUserInfo(res.data.user)
    } catch (error) {
      console.error("Error fetching user info:", error)
      toast.error("Lỗi khi lấy thông tin người dùng!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    dispatch(signoutSuccess())
    navigate("/login")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 p-4 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-300 text-white">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar || "/placeholder.svg"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-2xl" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold  text-[#1f1c2f]">{userInfo?.name || "User"}</span>
            <FaChevronDown
              className={`text-[#1f1c2f] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 left-0 mt-1 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-100">
          <div className="py-1">
            <button
              onClick={() => navigate("/profile")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <FaUser className="mr-3 text-gray-500" />
              Trang cá nhân
            </button>
          </div>
          <div className="border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaSignOutAlt className="mr-3 text-gray-500" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileInfo
