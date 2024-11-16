import PropTypes from "prop-types";
import { IoMdLogOut } from "react-icons/io";
import { FaUserCircle } from "react-icons/fa";
const ProfileInfo = ({ onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium">
        <FaUserCircle className="text-2xl text-slate-950" />
      </div>
      <button
        className="text-sm bg- p-1 rounded-md text-white hover:opacity-80 flex items-center justify-center"
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
