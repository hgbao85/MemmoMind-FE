import { useState } from "react";
import { toast } from "react-toastify";
import { forgotPassword } from "../../services/api";
import { useNavigate } from "react-router-dom";
import logo from './../../assets/images/logomoi4m.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Vui lòng nhập email!");
            return;
        }
        setError("");
        try {
            // Gọi API để yêu cầu gửi email
            await forgotPassword(email);
            toast.success("Kiểm tra mail để xác thực tài khoản");
            navigate("/login"); // Chuyển hướng về trang login sau khi yêu cầu khôi phục mật khẩu
        } catch (errorMessage) {
            toast.error(errorMessage);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-customGray">
            <div className="text-center mt-10 mb-10">
                <img src={logo} alt="MemmoMind Logo" className="w-96" />
            </div>
            <div className="flex items-center justify-center">
                <div className="w-96 rounded-2xl bg-customRedGray px-7 py-10">
                    <form onSubmit={handleForgotPassword}>
                        <h4 className="text-xl mb-5 text-left">Quên mật khẩu</h4>
                        <input
                            type="text"
                            placeholder="Vui lòng nhập email"
                            className="input-box p-3 w-full flex items-center rounded-full mb-3"
                            style={{ backgroundColor: '#D9D9D9', color: 'black' }}
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />
                        {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
                        <button
                            type="submit"
                            className="w-full py-2 mb-4 bg-bgsubmit text-white rounded-full hover:bg-gray-500"
                        >
                            Xác nhận
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
