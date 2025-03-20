import PropTypes from "prop-types";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle, FaRegCommentDots } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { openPopup } from "../../redux/user/paymentSlice";

const ProfileInfo = ({ onLogout }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-3">

      <button
        onClick={() => dispatch(openPopup())}
        className="flex items-center justify-center gap-1 w-24 h-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
      >
        💰 Nạp tiền
      </button>

      {/* Nút Feedback */}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeZ1Mi2hHs5R0w5BLYHj8JcPZxWNzJPoentatCOlQitua58tw/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1 w-24 h-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
      >
        <FaRegCommentDots className="text-sm" /> Phản hồi
      </a>

      {/* Avatar người dùng */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium">
        <FaUserCircle className="text-2xl text-slate-950" />
      </div>

      {/* Nút Logout */}
      <button
        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-300 flex items-center justify-center"
        onClick={onLogout}
        title="Đăng xuất"
      >
        <IoMdLogOut className="text-xl text-black" />
      </button>
    </div>
  );
};

// Add prop types validation
ProfileInfo.propTypes = {
  onLogout: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileInfo;
