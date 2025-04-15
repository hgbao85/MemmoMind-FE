"use client"

import { useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import api from "../../services/api"
import logo from "./../../assets/images/logomoi4m.png"
import { CheckCircle, Home } from "lucide-react"

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams()
    const orderCode = searchParams.get("orderCode")
    const amount = searchParams.get("amount")

    const userData = JSON.parse(localStorage.getItem("persist:root") || "{}")
    const parsedUser = userData.user ? JSON.parse(userData.user) : null
    const userId = parsedUser?.currentUser?.user?._id

    useEffect(() => {
        const updateTotalPurchasedCost = async () => {
            if (!orderCode || !userId || !amount) return

            const purchasedCost = Number(amount) / 25000

            try {
                const res = await api.post(
                    "/user/update-total-purchased-cost",
                    { userId, purchasedCost, orderCode },
                    { withCredentials: true },
                )

                if (res.data.success) {
                    console.log("Cập nhật totalPurchasedCost thành công!")
                } else {
                    console.error("Lỗi khi cập nhật totalPurchasedCost:", res.data.message)
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error)
            }
        }

        updateTotalPurchasedCost()
    }, [orderCode, userId, amount])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f5ff]">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-center mb-6">
                    <div className="flex items-center">
                        <img src={logo || "/placeholder.svg"} alt="NotePlus Logo" className="h-10" />
                    </div>
                </div>

                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán thành công!</h2>
                    <p className="text-gray-600 mb-6">Giao dịch của bạn đã hoàn tất.</p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">Mã giao dịch::</span>
                            <span className="font-medium">{orderCode}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600">Số tiền đã thanh toán:</span>
                            <span className="font-medium">{amount} VND</span>
                        </div>
                    </div>

                    <Link
                        to="/homepage"
                        className="inline-flex items-center justify-center w-full py-3 bg-[#1e2a4a] text-white rounded-lg hover:bg-[#2a3a5a] transition-colors"
                    >
                        <Home className="mr-2 h-5 w-5" />
                        Quay về Trang chủ
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess
