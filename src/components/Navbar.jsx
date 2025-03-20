import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import SearchBar from "./SearchBar/SearchBar";
import ProfileInfo from "./Cards/ProfileInfo";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import logo from "../assets/images/logomoi4m.png";
import {
  signInSuccess,
  signoutFailure,
  signoutStart,
} from "../redux/user/userSlice";
import api from "../services/api";

const Navbar = ({ userInfo = { name: "Guest", totalCost: 0, totalPurchasedCost: 0, freeCost: 0, totalFreeCost: 0, role: "freeVersion" }, onSearchNote, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState(0); // Thanh phần trăm tổng chi phí đã sử dụng

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Cập nhật progress mỗi khi userInfo.totalCost thay đổi, dựa trên role
  useEffect(() => {
    if (userInfo.role === "freeVersion") {
      if (userInfo.totalFreeCost !== 0 && userInfo.freeCost !== undefined) {
        const percentage = (userInfo.freeCost / userInfo.totalFreeCost) * 100;
        setProgress(Math.min(percentage, 100)); // Giới hạn tối đa 100%
      }
    } else if (userInfo.role === "costVersion") {
      if (userInfo.totalPurchasedCost !== 0 && userInfo.totalCost !== undefined) {
        const percentage = (userInfo.totalCost / userInfo.totalPurchasedCost) * 100;
        setProgress(Math.min(percentage, 100)); // Giới hạn tối đa 100%
      }
    }
  }, [userInfo]);

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  const onLogout = async () => {
    try {
      dispatch(signoutStart());

<<<<<<< HEAD
      const res = await api.post(`https://memmomind-be-ycwv.onrender.com/api/auth/logout`, {
=======
      const res = await api.post(`https://memmomind-be-ycwv.onrender.com/api/auth/logout`, {
>>>>>>> 66c938e7505dbaf93988691dd7eedbeb8ac1d7f2
        withCredentials: true,
      });

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }

      dispatch(signInSuccess());
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="bg-[#E9E6E6] flex flex-col items-center px-6 py-2 drop-shadow">
      <div className="flex items-center justify-between w-full">
        <Link to={"/homepage"}>
          <img src={logo} alt="Logo" className="h-15 w-24" />
        </Link>

        <SearchBar
          value={searchQuery}
          onChange={({ target }) => setSearchQuery(target.value)}
          handleSearch={handleSearch}
          onClearSearch={onClearSearch}
        />

        {/* Thanh tiến trình hiển thị mức sử dụng chi phí */}
        <div className="w-1/4 mr-10">
          <p className="text-sm text-center text-gray-600">Chi phí bạn đã sử dụng AI</p>
          <div className="w-full bg-gray-300 rounded-full h-6 shadow-lg relative overflow-hidden border border-gray-400">
            {/* Hiệu ứng thanh progress */}
            <div
              className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Hiển thị số phần trăm */}
            <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-white drop-shadow-md animate-fade-in">
              {progress.toFixed(2)}%
            </div>
          </div>
        </div>
        {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
      </div>
    </div>
  );
};

// Add prop types validation
Navbar.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    totalCost: PropTypes.number.isRequired, // Thêm prop totalCost
    totalPurchasedCost: PropTypes.number.isRequired, // Thêm prop totalPurchasedCost
    freeCost: PropTypes.number.isRequired, // Thêm prop freeCost
    totalFreeCost: PropTypes.number.isRequired, // Thêm prop totalFreeCost
    role: PropTypes.string.isRequired, // Thêm prop role
  }).isRequired,
  onSearchNote: PropTypes.func.isRequired,
  handleClearSearch: PropTypes.func.isRequired,
};

export default Navbar;
