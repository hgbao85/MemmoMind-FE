import { useEffect, useState, useRef } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdClose, MdAdd, MdOutlineMenu, MdFavorite, MdDelete, MdHome } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
// import EmptyCard from "../../components/EmptyCard/EmptyCard";
import api from "../../services/api";
import axios from "axios";

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
  const [showAllNotes, setShowAllNotes] = useState(true);
  // const [selectedNote, setSelectedNote] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const navigate = useNavigate();

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

      if (!res.data.notes || res.data.notes.length === 0) {
        toast.info("Không tìm thấy ghi chú nào!");
        setIsSearch(false);
        return;
      }

      setIsSearch(true);
      setAllNotes(res.data.notes);
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

    if (file.type === "text/plain") {
      reader.onload = (e) => setFileContent(e.target.result);
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
      alert("Chỉ hỗ trợ .txt, .pdf, .jpg, .png");
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


  const handleSummarize = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tóm tắt!");
      return;
    }

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

      const response = await axios.post("/summarize", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setSummary(response.data.response || "Không thể tạo tóm tắt.");
    } catch (error) {
      console.error("Error summarizing:", error.message);
      toast.error("Có lỗi xảy ra khi tóm tắt!");
    }
  };


  const handleGenerateMindmap = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo mindmap!");
      return;
    }

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
        }
      } else {
        payload.text = fileContent;
      }

      const response = await axios.post("/mindmap", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setMindmapHtml(response.data);
    } catch (error) {
      console.error("Error generating mindmap:", error);
      toast.error("Có lỗi xảy ra khi tạo mindmap!");
    }
  };

  const handleGenerateFlashCard = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo flashcard!");
      return;
    }

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
        }
      } else {
        payload.text = fileContent;
      }

      const response = await axios.post("/flashcard", payload, {
        headers: { "Content-Type": "application/json" },
      });

      setFlashCard(response.data);
    } catch (error) {
      console.error("Error generating flashcard:", error);
      toast.error("Có lỗi xảy ra khi tạo flashcard!");
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
              >
                <MdHome className="text-[24px] text-black" />
              </button>
            )}

            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleAddNote}
              >
                <MdAdd className="text-[24px] text-black" />
              </button>
            )}


            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleShowPinned}
              >
                <MdFavorite
                  className={`text-[24px] ${showPinned ? "text-red-500" : "text-black"}`}
                />
              </button>
            )}

            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={handleShowDeleted}
              >
                <MdDelete
                  className={`text-[24px] ${showDeleted ? "text-blue-500" : "text-black"}`}
                />
              </button>
            )}

            <button
              className="w-12 h-12 flex items-center justify-center rounded-md"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MdOutlineMenu className="text-[24px] text-black" />
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
              <h3 className="text-lg font-semibold">Tóm tắt:</h3>
              <p className="break-words whitespace-pre-wrap">{summary}</p>
            </div>
          )}
          {mindmapHtml && (
            <div className="relative mt-4 p-2 border rounded-md bg-gray-100">
              <button
                onClick={() => setMindmapHtml(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                aria-label="Close Mindmap"
              >
                <MdClose className="text-xl" />
              </button>
              <iframe
                srcDoc={mindmapHtml}
                style={{ width: "100%", height: "400px", border: "none" }}
              />
            </div>
          )}
          {flashcard && (
            <div className="relative mt-4 p-2 border rounded-md bg-gray-100">
              <button
                onClick={() => setFlashCard(null)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
                aria-label="Close Flashcard"
              >
                <MdClose className="text-xl" />
              </button>
              <iframe
                srcDoc={flashcard}
                style={{ width: "100%", height: "400px", border: "none" }}
              />
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
            >
              <MdOutlineMenu className="text-[24px] text-black" />
            </button>
          </div>

          {isRightSidebarOpen && (
            <>
              <h2 className="text-l mb-6 text-center">Chào bạn, {userInfo?.name}!</h2>
              <div className="max-w-lg mx-auto p-4 border rounded-md">
                <textarea
                  className="w-full h-24 p-2 border rounded-md mb-4"
                  placeholder="Nhập văn bản hoặc tải lên tài liệu (.txt) có sẵn."
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  style={{ maxHeight: "500px", minHeight: "150px", resize: "vertical" }}
                ></textarea>

                <input type="file" accept=".txt,.pdf,image/*" onChange={handleFileUpload} className="mb-4" />

                {imageSrc && <img src={imageSrc} alt="Uploaded" className="w-1/2 h-auto mt-2 border rounded-md" />}

                {pdfUrl && (
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">
                    Xem PDF
                  </a>
                )}
                {imageSrc && (
                  <a href={imageSrc} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 block">
                    Xem ảnh
                  </a>
                )}
              </div>

              {/* <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              /> */}
              <div className="flex justify-between gap-2">
                {/* <button
                  className="w-12 h-12 text-black rounded-md flex items-center justify-center border border-gray-600"
                  onClick={handleUploadClick}
                >
                  <MdUpload className="text-[24px] text-black" />
                </button> */}
                <button
                  className="flex-1 h-12 text-black rounded-md flex items-center justify-center border border-gray-600"
                  onClick={handleSummarize}
                >
                  Tóm tắt
                </button>
                <button
                  className="flex-1 h-12 text-black rounded-md flex items-center justify-center border border-gray-600"
                  onClick={handleGenerateMindmap}
                >
                  Mindmap
                </button>
                <button
                  className="flex-1 h-12 text-black rounded-md flex items-center justify-center border border-gray-600"
                  onClick={handleGenerateFlashCard}
                >
                  Flash Card
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