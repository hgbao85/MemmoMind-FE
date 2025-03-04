import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../../services/api";

const AddEditNotes = ({
  onClose,
  noteData = { title: "", content: "", tags: [] },
  type,
  getAllNotes
}) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTitle(noteData?.title || "");
    setContent(noteData?.content || "");
    setTags(noteData?.tags || []);
  }, [noteData]);

  // Edit Note
  const editNote = async () => {
    const noteId = noteData._id;

    try {
      const res = await api.post(
        `https://memmomind-be-ycwv.onrender.com/api/note/edit/` + noteId,
        { title, content, tags },
        { withCredentials: true }
      );

      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    }
  };

  // Add Note
  const addNewNote = async () => {
    try {
      const res = await api.post(
        "https://memmomind-be-ycwv.onrender.com/api/note/add",
        { title, content, tags },
        { withCredentials: true }
      );

      if (!res.data.success) {
        setError(res.data.message);
        toast.error(res.data.message);
        return;
      }

      getAllNotes();
      onClose();
    } catch (error) {
      toast.error(error.message);
      setError(error.message);
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Vui lòng nhập tiêu đề!");
      return;
    }

    if (!content) {
      setError("Vui lòng nhập nội dung!");
      return;
    }

    setError("");

    if (type === "edit") {
      editNote();
    } else {
      addNewNote();
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md p-6 mx-auto">
      {/* Close Button */}
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        onClick={onClose}
      >
        <MdClose className="text-2xl" />
      </button>

      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {type === "edit"
          ? "Chỉnh sửa ghi chú"
          : type === "view"
            ? "Xem ghi chú"
            : "Tạo ghi chú mới"}
      </h2>

      {/* Input: Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
        {type === "view" ? (
          <p className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-[#C8BBBB] focus:outline-none">{title}</p>
        ) : (
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-[#C8BBBB] focus:outline-none"
            placeholder="Nhập tiêu đề..."
            value={title}
            onChange={({ target }) => setTitle(target.value)}
            disabled={type === "view"}
          />
        )}
      </div>

      {/* Textarea: Content */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Nội dung</label>
        {type === "view" ? (
          <p className="mt-1 p-2 border border-gray-300 rounded w-full resize-vertical focus:ring-2 focus:ring-[#C8BBBB] focus:outline-none">{content}</p>
        ) : (
          <textarea
            className="mt-1 p-2 border border-gray-300 rounded w-full h-64 resize-vertical focus:ring-2 focus:ring-[#C8BBBB] focus:outline-none"
            placeholder="Nhập nội dung..."
            value={content}
            onChange={({ target }) => setContent(target.value)}
            style={{ minHeight: "200px", maxHeight: "500px" }}
            disabled={type === "view"}
          />
        )}
      </div>

      {/* Error Message */}
      {error && type !== "view" && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Action Button */}
      {type !== "view" && (
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-[#E9A5A5] text-white font-semibold rounded hover:bg-[#C8BBBB] transition-all"
            onClick={handleAddNote}
          >
            {type === "edit" ? "Cập nhật" : "Tạo"}
          </button>
        </div>
      )}
    </div>
  );
};

// Add prop types validation
AddEditNotes.propTypes = {
  onClose: PropTypes.func.isRequired,
  noteData: PropTypes.shape({
    title: PropTypes.string,
    content: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
    _id: PropTypes.string,
  }),
  type: PropTypes.oneOf(["add", "edit", "view"]).isRequired,
  getAllNotes: PropTypes.func.isRequired,
};

export default AddEditNotes;
