import { useSearchParams } from "react-router-dom";

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");
    const cancel = searchParams.get("cancel");

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold text-red-600">Thanh toán bị hủy</h2>
                <p className="text-gray-700 mt-2">Mã đơn hàng: <strong>{orderCode}</strong></p>
                <p className="text-gray-700">Trạng thái: <strong>{status}</strong></p>
                {cancel === "true" && <p className="text-gray-500">Bạn đã hủy giao dịch.</p>}
                <a href="/homepage" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600">Quay về trang chủ</a>
            </div>
        </div>
    );
};

export default PaymentCancel;
