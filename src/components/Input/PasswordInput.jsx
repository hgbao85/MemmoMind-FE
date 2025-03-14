import { useState } from "react";
import PropTypes from "prop-types";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div style={{ backgroundColor: '#D9D9D9', color: 'black' }} className="flex items-center bg-transparent border-[1.5px] px-5 rounded-full mb-3">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Mật khẩu"}
        className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="text-[#2B85FF] cursor-pointer"
          onClick={() => toggleShowPassword()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="text-slate-400 cursor-pointer"
          onClick={() => toggleShowPassword()}
        />
      )}
    </div>
  );
};

// Add prop types validation
PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default PasswordInput;
