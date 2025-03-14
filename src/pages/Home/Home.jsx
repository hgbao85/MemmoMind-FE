/* eslint-disable no-unused-vars */
import { useEffect, useState, useRef } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import {
  MdClose,
  MdAdd,
  MdOutlineMenu,
  MdFavorite,
  MdDelete,
  MdHome,
  MdArrowBack,
  MdArrowForward,
  MdOutlineFileUpload,
  MdOpenInNew,
  MdFileDownload,
  MdRefresh
} from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
// import EmptyCard from "../../components/EmptyCard/EmptyCard";
import api from "../../services/api";
import axios from "axios";
import "./flashcard.css";
import { marked } from "marked";

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
  const [powerpointPreview, setPowerpointPreview] = useState("");
  const [pptxFilename, setPptxFilename] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAllNotes, setShowAllNotes] = useState(true);
  const [imageSrc, setImageSrc] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const topic =
    flashcard.length > 0 && currentIndex < flashcard.length
      ? Object.keys(flashcard[currentIndex])[0]
      : "";
  const content =
    flashcard.length > 0 && currentIndex < flashcard.length
      ? flashcard[currentIndex][topic]
      : null;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const [multipleChoice, setMultipleChoice] = useState([]);
  const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const currentQuestionData =
    multipleChoice.length > 0 && currentChoiceIndex < multipleChoice.length
      ? multipleChoice[currentChoiceIndex]
      : null;

  const topicMulchoice = currentQuestionData
    ? Object.keys(currentQuestionData)[0]
    : "Không có dữ liệu";

  const contentMulchoice = currentQuestionData
    ? currentQuestionData[topicMulchoice]
    : null;
  const [shuffledAnswers, setShuffledAnswers] = useState([]);

  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    action: "",
  });

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

  useEffect(() => {
    if (contentMulchoice) {
      const correctAnswer = contentMulchoice?.Answer?.[0] || "";
      const wrongAnswers = contentMulchoice?.["Wrong Answer"] || [];

      setShuffledAnswers(shuffleAnswers(correctAnswer, wrongAnswers));
    }
  }, [contentMulchoice]);

  const shuffleAnswers = (correctAnswer, wrongAnswers) => {
    let options = [...wrongAnswers.slice(0, 3), correctAnswer]; // Chỉ lấy tối đa 3 câu sai
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]]; // Hoán đổi vị trí
    }
    return options;
  };
  // Hàm lấy thông tin User hiện tại
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

      fetchedNotes = fetchedNotes.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setAllNotes(fetchedNotes);
      setPinnedNotes(fetchedNotes.filter((note) => note.isPinned));
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast.error("Lỗi khi tải danh sách ghi chú!");
    }
  };

  const handleAddNote = (note = { title: "", content: "" }) => {
    setIsManuallyClosed(false);
    setNoteData(note);
    setAddEditType("add");
  };

  const handleShowAllNotes = () => {
    setShowAllNotes(true);
    setShowPinned(false);
    setShowDeleted(false);
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await api.put(
        `https://memmomindbe-test-jgcl.onrender.com/api/note/update-note-pinned/${noteId}`,
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

  const handleShowNote = (note) => {
    setNoteData(note);
    setAddEditType("view");
    setIsManuallyClosed(false);
    setFormKey((prev) => prev + 1);
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
      if (
        !res.data.notes ||
        (res.data.notes.length === 0 && filteredNotes.length === 0)
      ) {
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
        `https://memmomindbe-test-jgcl.onrender.com/api/note/trash/${noteId}`,
        {},
        { withCredentials: true }
      );

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      toast.success(res.data.message);
      getAllNotes(); // Cập nhật danh sách notes
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
        `https://memmomindbe-test-jgcl.onrender.com/api/note/delete-restore/${noteId}?actionType=restore`,
        { withCredentials: true }
      );

      console.log("Restore Response:", res.data);

      if (
        !res.data ||
        res.data.message !== "Operation performed successfully"
      ) {
        toast.error(res.data.message || "Lỗi khi khôi phục ghi chú!");
        return;
      }

      toast.success("Khôi phục note thành công!");
      getTrashedNotes();
      getAllNotes();
    } catch (error) {
      console.error("Error restoring note:", error);
      toast.error(
        error.response?.data?.message || "Lỗi khi khôi phục ghi chú!"
      );
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
        `https://memmomindbe-test-jgcl.onrender.com/api/note/delete-restore/${noteId}?actionType=delete`,
        { withCredentials: true }
      );

      console.log("Delete Response:", res.data);

      if (
        !res.data ||
        res.data.message !== "Operation performed successfully"
      ) {
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

  // Hiển thị ghi chú ghim
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

    // Validate file size (< 30MB)
    const maxSize = 30 * 1024 * 1024; // 30MB in bytes
    if (file.size > maxSize) {
      toast.error("Kích thước file vượt quá 30MB!");
      return;
    }

    const reader = new FileReader();
    setUploadedFile(file); // Lưu file để gửi API

    if (file.type === "text/plain") {
      reader.onload = (e) => {
        let content = e.target.result;

        // Loại bỏ các ký tự xuống dòng
        content = content.replace(/\r?\n/g, "");

        // Log số ký tự
        console.log(
          `Số ký tự trong file (không bao gồm xuống dòng): ${content.length}`
        );

        // Validate text length (< 40000 characters)
        if (content.length > 40000) {
          toast.error("Nội dung văn bản vượt quá 40000 ký tự!");
          return;
        }
        setFileContent(content);
        setCharCount(content.length);
      };
      reader.readAsText(file);
    } else if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setPdfUrl(null);
    } else if (file.type === "application/pdf") {
      const pdfUrl = URL.createObjectURL(file);
      setPdfUrl(pdfUrl);
      setImageSrc(null);
    } else {
      alert("Chỉ hỗ trợ các định dạng file: .txt, .pdf, .jpg, .png");
    }
  };

  const handleChange = (e) => {
    const content = e.target.value;
    setFileContent(content);
    setCharCount(content.length);
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
    setIsTransitioning(true); // Ẩn flashcard trước khi chuyển
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcard.length);
      setIsFlipped(false); // Reset trạng thái lật
      setIsTransitioning(false); // Hiển thị flashcard sau khi cập nhật
    }, 100);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + flashcard.length) % flashcard.length
      );
      setIsFlipped(false);
      setIsTransitioning(false);
    }, 100);
  };

  const handleNextmulchoice = () => {
    setCurrentChoiceIndex((prevIndex) =>
      prevIndex < multipleChoice.length - 1 ? prevIndex + 1 : 0
    );
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };

  const handlePrevmulchoice = () => {
    setCurrentChoiceIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : multipleChoice.length - 1
    );
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
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

    setLoadingState({ isLoading: true, action: "summarize" });
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

      const response = await axios.post(
        "http://vietserver.ddns.net:6082/summarize",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSummary(response.data.response || "Không thể tạo tóm tắt.");
    } catch (error) {
      console.error("Error summarizing:", error.message);
      toast.error("Có lỗi xảy ra khi tóm tắt!");
    } finally {
      setLoadingState({ isLoading: false, action: "" });
    }
  };

  const handleGenerateMindmap = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error(
        "Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo mindmap!"
      );
      return;
    }

    setLoadingState({ isLoading: true, action: "mindmap" });
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

      const response = await axios.post(
        "http://vietserver.ddns.net:6082/mindmap",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMindmapHtml(response.data);
    } catch (error) {
      console.error("Error generating mindmap:", error);
      toast.error("Có lỗi xảy ra khi tạo mindmap!");
    } finally {
      setLoadingState({ isLoading: false, action: "" });
    }
  };

  const handleGenerateFlashCard = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error(
        "Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo flashcard!"
      );
      return;
    }

    setLoadingState({ isLoading: true, action: "flashcard" });
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

      const response = await axios.post(
        "http://vietserver.ddns.net:6082/flashcard",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
      setLoadingState({ isLoading: false, action: "" });
    }
  };

  const handleGenerateSolve = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error(
        "Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo solve!"
      );
      return;
    }

    setLoadingState({ isLoading: true, action: "solve" });
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

      const response = await axios.post(
        "http://vietserver.ddns.net:6082/ommi-solver",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSolve(response.data.response || "Không thể giải bài tập.");
    } catch (error) {
      console.error("Error solving:", error.message);
      toast.error("Có lỗi xảy ra khi giải bài tập!");
    } finally {
      setLoadingState({ isLoading: false, action: "" });
    }
  };

  const handleGeneratePowerpoint = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error(
        "Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo PowerPoint!"
      );
      return;
    }

    setLoadingState({ isLoading: true, action: "powerpoint" });
    try {
      let payload = { userId: currentUser.user._id, text: fileContent };

      if (uploadedFile) {
        const base64String = await convertFileToBase64(uploadedFile);
        payload.file = base64String;
        payload.fileType = uploadedFile.type;
        payload.fileName = uploadedFile.name;
      }

      const response = await axios.post(
        "http://vietserver.ddns.net:6082/powpoint-create",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob", // Nhận dữ liệu file từ backend
        }
      );

      console.log("Headers response:", response.headers);

      // Lấy Content-Disposition để lấy filename
      const contentDisposition = response.headers["content-disposition"];
      let filename = "unknown.pdf"; // Default filename

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/);
        if (match) {
          filename = match[1]; // Lấy tên file từ header
        }
      }

      // Lấy đường dẫn file PowerPoint từ header
      const powpointPath =
        response.headers["powpointpath"] || response.headers["Powpointpath"];
      console.log("PowerPoint Path:", powpointPath);

      if (!powpointPath) {
        toast.error("Không tìm thấy đường dẫn PowerPoint!");
        return;
      }

      setPptxFilename(powpointPath); // Lưu đường dẫn để gửi khi tải xuống

      // Hiển thị PDF preview
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      setPowerpointPreview({
        url: pdfUrl,
        filename: filename,
      });
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo PowerPoint!");
    } finally {
      setLoadingState({ isLoading: false, action: "" });
    }
  };

  const handleDownloadPowerpoint = async () => {
    if (!pptxFilename) {
      toast.error("Không tìm thấy đường dẫn PowerPoint!");
      return;
    }

    try {
      const response = await axios.post(
        "http://vietserver.ddns.net:6082/powpoint-download",
        { powpointPath: pptxFilename },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      // Lưu file PowerPoint xuống máy người dùng
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "presentation.pptx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error("Lỗi khi tải xuống PowerPoint!");
    }
  };

  const handleGenerateMultipleChoice = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error(
        "Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo câu hỏi trắc nghiệm!"
      );
      return;
    }

    setLoadingState({ isLoading: true, action: "multiplechoice" });
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

      const response = await axios.post(
        "http://vietserver.ddns.net:6082/mul-choices",
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("API Response:", response.data); // Add this to inspect the response

      if (Array.isArray(response.data) && response.data.length > 0) {
        setMultipleChoice(response.data);
        setCurrentChoiceIndex(0); // start with the first question
      } else {
        toast.error("Dữ liệu MultipleChoice không hợp lệ!");
        setMultipleChoice([]);
      }
    } catch (error) {
      console.error("Error generating multiple choice:", error);
      toast.error("Có lỗi xảy ra khi tạo câu hỏi trắc nghiệm!");
    } finally {
      setLoadingState({ isLoading: false, action: "" });
    }
  };

  const [userAnswers, setUserAnswers] = useState({});

  const handleAnswerClick = (selectedAnswer, correctIndex) => {
    if (userAnswers[currentChoiceIndex] !== undefined) return; // Chỉ chọn 1 lần

    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentChoiceIndex]: selectedAnswer,
    }));

    setIsAnswerCorrect(selectedAnswer === shuffledAnswers[correctIndex]);
  };

  const resetAllAnswers = () => {
    setCurrentChoiceIndex(0);
    setUserAnswers({});
    setSelectedAnswer(null);
    setIsAnswerCorrect(null);
  };


  const saveMultipleChoiceAsHTML = () => {
    if (!multipleChoice || multipleChoice.length === 0) {
      toast.error("Không có câu hỏi trắc nghiệm để lưu!");
      return;
    }

    const questions = JSON.stringify(multipleChoice);

    let multipleChoiceHTML = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Câu hỏi trắc nghiệm</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  background: #f4f4f4;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }
              .quiz-container {
                  background: white;
                  padding: 20px;
                  border-radius: 10px;
                  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                  width: 500px;
                  text-align: center;
              }
              h2 {
                  font-size: 22px;
                  font-weight: bold;
              }
              h3 {
                  font-size: 18px;
                  margin-top: 15px;
              }
              #topic {
                  font-size: 16px;
                  font-weight: bold;
                  color: #007BFF;
                  margin-bottom: 10px;
                  text-transform: uppercase;
              }
              .options button {
                  display: block;
                  width: 100%;
                  padding: 10px;
                  margin: 5px 0;
                  border: none;
                  background: #ececec;
                  cursor: pointer;
                  border-radius: 5px;
                  text-align: left;
                  font-size: 16px;
                  transition: 0.3s;
              }
              .options button:hover {
                  background: #ddd;
              }
              .options button.correct {
                  background: #28a745;
                  color: white;
              }
              .options button.incorrect {
                  background: #dc3545;
                  color: white;
              }
              .navigation {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 15px;
              }
              .navigation button {
                  background: #007BFF;
                  color: white;
                  padding: 10px 15px;
                  border: none;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 16px;
              }
              .reset-btn {
                  background: #dc3545;
                  margin-top: 10px;
                  color: white;
                  border: none;
                  padding: 8px;
                  border-radius: 5px;
                  cursor: pointer;
                  font-size: 14px;
              }
              #resultMessage {
                  margin-top: 10px;
                  font-weight: bold;
                  font-size: 16px;
                  padding: 10px;
                  border-radius: 5px;
                  display: inline-block;
              }
              .correct-msg {
                  color: black;
              }
              .incorrect-msg {
                  color: black;
              }
          </style>
      </head>
      <body>
          <div class="quiz-container">
              <h2>Câu hỏi trắc nghiệm</h2>
              <h3 id="topic"></h3>
              <h3 id="question"></h3>
              <div class="options" id="options"></div>
              <p id="resultMessage"></p>
              <div class="navigation">
                  <button onclick="prevQuestion()">&#9664; Trước</button>
                  <span id="counter"></span>
                  <button onclick="nextQuestion()">Tiếp &#9654;</button>
              </div>
              <button class="reset-btn" onclick="resetQuiz()">Thử lại toàn bộ câu hỏi</button>
          </div>
          
          <script>
              let questions = ${questions};
              let currentQuestionIndex = 0;
              let userAnswers = {}; // Lưu nội dung đáp án người dùng chọn

              function loadQuestion() {
                  let questionData = questions[currentQuestionIndex];
                  let topic = Object.keys(questionData)[0];
                  let content = questionData[topic];
                  let correctAnswer = content.Answer[0];
                  let wrongAnswers = content["Wrong Answer"] || [];

                  // Đảm bảo danh sách đáp án hiển thị theo thứ tự gốc
                  let answers = [...wrongAnswers.slice(0, 3), correctAnswer];

                  let labels = ["A", "B", "C", "D"];
                  let correctIndex = answers.indexOf(correctAnswer);

                  document.getElementById("topic").innerText = topic.toUpperCase();
                  document.getElementById("question").innerText = content.Question[0];

                  document.getElementById("options").innerHTML = answers.map((answer, index) => 
                      \`<button onclick="checkAnswer(this, '\${answer}', '\${correctAnswer}')"
                          id="btn-\${index}">\${labels[index]}. \${answer}
                      </button>\`
                  ).join("");

                  document.getElementById("counter").innerText = (currentQuestionIndex + 1) + " / " + questions.length;
                  document.getElementById("resultMessage").innerText = "";
                  document.getElementById("resultMessage").className = "";

                  // Nếu người dùng đã trả lời trước đó, giữ lại trạng thái theo nội dung
                  if (userAnswers[currentQuestionIndex] !== undefined) {
                      let selectedAnswer = userAnswers[currentQuestionIndex];
                      let buttons = document.querySelectorAll(".options button");
                      buttons.forEach(btn => btn.disabled = true);

                      buttons.forEach((btn) => {
                          if (btn.innerText.includes(selectedAnswer)) {
                              if (selectedAnswer === correctAnswer) {
                                  btn.classList.add("correct");
                                  document.getElementById("resultMessage").innerText = "✅ Đáp án đúng!";
                                  document.getElementById("resultMessage").classList.add("correct-msg");
                              } else {
                                  btn.classList.add("incorrect");
                                  buttons.forEach(b => {
                                      if (b.innerText.includes(correctAnswer)) {
                                          b.classList.add("correct");
                                      }
                                  });
                                  document.getElementById("resultMessage").innerText = "❌ Đáp án đúng là: " + correctAnswer;
                                  document.getElementById("resultMessage").classList.add("incorrect-msg");
                              }
                          }
                      });
                  }
              }

              function checkAnswer(button, selectedAnswer, correctAnswer) {
                  let buttons = document.querySelectorAll(".options button");
                  if (userAnswers[currentQuestionIndex] !== undefined) return; // Chỉ chọn 1 lần

                  userAnswers[currentQuestionIndex] = selectedAnswer;
                  buttons.forEach(btn => btn.disabled = true);

                  if (selectedAnswer === correctAnswer) {
                      button.classList.add("correct");
                      document.getElementById("resultMessage").innerText = "✅ Đáp án đúng!";
                      document.getElementById("resultMessage").classList.add("correct-msg");
                  } else {
                      button.classList.add("incorrect");
                      buttons.forEach(b => {
                          if (b.innerText.includes(correctAnswer)) {
                              b.classList.add("correct");
                          }
                      });
                      document.getElementById("resultMessage").innerText = "❌ Đáp án đúng là: " + correctAnswer;
                      document.getElementById("resultMessage").classList.add("incorrect-msg");
                  }
              }

              function nextQuestion() {
                  currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
                  loadQuestion();
              }

              function prevQuestion() {
                  currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
                  loadQuestion();
              }

              function resetQuiz() {
                  currentQuestionIndex = 0;
                  userAnswers = {};
                  loadQuestion();
              }
              
              loadQuestion();
          </script>
      </body>
      </html>
    `;

    const blob = new Blob([multipleChoiceHTML], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "multiple_choice.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };



  return (
    <>
      {userInfo ? (
        <Navbar
          userInfo={userInfo}
          onSearchNote={onSearchNote}
          handleClearSearch={handleClearSearch}
        />
      ) : (
        <p>Loading...</p>
      )}

      <div className="flex h-screen" style={{ overflow: "hidden" }}>
        {/* Left Sidebar */}
        <aside
          className={`transition-all duration-300 ${isSidebarOpen ? "w-1/5" : "w-16"
            } h-full bg-gray-100 p-4 relative shadow-md`}
          style={{ backgroundColor: "#C8BBBB" }}
        >
          <div className="flex justify-between items-center">
            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleShowAllNotes}
                title="Tất cả ghi chú"
              >
                <MdHome
                  className={`text-[24px] ${showAllNotes ? "text-white" : "text-black hover:text-white"
                    }`}
                />
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
                  className={`text-[24px] ${showPinned ? "text-red-500" : "text-black hover:text-white"
                    }`}
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
                  className={`text-[24px] ${showDeleted
                    ? "text-blue-500"
                    : "text-black hover:text-white"
                    }`}
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
                    Oops! Không tìm thấy ghi chú nào phù hợp với tìm kiếm của
                    bạn.
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
                      onShow={() => handleShowNote(note)}
                      onRestore={() => restoreNote(note._id)}
                      onPermanentlyDelete={() =>
                        permanentlyDeleteNote(note._id)
                      }
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
          className={`flex-1 p-5 overflow-y-auto h-full transition-all duration-300 ${isSidebarOpen ? "ml-0" : "ml-16"
            }`}
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
                setFormKey((prev) => prev + 1);
              }}
              noteData={noteData}
              type={addEditType}
              getAllNotes={getAllNotes}
            />
          )}

          {summary && (
            <div className="relative mt-4 p-2 border rounded-md bg-gray-200">
              <button
                onClick={() => setSummary(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                aria-label="Close Summary"
              >
                <MdClose className="text-xl" />
              </button>
              <h2 className="text-lg font-bold text-gray-800 mb-3">Tóm tắt</h2>
              <div
                className="prose"
                dangerouslySetInnerHTML={{
                  __html: marked(summary),
                }}
              />
              <button
                onClick={() =>
                  handleAddNote({ title: "Tóm tắt mới", content: summary })
                }
                className="mt-2 px-2 py-0.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center shadow-sm text-xs ml-auto"
              >
                <MdAdd className="inline-block mr-1 text-sm" />
                Thêm vào ghi chú mới
              </button>
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

                <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
                  Sơ đồ tư duy
                </h2>

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
                    <MdFileDownload className="inline-block mr-1 text-base" />
                    Tải xuống
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

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  Thẻ ghi nhớ
                </h2>

                <div className="flashcard-container w-full max-w-2xl">
                  <div
                    className={`flashcard ${isFlipped ? "flipped" : ""} ${isTransitioning ? "hidden" : ""
                      }`}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className="front">
                      <h3 className="text-lg font-semibold uppercase tracking-wide text-center">
                        {topic}
                      </h3>
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
                    <MdFileDownload className="inline-block mr-1 text-base" />
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
                  className="break-words markdown-content"
                  dangerouslySetInnerHTML={{
                    __html: marked(solve || "", {
                      breaks: true,
                      gfm: true,
                      sanitize: true,
                    }),
                  }}
                />
              </div>
              <button
                onClick={() =>
                  handleAddNote({ title: "Giải pháp mới", content: solve })
                }
                className="mt-2 px-2 py-0.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center shadow-sm text-xs ml-auto"
              >
                <MdAdd className="inline-block mr-1 text-sm" />
                Thêm vào ghi chú mới
              </button>
            </div>
          )}
          {powerpointPreview && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-60 p-6 z-50 animate-fade-in">
              <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8">
                {/* Nút đóng */}
                <button
                  onClick={() => {
                    URL.revokeObjectURL(powerpointPreview.url);
                    setPowerpointPreview("");
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-transform transform hover:scale-110"
                  aria-label="Đóng"
                >
                  <MdClose className="text-2xl" />
                </button>

                {/* Tiêu đề */}
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      Tạo PowerPoint thành công! 🎉
                    </h2>
                    <p className="text-gray-600 mt-1">
                      File PowerPoint đã sẵn sàng để tải xuống
                    </p>
                  </div>

                  {/* Hiển thị PDF */}
                  <div className="relative border border-gray-300 rounded-lg overflow-hidden shadow-md bg-gray-50">
                    <iframe
                      src={`${powerpointPreview.url}#toolbar=0`}
                      title="PDF Preview"
                      className="w-full h-[500px] border-none rounded-md"
                    />
                  </div>

                  {/* Nút tải xuống */}
                  <button
                    onClick={handleDownloadPowerpoint}
                    className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                  >
                    <MdFileDownload className="text-2xl" />
                    <span className="text-lg font-semibold">
                      Tải xuống
                    </span>
                  </button>

                  <p className="mt-3 text-sm text-gray-500">
                    Nhấn vào nút trên để tải về file PowerPoint của bạn 📂
                  </p>
                </div>
              </div>
            </div>
          )}

          {multipleChoice && multipleChoice.length > currentChoiceIndex && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
              style={{ zIndex: 1000 }}
            >
              <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
                <button
                  onClick={() => setMultipleChoice([])}
                  className="absolute top-3 right-3 text-gray-600 hover:text-black"
                  aria-label="Close MultipleChoice"
                >
                  <MdClose className="text-2xl" />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  Câu hỏi trắc nghiệm
                </h2>
                <h3 className="text-lg font-semibold uppercase tracking-wide text-center">
                  {topicMulchoice}
                </h3>
                <div className="question text-xl font-bold text-gray-800 mt-4 text-center">
                  {contentMulchoice?.Question?.[0] || "Không có dữ liệu"}
                </div>

                {(() => {
                  const correctAnswer = contentMulchoice?.Answer?.[0];
                  const labels = ["A", "B", "C", "D"];
                  const correctIndex = shuffledAnswers.indexOf(correctAnswer);

                  return (
                    <div className="answers mt-4">
                      {shuffledAnswers.map((answer, index) => (
                        <button
                          key={index}
                          disabled={userAnswers[currentChoiceIndex] !== undefined} // Chỉ được chọn 1 lần
                          className={`block w-full text-left px-4 py-2 mt-2 rounded-md border
                  ${userAnswers[currentChoiceIndex] === answer
                              ? userAnswers[currentChoiceIndex] === correctAnswer
                                ? "bg-green-500 text-white border-green-700" // Chọn đúng -> xanh đậm
                                : "bg-red-500 text-white border-red-700" // Chọn sai -> đỏ
                              : userAnswers[currentChoiceIndex] !== undefined &&
                                index === correctIndex
                                ? "bg-green-500 text-white border-green-700" // Đáp án đúng -> xanh đậm
                                : userAnswers[currentChoiceIndex] !== undefined
                                  ? "bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed" // Các nút còn lại -> xám nhạt
                                  : "bg-gray-200 hover:bg-gray-300 border-gray-400"
                            }`}
                          onClick={() => handleAnswerClick(answer, correctIndex)}
                        >
                          {labels[index]}. {answer}
                        </button>
                      ))}
                    </div>
                  );
                })()}

                {userAnswers[currentChoiceIndex] !== undefined && (
                  <div className="mt-4">
                    {userAnswers[currentChoiceIndex] === contentMulchoice?.Answer?.[0] ? (
                      <span className="text-green-600 font-bold">✅ Chính xác!</span>
                    ) : (
                      <span className="text-red-600 font-bold">
                        ❌ Đáp án đúng là: {["A", "B", "C", "D"][shuffledAnswers.indexOf(contentMulchoice?.Answer?.[0])]}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex justify-between items-center w-full max-w-md mt-4">
                  <button onClick={handlePrevmulchoice} className="btn-arrow">
                    <MdArrowBack className="text-3xl" />
                  </button>
                  <p className="text-lg font-semibold text-gray-700">
                    {currentChoiceIndex + 1} / {multipleChoice.length}
                  </p>
                  <button onClick={handleNextmulchoice} className="btn-arrow">
                    <MdArrowForward className="text-3xl" />
                  </button>
                </div>

                <div className="w-full flex justify-between mt-3">
                  <button
                    onClick={resetAllAnswers}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center shadow-sm text-sm"
                  >
                    <MdRefresh className="inline-block mr-1 text-base" />
                    Thử lại toàn bộ câu hỏi
                  </button>
                  <button
                    onClick={saveMultipleChoiceAsHTML}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center shadow-sm text-sm"
                  >
                    <MdFileDownload className="inline-block mr-1 text-base" />
                    Tải xuống
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside
          className={`transition-all duration-300 ${isRightSidebarOpen ? "w-1/5" : "w-16"
            } h-full bg-[#C8BBBB] p-4 relative shadow-md`}
          style={{
            position: "absolute",
            right: 0,
            maxHeight: "100vh",
            overflowY: "auto",
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
              <h2 className="text-l mb-6 text-center">
                Chào bạn, {userInfo?.name}!
              </h2>
              <div className="max-w-lg mx-auto p-4 mb-2 border rounded-md">
                <textarea
                  className="w-full h-24 p-2 border rounded-md mb-2"
                  placeholder="Nhập văn bản hoặc tải lên tài liệu (.txt, .pdf, .jpg, .png) có sẵn."
                  value={fileContent}
                  onChange={handleChange}
                  style={{
                    maxHeight: "500px",
                    minHeight: "150px",
                    resize: "vertical",
                  }}
                  maxLength={40000}
                ></textarea>
                <div className="text-right">
                  {charCount}/{40000}
                </div>
                <div className="flex justify-between items-center w-full">
                  <label className="cursor-pointer text-[13px] bg-blue-500 text-white px-2 py-2 mb-3 mt-3 rounded-lg hover:bg-blue-600 transition flex items-center gap-1">
                    <MdOutlineFileUpload className="text-lg" />
                    Chọn tệp
                    <input
                      type="file"
                      accept=".txt,.pdf,image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center space-x-3 ml-auto">
                    {pdfUrl && (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer text-[13px] bg-blue-500 text-white px-2 py-2 ml-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
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
                        className="cursor-pointer text-[13px] bg-blue-500 text-white ml-2 px-2 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
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
                        <MdClose className="text-md" />
                      </button>
                    )}
                  </div>
                </div>
                {imageSrc && (
                  <img
                    src={imageSrc}
                    alt="Uploaded"
                    className="w-1/2 h-auto my-4 border rounded-md"
                  />
                )}
                {pdfUrl && (
                  <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    className="w-full mt-4 h-auto border rounded-md shadow-lg"
                  />
                )}
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <button
                  className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${loadingState.isLoading &&
                    loadingState.action === "summarize"
                    ? "opacity-75 cursor-wait"
                    : ""
                    }`}
                  onClick={handleSummarize}
                  disabled={loadingState.isLoading}
                  title="Tạo tóm tắt"
                >
                  {loadingState.isLoading &&
                    loadingState.action === "summarize" ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-2 w-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading</span>
                    </div>
                  ) : (
                    "Tóm Tắt"
                  )}
                </button>

                <button
                  className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${loadingState.isLoading && loadingState.action === "mindmap"
                    ? "opacity-75 cursor-wait"
                    : ""
                    }`}
                  onClick={handleGenerateMindmap}
                  disabled={loadingState.isLoading}
                  title="Tạo sơ đồ tư duy"
                >
                  {loadingState.isLoading &&
                    loadingState.action === "mindmap" ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-2 w-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading</span>
                    </div>
                  ) : (
                    "Mindmap"
                  )}
                </button>

                <button
                  className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${loadingState.isLoading &&
                    loadingState.action === "flashcard"
                    ? "opacity-75 cursor-wait"
                    : ""
                    }`}
                  onClick={handleGenerateFlashCard}
                  disabled={loadingState.isLoading}
                  title="Tạo thẻ ghi nhớ"
                >
                  {loadingState.isLoading &&
                    loadingState.action === "flashcard" ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-2 w-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading</span>
                    </div>
                  ) : (
                    "FlashCards"
                  )}
                </button>
              </div>
              <div className="flex justify-between gap-2 pt-2">
                <button
                  className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${loadingState.isLoading && loadingState.action === "solve"
                    ? "opacity-75 cursor-wait"
                    : ""
                    }`}
                  onClick={handleGenerateSolve}
                  disabled={loadingState.isLoading}
                  title="Hỗ trợ làm bài"
                >
                  {loadingState.isLoading && loadingState.action === "solve" ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-2 w-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading</span>
                    </div>
                  ) : (
                    "Hỗ trợ làm bài"
                  )}
                </button>

                <button
                  className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${loadingState.isLoading &&
                    loadingState.action === "powerpoint"
                    ? "opacity-75 cursor-wait"
                    : ""
                    }`}
                  onClick={handleGeneratePowerpoint}
                  disabled={loadingState.isLoading}
                  title="Tạo PowerPoint"
                >
                  {loadingState.isLoading &&
                    loadingState.action === "powerpoint" ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-2 w-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading</span>
                    </div>
                  ) : (
                    "PowerPoint"
                  )}
                </button>

                <button
                  className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${loadingState.isLoading && loadingState.action === "multiplechoice"
                    ? "opacity-75 cursor-wait"
                    : ""
                    }`}
                  onClick={handleGenerateMultipleChoice}
                  disabled={loadingState.isLoading}
                  title="Tạo câu hỏi trắc nghiệm"
                >
                  {loadingState.isLoading && loadingState.action === "multiplechoice" ? (
                    <div className="flex items-center space-x-2">
                      <svg
                        className="animate-spin h-2 w-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Loading</span>
                    </div>
                  ) : (
                    "MultipleChoice"
                  )}
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
