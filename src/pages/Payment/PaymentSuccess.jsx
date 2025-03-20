import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../services/api";
import logo from './../../assets/images/logomoi4m.png';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");
    const amount = searchParams.get("amount");

    const userData = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const parsedUser = userData.user ? JSON.parse(userData.user) : null;
    const userId = parsedUser?.currentUser?.user?._id;

    useEffect(() => {
        const updateTotalPurchasedCost = async () => {
            if (!orderCode || !userId || !amount) return;

            const purchasedCost = Number(amount) / 25000;

            try {
                const res = await api.post(
                    "/user/update-total-purchased-cost",
                    { userId, purchasedCost, orderCode },
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
    }, [orderCode, userId, amount]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-customGray">
            <div className="text-center mt-10 mb-10">
                <img src={logo} alt="MemmoMind Logo" className="w-96" />
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl rounded-2xl bg-customRedGray px-10 py-6 shadow-lg">
                    <div className="text-center">
                        <div className="text-green-500 text-4xl animate-pulse">✔</div>
                        <h2 className="text-3xl font-bold text-green-600 mt-4 animate-pulse">Thanh toán thành công!</h2>
                        <p className="text-gray-600 mt-2 text-lg">Giao dịch của bạn đã hoàn tất.</p>
                        <div className="bg-gray-100 p-4 rounded-lg mt-4 text-gray-700">
                            <p><strong>Mã giao dịch:</strong> {orderCode}</p>
                            <p><strong>Số tiền đã thanh toán:</strong> {amount} VNĐ</p>
                        </div>
                    </div>
                    <a href="/homepage"
                        className="w-48 md:w-56 py-3 mt-6 bg-bgsubmit text-white rounded-full hover:bg-gray-500 text-center transition-all block mx-auto shadow-md">
                        Quay về trang chủ
                    </a>

                </div>
            </div>

        </div>
    );
};

export default PaymentSuccess;