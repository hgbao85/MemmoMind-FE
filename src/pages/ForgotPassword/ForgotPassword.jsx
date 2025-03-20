import { useState } from "react";
import { forgotPassword } from "../../services/api";
import { useNavigate } from "react-router-dom";
import logo from './../../assets/images/logomoi4m.png';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        if (!email) {
            setError("Vui lòng nhập email!");
            return;
        }
        setError("");
        try {
            await forgotPassword(email);
            setIsModalOpen(true);
        } catch (errorMessage) {
            setError(errorMessage);
        }
    };

    const handleVerification = () => {
        setIsModalOpen(false);
        navigate("/login");
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

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
                        <h2 className="text-xl font-bold text-gray-800">📧 Kiểm tra email của bạn!</h2>
                        <p className="text-red-500 mt-2 mb-6">
                            Vui lòng kiểm tra email để khôi phục mật khẩu. Nếu không thấy email, vui lòng kiểm tra hòm <strong>Thư rác</strong>.
                        </p>
                        <a
                            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            href="https://mail.google.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={handleVerification}>Kiểm tra email!</a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ForgotPassword;
