import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyEmail } from "../../services/api";
import { toast } from "react-toastify";
import logo from './../../assets/images/logomoi4m.png'; // Your logo image

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("token");

    useEffect(() => {
        if (!token) {
            // Nếu không có token trong URL
            navigate("/login");
        } else {
            // Gọi API xác thực token
            verifyEmail(token)
                .then(() => {
                    toast.success("Tài khoản đã được xác thực. Bạn có thể đăng nhập.");
                    navigate("/login");
                })
                .catch(() => {
                    toast.error("Xác thực thất bại, vui lòng thử lại!");
                    navigate("/login");
                });
        }
    }, [token, navigate]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-customGray pt-[100px]">
            {/* Logo */}
            <div className="text-center mb-6">
                <img src={logo} alt="MemmoMind Logo" className="w-96" />
            </div>

            {/* Success Message */}
            <div className="text-center">
                <h2 className="text-xl font-bold text-green-500 mb-4">Xác thực thành công!</h2>
                <p className="text-lg text-gray-800 mb-6">Tài khoản của bạn đã được xác thực. Bạn có thể đăng nhập ngay.</p>

                {/* Button to go to login */}
                <button
                    onClick={() => navigate("/login")}
                    className="px-8 py-3 bg-bgsubmit text-white rounded-md text-lg hover:bg-gray-500 transition-all duration-300 shadow-lg"
                >
                    Trở về đăng nhập
                </button>
            </div>
        </div>
    );
};

export default VerifyEmail;
