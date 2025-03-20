import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");

    const userData = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const parsedUser = userData.user ? JSON.parse(userData.user) : null;
    const userId = parsedUser?.currentUser?.user?._id;
    console.log("Persist Root:", localStorage.getItem("persist:root"));
    console.log("Parsed User Data:", userData);
    console.log("Parsed Current User:", parsedUser);
    console.log("Extracted User ID:", userId);

    useEffect(() => {
        const updateTotalPurchasedCost = async () => {
            if (!orderCode || !userId) return;

            try {
                const res = await api.post(
                    "/user/update-total-purchased-cost",
                    { userId, purchasedCost: 0.12, orderCode },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    console.log("Cập nhật totalPurchasedCost thành công!");
                } else {
                    console.error("Lỗi khi cập nhật totalPurchasedCost:", res.data.message);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            }
        };

        updateTotalPurchasedCost();
    }, [orderCode, userId]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-green-300">
                <div className="text-green-500 text-6xl">✔</div>
                <h2 className="text-3xl font-bold text-green-600 mt-4">Thanh toán thành công!</h2>
                <p className="text-gray-600 mt-2 text-lg">Giao dịch của bạn đã hoàn tất.</p>
                <div className="bg-gray-100 p-4 rounded-lg mt-4 text-gray-700">
                    <p><strong>Mã đơn hàng:</strong> {orderCode}</p>
                </div>
                <a href="/homepage" className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition">Quay về trang chủ</a>
            </div>
        </div>
    );
};

export default PaymentSuccess;
