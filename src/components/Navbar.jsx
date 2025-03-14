import { useState } from "react";
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

const Navbar = ({ userInfo = { name: "Guest" }, onSearchNote, handleClearSearch }) => {

  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

      const res = await api.post(`https://memmomindbe-test-jgcl.onrender.com/api/auth/logout`, {
        withCredentials: true,
      });

      if (res.data.success === false) {
        dispatch(signoutFailure(res.data.message));
        toast.error(res.data.message);
        return;
      }

      // toast.success(res.data.message);
      dispatch(signInSuccess());
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      dispatch(signoutFailure(error.message));
    }
  };

  return (
    <div className="bg-[#E9E6E6] flex items-center justify-between px-6 py-2 drop-shadow">
      <Link to={"/homepage"}>
        <img src={logo} alt="Logo" className="h-15 w-24" />
      </Link>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

// Add prop types validation
Navbar.propTypes = {
  userInfo: PropTypes.object.isRequired,
  onSearchNote: PropTypes.func.isRequired,
  handleClearSearch: PropTypes.func.isRequired,
};

export default Navbar;