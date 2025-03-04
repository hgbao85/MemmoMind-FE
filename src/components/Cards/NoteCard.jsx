import { MdDelete, MdFavorite, MdRestore } from "react-icons/md";
import moment from "moment";
import PropTypes from "prop-types";

const NoteCard = ({
  title,
  date,
  content = "",
  isPinned = false,
  isDeleted = false,
  onPinNote,
  onEdit,
  onShow,
  onDelete,
  onRestore,
  onPermanentlyDelete,
}) => {
  // Xử lý mở ghi chú
  const handleOpenNote = () => {
    if (isDeleted) {
      onShow(); // Nếu là ghi chú trong thùng rác, mở chế độ xem
    } else {
      onEdit(); // Nếu không bị xóa, mở chế độ chỉnh sửa
    }
  };

  return (
    <div
      className="border-black rounded p-4 bg-[#A9A9A9] hover:shadow-xl transition-all ease-in-out mb-1 cursor-pointer"
      onClick={handleOpenNote} // Khi click vào card, mở ghi chú
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
              onClick={(e) => {
                e.stopPropagation();
                onRestore();
              }}
            />
            <MdDelete
              className="icon-btn hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                const confirmDelete = window.confirm(
                  "Bạn có chắc chắn muốn xóa vĩnh viễn ghi chú này không? Hành động này không thể hoàn tác!"
                );
                if (confirmDelete) onPermanentlyDelete();
              }}
            />
          </div>
        ) : (
          // Nếu không bị xóa, hiển thị nút Ghim & Xóa
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <MdFavorite
              className={`hover:text-[#C8BBBB] icon-btn ${isPinned ? "text-black" : "text-slate-300"}`}
              onClick={(e) => {
                e.stopPropagation();
                onPinNote();
              }}
            />
            <MdDelete
              className="icon-btn hover:text-[#C8BBBB]"
              onClick={(e) => {
                e.stopPropagation();
                const confirmDelete = window.confirm(
                  "Bạn có chắc chắn muốn xóa ghi chú này không?"
                );
                if (confirmDelete) onDelete();
              }}
            />
          </div>
        )}
      </div>

      {/* Hiển thị nội dung */}
      <p className="text-xs text-slate-600 mt-2">{content.slice(0, 60)}</p>
    </div>
  );
};

// PropTypes validation
NoteCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string,
  isPinned: PropTypes.bool,
  isDeleted: PropTypes.bool,
  onPinNote: PropTypes.func,
  onEdit: PropTypes.func,
  onShow: PropTypes.func,
  onDelete: PropTypes.func,
  onRestore: PropTypes.func,
  onPermanentlyDelete: PropTypes.func,
};

export default NoteCard;
