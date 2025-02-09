import { useState } from "react";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import { useDispatch } from "react-redux";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../../redux/user/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import logo from './../../assets/images/logomoi4m.png';

axios.defaults.withCredentials = true;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

    try {
      dispatch(signInStart());

      const res = await axios.post(
        "http://localhost:3000/api/auth/signin",
        { email, password },
        { withCredentials: true }
      );

      if (res.data.success === false) {
        toast.error(res.data.message);
        console.log(res.data);
        dispatch(signInFailure(res.data.message));
      }

      toast.success(res.data.message);
      dispatch(signInSuccess(res.data));
      navigate("/homepage");
    } catch (error) {
      toast.error(error.message);
      dispatch(signInFailure(error.message));
    }
  };

  const handleForgotPassword = () => {
    // Navigate to Forgot Password page or implement your logic
    navigate("/forgot-password");
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-customGray">
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
              <span className="cursor-pointer text-gray-600 hover:text-gray -500" onClick={handleForgotPassword}>
                Quên mật khẩu?
              </span>
            </p>

            <p className="text-sm text-center mt-4">
              Bạn chưa đăng ký?{" "}
              <Link
                to={"/signup"}
                className="font-medium text-[#000000] underline"
              >
                Đăng ký ngay!!
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
