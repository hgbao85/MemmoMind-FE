import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import logo from './../../assets/images/logomoi4m.png';
import { registerUser } from "../../services/api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }

    if (!validateEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }

    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    setError("");

    // Gọi API đăng ký
    try {
      // eslint-disable-next-line no-unused-vars
      const data = await registerUser(name, email, password);
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
          <form onSubmit={handleSignUp}>
            <h4 className="text-xl mb-5 text-left">Đăng ký</h4>

            <input
              type="text"
              placeholder="Họ & Tên"
              className="input-box p-3 w-full flex items-center rounded-full mb-3"
              style={{ backgroundColor: '#D9D9D9', color: 'black' }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box p-3 w-full flex items-center rounded-full mb-3"
              style={{ backgroundColor: '#D9D9D9', color: 'black' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}

            <button type="submit" className="w-full py-2 mb-4 bg-bgsubmit text-white rounded-full hover:bg-gray-500">
              ĐĂNG KÝ
            </button>

            <p className="text-sm text-center mt-4">
              Bạn đã có tài khoản?{" "}
              <Link to={"/login"} className="font-medium text-[#000000] underline">
                Đăng nhập
              </Link>
            </p>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold text-gray-800">Xác thực tài khoản!</h2>
            <p className="text-red-500 mt-2 mb-6">Vui lòng kiểm tra email để xác thực tài khoản. Nếu không thấy email, vui lòng kiểm tra hòm <strong>Thư rác</strong>.</p>
            <a
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleVerification}>Xác thực tại đây!</a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
