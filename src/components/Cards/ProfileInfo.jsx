import PropTypes from "prop-types";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle, FaRegCommentDots } from "react-icons/fa"; // Thêm icon phản hồi

const ProfileInfo = ({ onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Nút Feedback */}
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeZ1Mi2hHs5R0w5BLYHj8JcPZxWNzJPoentatCOlQitua58tw/viewform?fbclid=IwY2xjawIgzBZleHRuA2FlbQIxMAABHdWMwuzbx4Wf_i5cjQlJ_zmW_qWmlrPHJbUV3Xc3KmOhD64nuogskM5gNA_aem_br5T0maoX6_RqwYGQwf73w"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
      >
        <FaRegCommentDots className="text-md" /> Feedback
      </a>

      {/* Avatar người dùng */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium">
        <FaUserCircle className="text-2xl text-slate-950" />
      </div>

      {/* Nút Logout */}
      <button
        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-300 flex items-center justify-center"
        onClick={onLogout}
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
    username: PropTypes.string.isRequired,
  }).isRequired,
};

export default ProfileInfo;
