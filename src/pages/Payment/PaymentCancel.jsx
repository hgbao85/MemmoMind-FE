import { useSearchParams } from "react-router-dom";
import logo from './../../assets/images/logomoi4m.png';

const PaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const orderCode = searchParams.get("orderCode");
    const status = searchParams.get("status");
    const cancel = searchParams.get("cancel");

    return (
        <div className="flex flex-col items-center min-h-screen bg-customGray">
            <div className="text-center mt-10 mb-10">
                <img src={logo} alt="MemmoMind Logo" className="w-96" />
            </div>
            <div className="flex items-center justify-center">
                <div className="w-full max-w-4xl rounded-2xl bg-customRedGray px-10 py-6 shadow-lg">
                    <div className="text-center">
                        <div className="text-red-500 text-4xl animate-pulse">✘</div>
                        <h2 className="text-3xl font-bold text-red-600 mt-4 animate-pulse">Thanh toán bị hủy</h2>
                        <p className="text-gray-600 mt-2 text-lg">Giao dịch của bạn đã bị hủy.</p>
                        <div className="bg-gray-100 p-4 rounded-lg mt-4 text-gray-700">
                            <p><strong>Mã giao dịch:</strong> {orderCode}</p>
                            <p><strong>Trạng thái:</strong> {status}</p>
                            {cancel === "true" && <p className="text-gray-500">Bạn đã hủy giao dịch.</p>}
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

export default PaymentCancel;
