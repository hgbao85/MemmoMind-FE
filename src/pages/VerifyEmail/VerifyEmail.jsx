import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../../services/api";
import logo from './../../assets/images/logomoi4m.png';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    const [verificationStatus, setVerificationStatus] = useState(null);

    useEffect(() => {
        if (!token) {
            setVerificationStatus("invalid");
        } else {
            // Gọi API xác thực email
            verifyEmail(token)
                .then(() => {
                    setVerificationStatus("success");
                })
                .catch(() => {
                    setVerificationStatus("failed");
                });
        }
    }, [token]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-customGray">
            <div className="text-center mt-10 mb-10">
                <img src={logo} alt="MemmoMind Logo" className="w-96" />
            </div>
            <div className="flex items-center justify-center">
                <div className="w-96 rounded-2xl bg-customRedGray px-7 py-10 shadow-lg">
                    <div className="text-center">
                        {verificationStatus === "success" ? (
                            <>
                                <h2 className="text-xl font-bold text-black mb-4">Xác thực thành công!</h2>
                                <p className="text-lg text-gray-800 mb-6">
                                    Tài khoản của bạn đã được xác thực. Bây giờ bạn có thể đăng nhập.
                                </p>
                            </>
                        ) : verificationStatus === "failed" ? (
                            <>
                                <h2 className="text-xl font-bold text-black mb-4">Xác thực thất bại!</h2>
                                <p className="text-lg text-gray-800 mb-6">
                                    Vui lòng kiểm tra lại hoặc thử lại sau.
                                </p>
                            </>
                        ) : verificationStatus === "invalid" ? (
                            <>
                                <h2 className="text-xl font-bold text-red-500 mb-4">Liên kết không hợp lệ!</h2>
                                <p className="text-lg text-gray-800 mb-6">
                                    Vui lòng kiểm tra lại email của bạn.
                                </p>
                            </>
                        ) : (
                            <h2 className="text-xl font-bold text-black mb-4">Đang xác thực...</h2>
                        )}

                        <button
                            onClick={() => navigate("/login")}
                            className="px-8 py-3 bg-bgsubmit text-white rounded-md text-lg hover:bg-gray-500 transition-all duration-300 shadow-lg"
                        >
                            Quay lại trang Đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
