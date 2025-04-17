"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { User, Lock, Check, AlertCircle, Eye, EyeOff } from "lucide-react"
import Sidebar from "../../components/Sidebar/Sidebar"
import Footer from "../../components/Footer/Footer"
import api from "../../services/api"
import { toast } from "react-toastify"
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/user/userSlice"

const ProfilePage = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.user)
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState("profile")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [userProfile, setUserProfile] = useState({
        name: "",
        email: "",
    })
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState({
        name: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    })

    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmPassword: false,
    })

    // Fetch user profile
    const fetchUserProfile = async () => {
        setIsLoading(true)
        try {
            // const token = localStorage.getItem("token")
            const response = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/profile", {
                // headers: { Authorization: `Bearer ${token}`, },
            },
                { withCredentials: true },)

            if (response.data) {
                setUserProfile({
                    name: response.data.name || "",
                    email: response.data.email || "",
                })
            }
        } catch (error) {
            console.error("Error fetching profile:", error)
            toast.error("Không thể tải thông tin người dùng")
        } finally {
            setIsLoading(false)
        }
    }

    // Update profile
    const handleUpdateProfile = async (e) => {
        e.preventDefault()

        // Validate name
        if (!userProfile.name.trim()) {
            setErrors({ ...errors, name: "Tên không được để trống" })
            return
        }

        setIsSaving(true)
        try {
            // const token = localStorage.getItem("token")

            const response = await api.put(
                "https://memmomind-be-ycwv.onrender.com/api/user/profile",
                {
                    name: userProfile.name,
                },
                // {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // },
                { withCredentials: true },
            )

            if (response.data) {
                toast.success("Cập nhật thông tin thành công")
                // Cập nhật Redux store với tên mới
                dispatch(setUser({
                    ...currentUser,
                    name: userProfile.name
                }))

                // Load lại trang sau 1 giây để thấy thay đổi
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
                // window.location.reload()
                const userInfoResponse = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
                    withCredentials: true,
                })
                if (userInfoResponse.data.success) {
                    // The name will be updated in the UI through the ProfileInfo component
                    // which fetches the updated data
                }
            }
        } catch (error) {
            console.error("Error updating profile:", error)
            toast.error("Không thể cập nhật thông tin người dùng")
        } finally {
            setIsSaving(false)
        }
    }

    // Change password
    const handleChangePassword = async (e) => {
        e.preventDefault()

        // Reset errors
        setErrors({
            ...errors,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        })

        // Validate passwords
        let hasError = false
        if (!passwordData.currentPassword) {
            setErrors((prev) => ({ ...prev, currentPassword: "Vui lòng nhập mật khẩu hiện tại" }))
            hasError = true
        }

        if (!passwordData.newPassword) {
            setErrors((prev) => ({ ...prev, newPassword: "Vui lòng nhập mật khẩu mới" }))
            hasError = true
        } else if (passwordData.newPassword.length < 6) {
            setErrors((prev) => ({ ...prev, newPassword: "Mật khẩu phải có ít nhất 6 ký tự" }))
            hasError = true
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setErrors((prev) => ({ ...prev, confirmPassword: "Mật khẩu xác nhận không khớp" }))
            hasError = true
        }

        if (hasError) return

        setIsSaving(true)
        try {
            // const token = localStorage.getItem("token")
            const response = await api.put(
                "https://memmomind-be-ycwv.onrender.com/api/auth/change-password",
                {
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                },
                // {
                //     headers: {
                //         Authorization: `Bearer ${token}`,
                //     },
                // },
                { withCredentials: true },
            )

            if (response.data) {
                toast.success("Đổi mật khẩu thành công")
                setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            }
        } catch (error) {
            console.error("Error changing password:", error)
            if (error.response?.status === 401) {
                toast.error("Mật khẩu hiện tại không đúng")
                setErrors((prev) => ({ ...prev, currentPassword: "Mật khẩu hiện tại không đúng" }))
            } else {
                toast.error("Không thể đổi mật khẩu")
            }
        } finally {
            setIsSaving(false)
        }
    }

    // Check if user is logged in
    useEffect(() => {
        if (!currentUser) {
            navigate("/login")
            return
        }

        fetchUserProfile()
    }, [currentUser, navigate])

    return (
        <div className="flex h-screen bg-[#f0f5ff]">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Header */}
                <div className="m-4 p-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
                    <h1 className="text-2xl font-bold text-gray-800">Trang cá nhân</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        {/* Tabs */}
                        <div className="flex justify-center border-b border-gray-200 mb-6">
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "profile"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("profile")}
                            >
                                <User className="inline-block mr-2 h-5 w-5" />
                                Thông tin cá nhân
                            </button>
                            <button
                                className={`px-6 py-3 font-medium ${activeTab === "password"
                                    ? "text-blue-600 border-b-2 border-blue-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                                onClick={() => setActiveTab("password")}
                            >
                                <Lock className="inline-block mr-2 h-5 w-5" />
                                Đổi mật khẩu
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e2a4a]"></div>
                            </div>
                        ) : (
                            <>
                                {/* Profile Tab */}
                                {activeTab === "profile" && (
                                    <form onSubmit={handleUpdateProfile} className="max-w-md mx-auto">
                                        <div className="mb-4">
                                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                Họ và tên
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className={`w-full p-3 border ${errors.name ? "border-red-500" : "border-gray-300"
                                                    } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                                value={userProfile.name}
                                                onChange={(e) => {
                                                    setUserProfile({ ...userProfile, name: e.target.value })
                                                    if (e.target.value.trim()) {
                                                        setErrors({ ...errors, name: "" })
                                                    }
                                                }}
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                                value={userProfile.email}
                                                disabled
                                            />
                                            <p className="mt-1 text-sm text-gray-500">Email không thể thay đổi</p>
                                        </div>

                                        <div className="flex justify-center mt-6">
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#2a3a5a] transition-colors flex items-center"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="h-5 w-5 mr-2" />
                                                        Lưu thay đổi
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Password Tab */}
                                {activeTab === "password" && (
                                    <form onSubmit={handleChangePassword} className="max-w-md mx-auto">
                                        <div className="mb-4">
                                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                Mật khẩu hiện tại
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.currentPassword ? "text" : "password"} id="currentPassword"
                                                    className={`w-full p-3 border ${errors.currentPassword ? "border-red-500" : "border-gray-300"
                                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`} value={passwordData.currentPassword}
                                                    onChange={(e) => {
                                                        setPasswordData({ ...passwordData, currentPassword: e.target.value })
                                                        if (e.target.value) {
                                                            setErrors({ ...errors, currentPassword: "" })
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    onClick={() =>
                                                        setShowPasswords({ ...showPasswords, currentPassword: !showPasswords.currentPassword })
                                                    }
                                                >
                                                    {showPasswords.currentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.currentPassword && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {errors.currentPassword}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                Mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.newPassword ? "text" : "password"}
                                                    id="newPassword"
                                                    className={`w-full p-3 border ${errors.newPassword ? "border-red-500" : "border-gray-300"
                                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                                                    value={passwordData.newPassword}
                                                    onChange={(e) => {
                                                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                                                        if (e.target.value && e.target.value.length >= 6) {
                                                            setErrors({ ...errors, newPassword: "" })
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    onClick={() =>
                                                        setShowPasswords({ ...showPasswords, newPassword: !showPasswords.newPassword })
                                                    }
                                                >
                                                    {showPasswords.newPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.newPassword && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {errors.newPassword}
                                                </p>
                                            )}
                                        </div>

                                        <div className="mb-6">
                                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPasswords.confirmPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    className={`w-full p-3 border ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                                        } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10`}
                                                    value={passwordData.confirmPassword}
                                                    onChange={(e) => {
                                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                                        if (e.target.value === passwordData.newPassword) {
                                                            setErrors({ ...errors, confirmPassword: "" })
                                                        }
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                                                    onClick={() =>
                                                        setShowPasswords({ ...showPasswords, confirmPassword: !showPasswords.confirmPassword })
                                                    }
                                                >
                                                    {showPasswords.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <p className="mt-1 text-sm text-red-500 flex items-center">
                                                    <AlertCircle className="h-4 w-4 mr-1" />
                                                    {errors.confirmPassword}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex justify-center">
                                            <button
                                                type="submit"
                                                className="px-6 py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#2a3a5a] transition-colors flex items-center"
                                                disabled={isSaving}
                                            >
                                                {isSaving ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                                        Đang cập nhật...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Lock className="h-5 w-5 mr-2" />
                                                        Đổi mật khẩu
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-[50px]">
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
