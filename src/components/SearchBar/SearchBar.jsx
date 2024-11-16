import PropTypes from "prop-types"; // Import PropTypes
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex justify-center w-full">
      <div className="w-60 sm:w-80 md:w-96 flex items-center px-4 bg-[#D9D9D9] rounded-md">
        <input
          type="text"
          placeholder="Tìm ghi chú..."
          className="w-full text-xs bg-transparent py-[11px] outline-none"
          value={value}
          onChange={onChange}
        />

        {value && (
          <IoMdClose
            className="text-slate-500 text-xl cursor-pointer hover:text-black mr-3"
            onClick={onClearSearch}
          />
        )}

        <FaMagnifyingGlass
          className="text-slate-500 text-xl cursor-pointer hover:text-black mr-3"
          onClick={handleSearch}
        />
      </div>
    </div>
  );
};

// Add prop types validation
SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  onClearSearch: PropTypes.func.isRequired,
};

export default SearchBar;
