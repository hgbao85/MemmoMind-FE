// // import PropTypes from "prop-types";
// // import { IoMdLogOut } from "react-icons/io";
// import { useEffect, useRef, useState } from "react";
// import { FaUserCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import api from "../../services/api";
// import { toast } from "react-toastify";
// // import { openPopup } from "../../redux/user/paymentSlice";


// const ProfileInfo = () => {
//   // const dispatch = useDispatch();
//   const { currentUser } = useSelector((state) => state.user);
//   const navigate = useNavigate();
//   const initialUserCheck = useRef(false);
//   const [userInfo, setUserInfo] = useState(null);
//   useEffect(() => {
//     if (!initialUserCheck.current) {
//       initialUserCheck.current = true;
//       if (!currentUser) {
//         navigate("/");
//       } else {
//         getUserInfo();
//         // getAllNotes();
//         // getTrashedNotes();
//         // setAddEditType("add");
//         // setIsManuallyClosed(false);
//       }
//     }
//   }, [currentUser, navigate]);

//   const getUserInfo = async () => {
//     try {
//       const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
//         withCredentials: true,
//       });

//       if (!res.data.success) {
//         toast.error("Không thể lấy thông tin người dùng!");
//         return;
//       }

//       setUserInfo(res.data.user);
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       toast.error("Lỗi khi lấy thông tin người dùng!");
//     }
//   };

//   return (

//     <div className="flex items-center gap-2">

//       {/* <button
//         onClick={() => dispatch(openPopup())}
//         className="flex items-center justify-center gap-1 w-24 h-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
//       >
//         💰 Nạp tiền
//       </button> */}

//       {/* Nút Feedback */}
//       {/* <a
//         href="https://docs.google.com/forms/d/e/1FAIpQLSeZ1Mi2hHs5R0w5BLYHj8JcPZxWNzJPoentatCOlQitua58tw/viewform"
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center justify-center gap-1 w-24 h-10 bg-gradient-to-r from-blue-400 to-blue-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 transform hover:scale-105"
//       >
//         <FaRegCommentDots className="text-sm" /> Phản hồi
//       </a> */}


//       {/* Avatar người dùng */}
//       <div className="flex">
//         <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium">
//           <FaUserCircle className="text-2xl text-slate-950" />
//         </div>
//       </div>
//       <div className="text-l">
//         {userInfo?.name}
//         {/* {userInfo?.role === "freeVersion" ? (
//             <p className="text-sm font-semibold text-gray-600">
//               Bạn đang ở phiên bản miễn phí
//             </p>
//           ) : (
//             <p className="text-sm font-semibold text-gray-600">
//               Bạn đang ở phiên bản trả phí
//             </p>
//           )} */}

//       </div>



//       {/* Nút Logout */}
//       {/* <button
//         className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition duration-300 flex items-center justify-center"
//         onClick={onLogout}
//         title="Đăng xuất"
//       >
//         <IoMdLogOut className="text-xl text-black" />
//       </button> */}
//     </div>
//   );
// };

// // Add prop types validation
// ProfileInfo.propTypes = {
//   // onLogout: PropTypes.func.isRequired,
//   // userInfo: PropTypes.shape({
//   //   name: PropTypes.string,
//   //   role: PropTypes.oneOf(['freeVersion', 'costVersion'])
//   // }).isRequired,
// };

// export default ProfileInfo;


"use client"

import { useEffect, useRef, useState } from "react"
import { FaUserCircle, FaUser, FaSignOutAlt, FaChevronDown } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import api from "../../services/api"
import { toast } from "react-toastify"
import { signoutSuccess } from "../../redux/user/userSlice"

const ProfileInfo = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const initialUserCheck = useRef(false)
  const [userInfo, setUserInfo] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!initialUserCheck.current) {
      initialUserCheck.current = true
      if (!currentUser) {
        navigate("/")
      } else {
        getUserInfo()
      }
    }
  }, [currentUser, navigate])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getUserInfo = async () => {
    try {
      const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
        withCredentials: true,
      })

      if (!res.data.success) {
        toast.error("Không thể lấy thông tin người dùng!")
        return
      }

      setUserInfo(res.data.user)
    } catch (error) {
      console.error("Error fetching user info:", error)
      toast.error("Lỗi khi lấy thông tin người dùng!")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    dispatch(signoutSuccess())
    navigate("/login")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 p-4 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-300 text-white">
          {userInfo?.avatar ? (
            <img
              src={userInfo.avatar || "/placeholder.svg"}
              alt="User"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <FaUserCircle className="text-2xl" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-800">{userInfo?.name || "User"}</span>
            <FaChevronDown
              className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
            />
          </div>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="absolute right-0 left-0 mt-1 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-100">
          <div className="py-1">
            <button
              onClick={() => navigate("/profile")}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <FaUser className="mr-3 text-gray-500" />
              Trang cá nhân
            </button>
          </div>
          <div className="border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
            >
              <FaSignOutAlt className="mr-3 text-gray-500" />
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileInfo
