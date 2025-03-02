import { useEffect, useState, useRef } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdClose, MdAdd, MdOutlineMenu, MdFavorite, MdDelete, MdHome, MdArrowBack, MdArrowForward, MdSave, MdOutlineFileUpload, MdOpenInNew } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
// import EmptyCard from "../../components/EmptyCard/EmptyCard";
import api from "../../services/api";
import axios from "axios";
import "./flashcard.css";
import { marked } from 'marked';

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const initialUserCheck = useRef(false);
  const [formKey, setFormKey] = useState(0);

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [pinnedNotes, setPinnedNotes] = useState([]);
  const [deletedNotes, setDeletedNotes] = useState([]);
  const [showPinned, setShowPinned] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [addEditType, setAddEditType] = useState("add");
  const [noteData, setNoteData] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [mindmapHtml, setMindmapHtml] = useState("");
  const [summary, setSummary] = useState("");
  const [flashcard, setFlashCard] = useState("");
  const [solve, setSolve] = useState("");
  const [showAllNotes, setShowAllNotes] = useState(true);
  // const [selectedNote, setSelectedNote] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const topic = flashcard.length > 0 && currentIndex < flashcard.length ? Object.keys(flashcard[currentIndex])[0] : "";
  const content = flashcard.length > 0 && currentIndex < flashcard.length ? flashcard[currentIndex][topic] : null;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();

  //State loading
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingMindmap, setIsGeneratingMindmap] = useState(false);
  const [isGeneratingFlashcard, setIsGeneratingFlashcard] = useState(false);
  const [isSolving, setIsSolving] = useState(false);

  useEffect(() => {
    if (!initialUserCheck.current) {
      initialUserCheck.current = true;
      if (!currentUser) {
        navigate("/");
      } else {
        getUserInfo();
        getAllNotes();
        getTrashedNotes();
        setAddEditType("add");
        setIsManuallyClosed(false);
      }
    }
  }, [currentUser, navigate]);

  // 📌 Hàm lấy thông tin User hiện tại
  const getUserInfo = async () => {
    try {
      const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Không thể lấy thông tin người dùng!");
        return;
      }

      console.log("User Info:", res.data.user);
      setUserInfo(res.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Lỗi khi lấy thông tin người dùng!");
    }
  };

  // 📝 Lấy tất cả ghi chú
  const getAllNotes = async () => {
    try {
      const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/note/all", {
        withCredentials: true,
      });

      if (!res.data.success) return;

      let fetchedNotes = res.data.notes.filter((note) => !note.isDeleted);

      fetchedNotes = fetchedNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setAllNotes(fetchedNotes);
      setPinnedNotes(fetchedNotes.filter((note) => note.isPinned));
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Lỗi khi tải danh sách ghi chú!");
    }
  };

  // const handleSelectNote = (note) => {
  //   setSelectedNote(note);
  // };

  const handleAddNote = (note) => {
    setIsManuallyClosed(false);
    setNoteData(note);
    setAddEditType("add");
  };

  const handleShowAllNotes = () => {
    setShowAllNotes(true);
    setShowPinned(false);
    setShowDeleted(false);
  };

  // 📌 Lấy danh sách ghi chú đã ghim (isPinned=true)
  // const getPinnedNotes = async () => {
  //   try {
  //     const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/all?isPinned=true`, {
  //       withCredentials: true
  //     });

  //     if (!res.data.notes) return;

  //     const filteredNotes = res.data.notes.filter((note) => !note.isDeleted);
  //     setPinnedNotes(filteredNotes);
  //   } catch (error) {
  //     console.error("Error fetching pinned notes:", error);
  //     toast.error("Lỗi khi tải danh sách ghi chú đã ghim!");
  //   }
  // };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await api.put(
        `https://memmomind-be-ycwv.onrender.com/api/note/update-note-pinned/${noteId}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setAllNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === noteId ? { ...note, isPinned: !note.isPinned } : note
        )
      );

      setPinnedNotes((prevPinned) =>
        !noteData.isPinned
          ? [...prevPinned, { ...noteData, isPinned: true }]
          : prevPinned.filter((note) => note._id !== noteId)
      );

    } catch (error) {
      toast.error(error.message);
    }
  };

  // 🗑 Lấy danh sách ghi chú trong thùng rác (isDeleted=true)
  const getTrashedNotes = async () => {
    try {
      const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/all?isDeleted=true`, { withCredentials: true });
      if (!res.data.notes) return;
      setDeletedNotes(res.data.notes);
    } catch (error) {
      console.error("Error fetching deleted notes:", error);
      toast.error("Lỗi khi tải danh sách ghi chú đã xóa!");
    }
  };


  const handleEdit = (note) => {
    setIsManuallyClosed(false);
    setNoteData(note);
    setAddEditType("edit");
  };

  const onSearchNote = async (query) => {
    try {
      if (!query.trim()) {
        toast.error("Vui lòng nhập từ khóa tìm kiếm!");
        return;
      }

      const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/search`, {
        params: { keyword: query },
        withCredentials: true,
      });

      console.log("Search Response:", res.data);

      const filteredNotes = res.data.notes.filter((note) => !note.isDeleted);
      if (!res.data.notes || res.data.notes.length === 0 && filteredNotes.length === 0) {
        toast.info("Không tìm thấy ghi chú nào!");
        setIsSearch(false);
        return;
      }
      setIsSearch(true);
      setAllNotes(filteredNotes);
    } catch (error) {
      console.error("Error searching notes:", error);
      toast.error(error.response?.data?.message || "Lỗi khi tìm kiếm!");
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Di chuyển ghi chú vào thùng rác
  const moveToTrash = async (noteId) => {
    try {
      const res = await api.put(
        `https://memmomind-be-ycwv.onrender.com/api/note/trash/${noteId}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes();
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Khôi phục ghi chú từ thùng rác
  const restoreNote = async (noteId) => {
    try {
      if (!noteId) {
        toast.error("ID ghi chú không hợp lệ!");
        return;
      }

      const res = await api.delete(
        `https://memmomind-be-ycwv.onrender.com/api/note/delete-restore/${noteId}?actionType=restore`,
        { withCredentials: true }
      );

      console.log("Restore Response:", res.data);

      if (!res.data || res.data.message !== "Operation performed successfully") {
        toast.error(res.data.message || "Lỗi khi khôi phục ghi chú!");
        return;
      }

      toast.success("Khôi phục note thành công!")
      getTrashedNotes();
      getAllNotes();
    } catch (error) {
      console.error("Error restoring note:", error);
      toast.error(error.response?.data?.message || "Lỗi khi khôi phục ghi chú!");
    }
  };


  // Xóa ghi chú vĩnh viễn từ thùng rác
  const permanentlyDeleteNote = async (noteId) => {
    try {
      if (!noteId) {
        toast.error("ID ghi chú không hợp lệ!");
        return;
      }

      const res = await api.delete(
        `https://memmomind-be-ycwv.onrender.com/api/note/delete-restore/${noteId}?actionType=delete`,
        { withCredentials: true }
      );

      console.log("Delete Response:", res.data);

      if (!res.data || res.data.message !== "Operation performed successfully") {
        toast.error(res.data.message || "Lỗi khi xóa ghi chú!");
        return;
      }

      toast.success("Xóa ghi chú vĩnh viễn thành công!");
      getTrashedNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error(error.response?.data?.message || "Lỗi khi xóa ghi chú!");
    }
  };


  const handleAddNoteSuccess = () => {
    getAllNotes();
  };

  const rightSidebarWidth = isRightSidebarOpen ? "20%" : "4rem";

  // 📌 Hiển thị ghi chú ghim
  const handleShowPinned = () => {
    setShowAllNotes(false);
    setShowPinned(!showPinned);
    setShowDeleted(false);
  };

  // 🗑 Hiển thị ghi chú trong thùng rác
  const handleShowDeleted = () => {
    setShowDeleted(!showDeleted);
    setShowPinned(false);

    if (!showDeleted) {
      getTrashedNotes();
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    setUploadedFile(file); // Lưu file để gửi API
  
    // Reset các trạng thái liên quan đến các loại file khác
    setFileContent(null); // Đặt nội dung textarea về null
    setImageSrc(null);    // Đặt hình ảnh về null
    setPdfUrl(null);      // Đặt PDF về null
  
    if (file.type === "text/plain") {
      // Nếu là file .txt, đọc nội dung và cập nhật vào textarea
      reader.onload = (e) => setFileContent(e.target.result);
      reader.readAsText(file);
    } else if (file.type.startsWith("image/")) {
      // Nếu là ảnh, tạo URL cho ảnh và đặt imageSrc
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
    } else if (file.type === "application/pdf") {
      // Nếu là PDF, tạo URL cho PDF và đặt pdfUrl
      const pdfUrl = URL.createObjectURL(file);
      setPdfUrl(pdfUrl);
    } else {
      // Hiển thị thông báo nếu định dạng file không được hỗ trợ
      alert("Chỉ hỗ trợ các định dạng file: .txt, .pdf, .jpg, .png");
    }
  };

  // Chuyển file thành base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Lấy phần Base64
      reader.onerror = (error) => reject(error);
    });
  };

  const handleNext = () => {
    setIsTransitioning(true);  // Ẩn flashcard trước khi chuyển
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcard.length);
      setIsFlipped(false); // Reset trạng thái lật
      setIsTransitioning(false); // Hiển thị flashcard sau khi cập nhật
    }, 100);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + flashcard.length) % flashcard.length);
      setIsFlipped(false);
      setIsTransitioning(false);
    }, 100);
  };

  const handleRemoveFile = () => {
    setPdfUrl(null);
    setImageSrc(null);
  };

  const saveMindmapAsHTML = () => {
    if (!mindmapHtml) {
      toast.error("Không có Mindmap để lưu!");
      return;
    }

    const blob = new Blob([mindmapHtml], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "mindmap.html";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const saveFlashcardAsHTML = () => {
    let flashcardHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Flashcards</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            background-color: #f8f9fa;
          }
          h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
          }

          .flashcard-wrapper {
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
            border: 2px solid #d1d5db;
            width: 90%;
            max-width: 650px;
            text-align: center;
          }

          .flashcard-container {
            width: 100%;
            max-width: 600px;
            height: 300px;
            perspective: 1000px;
            position: relative;
            margin: auto;
          }

          .flashcard {
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s ease-in-out;
            cursor: pointer;
            position: relative;
            border-radius: 12px;
          }

          .flipped {
            transform: rotateY(180deg);
          }

          .front, .back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
            font-size: 18px;
            font-weight: bold;
          }

          .front {
            background: #cfe2ff;
            color: #0d47a1;
          }

          .back {
            background: #ffd6a5;
            transform: rotateY(180deg);
            color: #5d4037;
          }

          .navigation {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            gap: 30px;
          }

          .btn {
            background: none;
            border: none;
            font-size: 28px;
            cursor: pointer;
            transition: transform 0.2s ease-in-out;
          }

          .btn:hover {
            transform: scale(1.2);
          }

          #counter {
            font-size: 18px;
            font-weight: bold;
            color: #333;
          }
        </style>
      </head>
      <body>
        <h1>Thẻ ghi nhớ</h1>
        <div class="flashcard-wrapper">
          <div class="flashcard-container">
            <div class="flashcard" id="flashcard">
              <div class="front" id="flashcard-front"></div>
              <div class="back" id="flashcard-back"></div>
            </div>
          </div>
          <div class="navigation">
            <button class="btn" onclick="prevCard()">⬅</button>
            <span id="counter">1 / ${flashcard.length}</span>
            <button class="btn" onclick="nextCard()">➡</button>
          </div>
        </div>

        <script>
          let flashcards = ${JSON.stringify(flashcard)};
          let currentIndex = 0;
          let isFlipped = false;

          function updateFlashcard() {
            let card = flashcards[currentIndex];
            let topic = Object.keys(card)[0];
            let content = card[topic];
            document.getElementById("flashcard-front").innerHTML = "<h3 style='margin-bottom: 10px; text-transform: uppercase; font-size: 16px; font-weight: bold;'>" + topic + "</h3><p style='font-size: 20px; font-weight: 600;'>" + (content.Question?.[0] || "Không có dữ liệu") + "</p>";
            document.getElementById("flashcard-back").innerHTML = "<p style='font-size: 20px; font-weight: 600;'>" + (content.Answer?.[0] || "Không có dữ liệu") + "</p>";
            document.getElementById("counter").innerText = (currentIndex + 1) + " / " + flashcards.length;
            document.getElementById("flashcard").classList.remove("flipped");
            isFlipped = false;
          }

          document.getElementById("flashcard").addEventListener("click", () => {
            isFlipped = !isFlipped;
            document.getElementById("flashcard").classList.toggle("flipped");
          });

          function nextCard() {
            currentIndex = (currentIndex + 1) % flashcards.length;
            updateFlashcard();
          }

          function prevCard() {
            currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
            updateFlashcard();
          }

          updateFlashcard();
        </script>
      </body>
      </html>
    `;

    const blob = new Blob([flashcardHTML], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "flashcard.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSummarize = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tóm tắt!");
      return;
    }

    setIsSummarizing(true);
    try {
      let payload = { userId: currentUser.user._id };

      if (uploadedFile) {
        if (uploadedFile.type === "text/plain") {
          const text = await uploadedFile.text();
          payload.text = text;
        } else {
          const base64String = await convertFileToBase64(uploadedFile);
          payload.file = base64String;
          payload.fileType = uploadedFile.type;
          payload.fileName = uploadedFile.name;
        }
      } else {
        payload.text = fileContent;
      }

      const response = await axios.post("http://vietserver.ddns.net:6082/summarize", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSummary(response.data.response || "Không thể tạo tóm tắt.");
    } catch (error) {
      console.error("Error summarizing:", error.message);
      toast.error("Có lỗi xảy ra khi tóm tắt!");
    } finally {
      setIsSummarizing(false);
    }
  };


  const handleGenerateMindmap = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo mindmap!");
      return;
    }

    setIsGeneratingMindmap(true);
    try {
      let payload = { userId: currentUser.user._id };

      if (uploadedFile) {
        if (uploadedFile.type === "text/plain") {
          const text = await uploadedFile.text();
          payload.text = text;
        } else {
          const base64String = await convertFileToBase64(uploadedFile);
          payload.file = base64String;
          payload.fileType = uploadedFile.type;
          payload.fileName = uploadedFile.name;
        }
      } else {
        payload.text = fileContent;
      }

      const response = await axios.post("http://vietserver.ddns.net:6082/mindmap", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setMindmapHtml(response.data);
    } catch (error) {
      console.error("Error generating mindmap:", error);
      toast.error("Có lỗi xảy ra khi tạo mindmap!");
    } finally {
      setIsGeneratingMindmap(false);
    }
  };

  const handleGenerateFlashCard = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo flashcard!");
      return;
    }

    setIsGeneratingFlashcard(true);
    try {
      let payload = { userId: currentUser.user._id };

      if (uploadedFile) {
        if (uploadedFile.type === "text/plain") {
          const text = await uploadedFile.text();
          payload.text = text;
        } else {
          const base64String = await convertFileToBase64(uploadedFile);
          payload.file = base64String;
          payload.fileType = uploadedFile.type;
          payload.fileName = uploadedFile.name;
        }
      } else {
        payload.text = fileContent;
      }

      const response = await axios.post("http://vietserver.ddns.net:6082/flashcard", payload, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Flashcard Data:", response.data);
      if (Array.isArray(response.data) && response.data.length > 0) {
        setFlashCard(response.data);
        setCurrentIndex(0);
      } else {
        toast.error("Dữ liệu flashcard không hợp lệ!");
        setFlashCard([]);
      }
    } catch (error) {
      console.error("Error generating flashcard:", error);
      toast.error("Có lỗi xảy ra khi tạo flashcard!");
    } finally {
      setIsGeneratingFlashcard(false);
    }
  };

  const handleGenerateSolve = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo solve!");
      return;
    }

    setIsSolving(true);
    try {
      let payload = { userId: currentUser.user._id };

      if (uploadedFile) {
        if (uploadedFile.type === "text/plain") {
          const text = await uploadedFile.text();
          payload.text = text;
        } else {
          const base64String = await convertFileToBase64(uploadedFile);
          payload.file = base64String;
          payload.fileType = uploadedFile.type;
          payload.fileName = uploadedFile.name;
        }
      } else {
        payload.text = fileContent;
      }

      const response = await axios.post("http://vietserver.ddns.net:6082/ommi-solver", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSolve(response.data.response || "Không thể giải bài tập.");
    } catch (error) {
      console.error("Error solving:", error.message);
      toast.error("Có lỗi xảy ra khi giải bài tập!");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div className="flex h-screen" style={{ overflow: "hidden" }}>
        {/* Left Sidebar */}
        <aside
          className={`transition-all duration-300 ${isSidebarOpen ? "w-1/5" : "w-16"} h-full bg-gray-100 p-4 relative shadow-md`}
          style={{ backgroundColor: "#C8BBBB" }}
        >
          <div className="flex justify-between items-center">
            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleShowAllNotes}
                title="Tất cả ghi chú"
              >
                <MdHome className="text-[24px] text-black hover:text-white" />
              </button>
            )}

            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleAddNote}
                title="Tạo ghi chú"
              >
                <MdAdd className="text-[24px] text-black hover:text-white" />
              </button>
            )}


            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleShowPinned}
                title="Ghi chú được đánh dấu"
              >
                <MdFavorite
                  className={`text-[24px] ${showPinned ? "text-red-500 hover:text-red-600" : "text-black hover:text-red-600"}`}
                />
              </button>
            )}

            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleShowDeleted}
                title="Ghi chú đã xóa"
              >
                <MdDelete
                  className={`text-[24px] ${showDeleted ? "text-blue-500 hover:text-blue-600" : "text-black hover:text-blue-600"}`}
                />
              </button>
            )}

            <button
              className="w-12 h-12 flex items-center justify-center rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              title="Menu"
            >
              <MdOutlineMenu className="text-[24px] text-black hover:text-white" />
            </button>
          </div>

          {isSidebarOpen && (
            <>
              <div className="mt-4 overflow-y-auto max-h-[calc(100vh-100px)]">
                {isSearch && allNotes.length === 0 ? (
                  <p className="text-center text-gray-500 mt-4">
                    Oops! Không tìm thấy ghi chú nào phù hợp với tìm kiếm của bạn.
                  </p>
                ) : showPinned ? (
                  pinnedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      title={note.title}
                      date={note.createdAt}
                      isPinned={note.isPinned}
                      onEdit={() => handleEdit(note)}
                      onDelete={() => moveToTrash(note._id)}
                      onPinNote={() => updateIsPinned(note)}
                    />
                  ))
                ) : showDeleted ? (
                  deletedNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      title={note.title}
                      date={note.createdAt}
                      isDeleted={true}
                      onRestore={() => restoreNote(note._id)}
                      onPermanentlyDelete={() => permanentlyDeleteNote(note._id)}
                    />
                  ))
                ) : (
                  allNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      title={note.title}
                      date={note.createdAt}
                      isPinned={note.isPinned}
                      isDeleted={false}
                      onEdit={() => handleEdit(note)}
                      onDelete={() => moveToTrash(note._id)}
                      onPinNote={() => updateIsPinned(note)}
                    />
                  ))
                )}
              </div>
            </>
          )}
        </aside>

        {/* Main Content */}
        <main
          className={`flex-1 p-5 overflow-y-auto h-full transition-all duration-300 ${isSidebarOpen ? "ml-0" : "ml-16"}`}
          style={{ margin: "auto", marginRight: rightSidebarWidth }}
        >
          {!isManuallyClosed && (
            <AddEditNotes
              key={formKey}
              onClose={() => {
                setNoteData(null);
                setAddEditType("add");
                setIsManuallyClosed(true);
                handleAddNoteSuccess();
                setFormKey(prev => prev + 1);
              }}
              noteData={noteData}
              type={addEditType}
              getAllNotes={getAllNotes}
            />)}
          
          {summary && (
            <div className="relative mt-4 p-2 border rounded-md bg-gray-200">
              <button
                onClick={() => setSummary(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                aria-label="Close Summary"
              >
                <MdClose className="text-xl" />
              </button>
              <div 
                className="prose"
                dangerouslySetInnerHTML={{ 
                  __html: marked(summary)
                }}
              />
            </div>
          )}

          {mindmapHtml && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
              style={{ zIndex: 1000 }}
            >
              <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-lg p-4">
                <button
                  onClick={() => setMindmapHtml(null)}
                  className="absolute top-2 right-2 text-gray-600 hover:text-black"
                  aria-label="Close Mindmap"
                >
                  <MdClose className="text-xl" />
                </button>

                <h2 className="text-xl font-bold text-center text-gray-800 mb-3">Sơ đồ tư duy</h2>

                <iframe
                  srcDoc={mindmapHtml}
                  className="w-full h-[510px] border-none rounded-md shadow"
                  style={{
                    display: "block",
                    overflow: "hidden",
                  }}
                />

                <div className="flex justify-end mt-3">
                  <button
                    onClick={saveMindmapAsHTML}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center shadow-sm text-sm"
                  >
                    <MdSave className="inline-block mr-1 text-base" />
                    Tải Mindmap
                  </button>
                </div>
              </div>
            </div>
          )}

          {flashcard && flashcard.length > 0 && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
              style={{ zIndex: 1000 }}
            >
              <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">

                <button
                  onClick={() => setFlashCard([])}
                  className="absolute top-3 right-3 text-gray-600 hover:text-black"
                  aria-label="Close Flashcard"
                >
                  <MdClose className="text-2xl" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Thẻ ghi nhớ</h2>

                <div className="flashcard-container w-full max-w-2xl">
                  <div
                    className={`flashcard ${isFlipped ? "flipped" : ""} ${isTransitioning ? "hidden" : ""}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className="front">
                      <h3 className="text-lg font-semibold uppercase tracking-wide text-center">{topic}</h3>
                      <p className="question text-xl font-bold text-gray-800 mt-4 text-center">
                        {content?.Question?.[0] || "Không có dữ liệu"}
                      </p>
                    </div>
                    <div className="back">
                      <p className="answer text-xl font-bold text-gray-900 mt-4 text-center">
                        {content?.Answer?.[0] || "Không có dữ liệu"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center w-full max-w-md mt-4">
                  <button onClick={handlePrev} className="btn-arrow">
                    <MdArrowBack className="text-3xl" />
                  </button>
                  <p className="text-lg font-semibold text-gray-700">
                    {currentIndex + 1} / {flashcard.length}
                  </p>
                  <button onClick={handleNext} className="btn-arrow">
                    <MdArrowForward className="text-3xl" />
                  </button>
                </div>

                <div className="w-full flex justify-end mt-3">
                  <button
                    onClick={saveFlashcardAsHTML}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center shadow-sm text-sm"
                  >
                    <MdSave className="inline-block mr-1 text-base" />
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          )}

          {solve && (
            <div className="relative mt-4 p-2 border rounded-md bg-gray-200">
              <button
                onClick={() => setSolve(null)} 
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                aria-label="Close Solve"
              >
                <MdClose className="text-xl" />
              </button>
              <div className="markdown-preview">
                <h3 className="text-lg font-semibold">Giải pháp:</h3>
                <div 
                  className="break-words whitespace-pre-wrap markdown-content"
                  dangerouslySetInnerHTML={{ 
                    __html: marked(solve || '', {
                      breaks: true,
                      gfm: true,
                      sanitize: true
                    })
                  }}
                />
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside
          className={`transition-all duration-300 ${isRightSidebarOpen ? "w-1/5" : "w-16"} h-full bg-[#C8BBBB] p-4 relative shadow-md`}
          style={{
            position: "absolute",
            right: 0,
            maxHeight: "100vh",
          }}
        >
          <div className="flex justify-between items-center">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-md"
              onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
              title="Menu"
            >
              <MdOutlineMenu className="text-[24px] text-black hover:text-white" />
            </button>
          </div>

          {isRightSidebarOpen && (
            <>
              <h2 className="text-l mb-6 text-center">Chào bạn, {userInfo?.name}!</h2>
              <div className="max-w-lg mx-auto p-4 border rounded-md">
                <textarea
                  className="w-full h-24 p-2 border rounded-md mb-4"
                  placeholder="Nhập văn bản hoặc tải lên tài liệu (.txt, .pdf, .jpg, .png) có sẵn."
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  style={{ maxHeight: "500px", minHeight: "150px", resize: "vertical" }}
                ></textarea>
                <div className="flex justify-between items-center w-full">
                  <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                    <MdOutlineFileUpload className="text-lg" />
                    Chọn tệp
                    <input
                      type="file"
                      accept=".txt,.pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center space-x-4 ml-auto">
                    {pdfUrl && (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                        title="Xem PDF đã upload"
                      >
                        <MdOpenInNew className="text-lg" />
                        Xem PDF
                      </a>
                    )}

                    {imageSrc && (
                      <a
                        href={imageSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
                        title="Xem ảnh đã upload"
                      >
                        <MdOpenInNew className="text-lg" />
                        Xem ảnh
                      </a>
                    )}

                    {(pdfUrl || imageSrc) && (
                      <button
                        onClick={handleRemoveFile}
                        className="bg-red-500 cursor-pointer text-white px-2 py-2 rounded-lg transition"
                        title="Xóa tài liệu đã upload"
                      >
                        <MdClose className="text-2xl" />
                      </button>
                    )}
                  </div>
                </div>
                {imageSrc && <img src={imageSrc} alt="Uploaded" className="w-1/2 h-auto my-4 border rounded-md" />}
                {pdfUrl && <iframe src={pdfUrl} title="PDF Viewer" className="w-full mt-4 h-auto border rounded-md shadow-lg" />}


              </div>

              <div className="flex justify-between gap-2 pt-2">
                <button
                  className={`flex-1 h-12 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${isSummarizing ? 'opacity-75 cursor-wait' : ''}`}
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  title="Tạo tóm tắt"
                >
                  {isSummarizing ? (
                    <>
                      <svg className="animate-spin h-2 w-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-1">Đang xử lý...</span>
                    </>
                  ) : 'Tạo tóm tắt'}
                </button>
                
                <button
                  className={`flex-1 h-12 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${isGeneratingMindmap ? 'opacity-75 cursor-wait' : ''}`}
                  onClick={handleGenerateMindmap}
                  disabled={isGeneratingMindmap}
                  title="Tạo sơ đồ tư duy"
                >
                  {isGeneratingMindmap ? (
                    <>
                      <svg className="animate-spin h-2 w-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-1">Đang xử lý...</span>
                    </>
                  ) : 'Tạo MindMap'}
                </button>

                <button
                  className={`flex-1 h-12 text-xs font-medium text-white bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${isGeneratingFlashcard ? 'opacity-75 cursor-wait' : ''}`}
                  onClick={handleGenerateFlashCard}
                  disabled={isGeneratingFlashcard}
                  title="Tạo thẻ ghi nhớ"
                >
                  {isGeneratingFlashcard ? (
                    <>
                      <svg className="animate-spin h-2 w-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-1">Đang xử lý...</span>
                    </>
                  ) : 'Tạo FlashCards'}
                </button>

                <button
                  className={`flex-1 h-12 text-xs font-medium text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${isSolving ? 'opacity-75 cursor-wait' : ''}`}
                  onClick={handleGenerateSolve}
                  disabled={isSolving}
                  title="Giải bài tập"
                >
                  {isSolving ? (
                    <>
                      <svg className="animate-spin h-2 w-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span className="ml-1">Đang xử lý...</span>
                    </>
                  ) : 'Giải bài tập'}
                </button>

              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
};

export default Home;