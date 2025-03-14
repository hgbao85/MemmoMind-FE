import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resetPassword } from "../../services/api";
import { toast } from "react-toastify";
import logo from './../../assets/images/logomoi4m.png';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Mã xác thực không hợp lệ!");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setError("Vui lòng nhập mật khẩu mới!");
      return;
    }
    setError("");
    try {
      await resetPassword(token, newPassword);
      toast.success("Mật khẩu đã được khôi phục!");
      navigate("/login"); // Sau khi thành công, chuyển về trang đăng nhập
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
          <form onSubmit={handleResetPassword}>
            <h4 className="text-xl mb-5 text-left">Đặt lại mật khẩu</h4>
            <input
              type="password"
              placeholder="Mật khẩu mới"
              className="input-box p-3 w-full flex items-center rounded-full mb-3"
              style={{ backgroundColor: '#D9D9D9', color: 'black' }}
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
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

export default ResetPassword;
