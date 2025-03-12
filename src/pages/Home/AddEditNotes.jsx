import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { MdClose, MdFormatBold, MdFormatItalic, MdCode, MdLink, MdFormatListBulleted, MdFormatListNumbered, MdHorizontalRule } from "react-icons/md";
import { toast } from "react-toastify";
import api from "../../services/api";
import ReactMarkdown from "react-markdown";
import "./markdown-preview.css";

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
  const [isProcessing, setIsProcessing] = useState(false); // Thêm trạng thái xử lý
  const [viewMode, setViewMode] = useState("write");
  const textareaRef = useRef(null);


  useEffect(() => {
    setTitle(noteData?.title || "");
    setContent(noteData?.content || "");
    setTags(noteData?.tags || []);
  }, [noteData]);

  const handleFormat = (tag) => {
    let formattedText = "";
  
    switch (tag) {
      case "bold":
        formattedText = "**Nhập chữ in đậm tại đây**";
        break;
      case "italic":
        formattedText = "_Nhập chữ in nghiêng tại đây_";
        break;
      case "code":
        formattedText = "`code`";
        break;
      case "link":
        formattedText = "[Nhập tên liên kết](nhập liên kết)";
        break;
      case "unorderedList":
        formattedText = "- Item 1\n- Item 2\n- Item 3";
        break;
      case "orderedList":
        formattedText = "1. Item 1\n2. Item 2\n3. Item 3";
        break;
      case "horizontalRule":
        formattedText = "\n---\n";
        break;
      default:
        break;
    }
  
    setContent((prevContent) => `${prevContent} ${formattedText}`);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
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
    } finally {
      setIsProcessing(false); // Đặt lại trạng thái xử lý
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
    } finally {
      setIsProcessing(false); // Đặt lại trạng thái xử lý
    }
  };

  const handleAddNote = () => {
    if (isProcessing) return; // Nếu đang xử lý, không làm gì cả

    if (!title) {
      setError("Vui lòng nhập tiêu đề!");
      return;
    }

    if (!content) {
      setError("Vui lòng nhập nội dung!");
      return;
    }

    setError("");
    setIsProcessing(true); // Bắt đầu xử lý

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
      <div className="flex border-b mb-4">
        <button className={`px-4 py-2 ${viewMode === "write" ? "border-b-2 border-gray-800" : "text-gray-500"}`} onClick={() => setViewMode("write")}>
          Write
        </button>
        <button className={`px-4 py-2 ${viewMode === "preview" ? "border-b-2 border-gray-800" : "text-gray-500"}`} onClick={() => setViewMode("preview")}>
          Preview
        </button>
      </div>
      
      {viewMode === "write" ? (
        <div>
          <div className="flex gap-2 mb-2 border-b pb-2">
            <button className="p-1 border rounded hover:bg-gray-200" onClick={() => handleFormat("bold")}><MdFormatBold /></button>
            <button className="p-1 border rounded hover:bg-gray-200" onClick={() => handleFormat("italic")}><MdFormatItalic /></button>
            <button className="p-1 border rounded hover:bg-gray-200" onClick={() => handleFormat("code")}><MdCode /></button>
            <button className="p-1 border rounded hover:bg-gray-200" onClick={() => handleFormat("link")}><MdLink /></button>
            {/* button mới */}
            <button className="p-1 border rounded hover:bg-gray-200" onClick={() => handleFormat("unorderedList")}><MdFormatListBulleted /></button>
            <button className="p-1 border rounded hover:bg-gray-200" onClick={() => handleFormat("orderedList")}><MdFormatListNumbered /></button>
            <button className="p-1 border rounded hover:bg-gray-200" onClick={() => handleFormat("horizontalRule")}><MdHorizontalRule /></button>
          </div>
          <textarea
            ref={textareaRef}
            className="mt-1 p-2 border border-gray-300 rounded w-full h-64 resize-vertical focus:ring-2 focus:ring-[#C8BBBB] focus:outline-none"
            placeholder="Nhập nội dung..."
            value={content}
            onChange={({ target }) => setContent(target.value)}
            style={{ minHeight: "200px", maxHeight: "500px" }}
          />
        </div>
      ) : (
        <div className="p-2 border border-gray-300 rounded bg-gray-100 whitespace-pre-wrap mb-2 overflow-auto preview">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      )}

      {error && type !== "view" && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {/* Action Button */}
      {type !== "view" && (
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 font-semibold rounded transition-all ${isProcessing
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[#E9A5A5] hover:bg-[#C8BBBB] text-white"
              }`}
            onClick={handleAddNote}
            disabled={isProcessing}
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