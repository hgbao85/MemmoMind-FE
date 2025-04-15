import PropTypes from "prop-types"; // Import PropTypes
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="bg-gray-100 rounded flex items-center p-2 mb-2">

      <FaMagnifyingGlass
        className="text-slate-500 text-xl cursor-pointer hover:text-black mr-3"
        onClick={handleSearch}
      />
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
