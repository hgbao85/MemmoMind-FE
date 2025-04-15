import PropTypes from "prop-types";
// import { IoMdLogOut } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { FaUserCircle, FaRegCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../../services/api";
import { toast } from "react-toastify";
// import { openPopup } from "../../redux/user/paymentSlice";


const ProfileInfo = ({ onLogout }) => {
  // const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const initialUserCheck = useRef(false);
  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    if (!initialUserCheck.current) {
      initialUserCheck.current = true;
      if (!currentUser) {
        navigate("/");
      } else {
        getUserInfo();
        // getAllNotes();
        // getTrashedNotes();
        // setAddEditType("add");
        // setIsManuallyClosed(false);
      }
    }
  }, [currentUser, navigate]);

  const getUserInfo = async () => {
    try {
      const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Không thể lấy thông tin người dùng!");
        return;
      }

      setUserInfo(res.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Lỗi khi lấy thông tin người dùng!");
    }
  };

  return (

    <div className="flex items-center gap-2">

      {/* <button
        onClick={() => dispatch(openPopup())}
        className="flex items-center justify-center gap-1 w-24 h-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
      >
        💰 Nạp tiền
      </button> */}

      {/* Nút Feedback */}
      {/* <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSeZ1Mi2hHs5R0w5BLYHj8JcPZxWNzJPoentatCOlQitua58tw/viewform"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1 w-24 h-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
      >
        <FaRegCommentDots className="text-sm" /> Phản hồi
      </a> */}


      {/* Avatar người dùng */}
      <div className="flex">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium">
          <FaUserCircle className="text-2xl text-slate-950" />
        </div>

        <div className="text-l mb-6 text-center">
          Chào bạn, {userInfo?.name}!
          {/* {userInfo?.role === "freeVersion" ? (
          <p className="text-sm font-semibold text-gray-600">
            Bạn đang ở phiên bản miễn phí
          </p>
        ) : (
          <p className="text-sm font-semibold text-gray-600">
            Bạn đang ở phiên bản trả phí
          </p>
        )} */}

        </div>
      </div>



      {/* Nút Logout */}
      {/* <button
        className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-300 flex items-center justify-center"
        onClick={onLogout}
        title="Đăng xuất"
      >
        <IoMdLogOut className="text-xl text-black" />
      </button> */}
    </div>
  );
};

// Add prop types validation
ProfileInfo.propTypes = {
  // onLogout: PropTypes.func.isRequired,
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    // role: PropTypes.oneOf(['freeVersion', 'costVersion'])
  }).isRequired,
};

export default ProfileInfo;
