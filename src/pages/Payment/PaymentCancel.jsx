"use client"

import { useSearchParams, Link } from "react-router-dom"
import logo from "./../../assets/images/logomoi4m.png"
import { XCircle, Home } from "lucide-react"

const PaymentCancel = () => {
    const [searchParams] = useSearchParams()
    const orderCode = searchParams.get("orderCode")
    const status = searchParams.get("status")
    const cancel = searchParams.get("cancel")

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
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Thanh toán bị hủy</h2>
                    <p className="text-gray-600 mb-6">Giao dịch của bạn đã bị hủy thành công.</p>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">Mã giao dịch:</span>
                            <span className="font-medium">{orderCode}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-200">
                            <span className="text-gray-600">Trạng thái:</span>
                            <span className="font-medium">{status}</span>
                        </div>
                        {cancel === "true" && (
                            <div className="py-2 text-gray-500 text-sm text-center">Bạn đã hủy giao dịch..</div>
                        )}
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

export default PaymentCancel
