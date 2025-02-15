import { MdDelete, MdOutlinePushPin, MdRestore } from "react-icons/md";
import moment from "moment";
import PropTypes from "prop-types";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  isDeleted,
  onPinNote,
  onEdit,
  onDelete,
  onRestore,
  onPermanentlyDelete,
}) => {
  const handleOpenNote = () => {
    if (!isDeleted) {
      onEdit();
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa ghi chú này không?"
    );
    if (confirmDelete) {
      onDelete();
    }
  };

  const handleRestoreClick = (e) => {
    e.stopPropagation();
    onRestore();
  };

  const handlePermanentlyDeleteClick = (e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa vĩnh viễn ghi chú này không? Hành động này không thể hoàn tác!"
    );
    if (confirmDelete) {
      onPermanentlyDelete();
    }
  };

  return (
    <div
      className="border-black rounded p-4 bg-[#A9A9A9] hover:shadow-xl transition-all ease-in-out mb-1 cursor-pointer"
      onClick={handleOpenNote}
    >
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{title}</h6>
          <span className="text-xs text-black">
            {moment(date).format("DD/MM/YYYY")}
          </span>
        </div>

        {/* Nếu ghi chú đã bị xóa, hiển thị nút Khôi phục & Xóa vĩnh viễn */}
        {isDeleted ? (
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <MdRestore
              className="icon-btn hover:text-green-500"
              onClick={handleRestoreClick}
            />
            <MdDelete
              className="icon-btn hover:text-red-500"
              onClick={handlePermanentlyDeleteClick}
            />
          </div>
        ) : (
          // Nếu không bị xóa, hiển thị nút Pinned & Delete
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <MdOutlinePushPin
              className={`hover:text-[#C8BBBB] icon-btn ${isPinned ? "text-black" : "text-slate-300"}`}
              onClick={onPinNote}
            />
            <MdDelete
              className="icon-btn hover:text-[#C8BBBB]"
              onClick={handleDeleteClick}
            />
          </div>
        )}
      </div>

      <p className="text-xs text-slate-600 mt-2">{content.slice(0, 60)}</p>

      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">
          {tags.map((item) => `#${item} `)}
        </div>
      </div>
    </div>
  );
};

// Add prop types validation
NoteCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  isPinned: PropTypes.bool.isRequired,
  isDeleted: PropTypes.bool,
  onPinNote: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onPermanentlyDelete: PropTypes.func,
};

// Define default props
NoteCard.defaultProps = {
  content: "",
  tags: [],
  isDeleted: false,
};

export default NoteCard;
