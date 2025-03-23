import { useState } from "react"; // Thêm useEffect
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useDispatch } from "react-redux";
import { signInFailure, signInStart, signInSuccess } from "../../redux/user/userSlice";
import { toast } from "react-toastify";
import logo from './../../assets/images/logomoi4m.png';
import { loginUser } from "../../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const handleContactSupport = () => {
  //   window.open("https://www.facebook.com/MemmoMind", "_blank");
  // };

  const handleEmailSupport = () => {
    window.open("https://mail.google.com/mail/?view=cm&fs=1&to=memmomind.io@gmail.com&su=Yêu cầu xác thực tài khoản&body=Xin chào MemmoMind,%0D%0A%0D%0ATôi đang gặp vấn đề với việc xác thực tài khoản.%0D%0A%0D%0AEmail đăng ký của tôi là: " + email + "%0D%0A%0D%0AVui lòng hỗ trợ tôi xác thực tài khoản để có thể sử dụng dịch vụ.%0D%0A%0D%0AXin cảm ơn!", "_blank");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Vui lòng nhập địa chỉ email hợp lệ");
      return;
    }
    if (!password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }
    setError("");
    dispatch(signInStart());
    try {
      const data = await loginUser(email, password);
      if (data?.token) {
        localStorage.setItem("token", data.token);
      } else {
        console.warn("❌ Không nhận được token từ server!");
      }

      if (data?.user?.isVerified === false) {
        setShowVerificationPopup(true);
        dispatch(signInFailure("Tài khoản chưa được xác thực"));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/homepage");
    } catch (errorMessage) {
      toast.error("Tài khoản hoặc mật khẩu không đúng!");
      dispatch(signInFailure(errorMessage));
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-customGray">
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4 text-red-600 text-center">Tài khoản chưa xác thực</h2>
            <p className="mb-4">
              Tài khoản của bạn chưa được xác thực. Hãy gửi email tự động để được hỗ trợ nhanh nhất nhé!.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleEmailSupport}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z" />
                </svg>
                Gửi Email hỗ trợ
              </button>
              {/* <button
                onClick={handleContactSupport}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 16 16">
                  <path d="M16 8c0-4.4-4-8-8-8S0 3.6 0 8c0 3.9 2.9 7.1 6.7 7.8V10H4.6V8h2.2V6.2c0-2.1 1.2-3.2 3.2-3.2 .9 0 1.8.2 1.8.2v2h-1c-1 0-1.3.6-1.3 1.2V8h2.3l-.4 2h-2v5.8C13.1 15.1 16 11.9 16 8Z" />
                </svg>
                Liên hệ Fanpage
              </button> */}
              <button
                onClick={() => setShowVerificationPopup(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="text-center mt-10 mb-10">
        <img src={logo} alt="MemmoMind Logo" className="w-96" />
      </div>
      <div className="flex items-center justify-center">
        <div className="w-96 rounded-2xl bg-customRedGray px-7 py-10 shadow-lg">
          <form onSubmit={handleLogin}>
            <h4 className="text-xl mb-5 text-left">Đăng nhập</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box p-3 w-full flex items-center rounded-full mb-3"
              style={{ backgroundColor: '#D9D9D9', color: 'black' }}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm pb-1">{error}</p>}
            <button type="submit" className="w-full py-2 mb-4 bg-bgsubmit text-white rounded-full hover:bg-gray-500">
              Đăng nhập
            </button>
            <p className="text-sm text-center mt-2">
              Bạn chưa đăng ký?{" "}
              <Link
                to={"/signup"}
                className="font-medium text-[#000000] underline"
              >
                Đăng ký ngay!!
              </Link>
            </p>
            <p className="text-sm text-center mt-2">
              <Link
                to={"/forgot-password"}
                className="font-medium text-[#000000] underline"
              >
                Quên mật khẩu?
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;