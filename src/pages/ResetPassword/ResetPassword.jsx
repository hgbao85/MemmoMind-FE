import { useState, useEffect } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "./../../assets/images/logomoi4m.png";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); // Lấy token từ URL

  useEffect(() => {
    if (!token) {
      toast.error("Mã token không hợp lệ!");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        token,
        password,
      });

      toast.success(response.data.message || "Đặt lại mật khẩu thành công!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-customGray">
      <div className="text-center mt-10 mb-10">
        <img src={logo} alt="MemmoMind Logo" className="w-96" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-96 rounded-2xl bg-customRedGray px-7 py-10 shadow-lg">
          <form onSubmit={handleResetPassword}>
            <h4 className="text-xl mb-5 text-left">Khôi phục mật khẩu</h4>
            <PasswordInput
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordInput
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
            <button type="submit" className="w-full py-2 mb-4 bg-bgsubmit text-white rounded-full hover:bg-gray-500">
              Xác nhận
            </button>
            <p className="text-sm text-center mt-2">
              Bạn chưa đăng ký?{" "}
              <Link to="/signup" className="font-medium text-[#000000] underline">
                Đăng ký ngay!!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
