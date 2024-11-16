import PropTypes from "prop-types"; // Import PropTypes

const EmptyCard = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-20">
      <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
        {message}
      </p>
    </div>
  );
};

// Add prop types validation
EmptyCard.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
};

// Define default props
EmptyCard.defaultProps = {
  imgSrc: "", // Default empty string if no image source provided
  message: "Không có nội dung có sẵn", // Default message if no message is provided
};

export default EmptyCard;