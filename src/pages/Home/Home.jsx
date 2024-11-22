import { useEffect, useState, useRef } from "react";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd, MdUpload, MdOutlineMenu } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios from "axios";
import { toast } from "react-toastify";
import EmptyCard from "../../components/EmptyCard/EmptyCard";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const initialUserCheck = useRef(false);

  const [userInfo, setUserInfo] = useState(null);
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isAddEditVisible, setIsAddEditVisible] = useState(false);
  const [addEditType, setAddEditType] = useState("add");
  const [noteData, setNoteData] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [mindmapHtml, setMindmapHtml] = useState("");
  const [summary, setSummary] = useState("");
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!initialUserCheck.current) {
      initialUserCheck.current = true;
      if (!currentUser) {
        navigate("/");
      } else {
        setUserInfo(currentUser.rest);
        getAllNotes();
      }
    }
  }, [currentUser, navigate]);

  const getAllNotes = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/all", {
        withCredentials: true,
      });

      if (!res.data.success) return;
      setAllNotes(res.data.notes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (noteDetails) => {
    setAddEditType("edit");
    setNoteData(noteDetails);
    setIsAddEditVisible(true);
  };

  const deleteNote = async (data) => {
    const noteId = data._id;

    try {
      const res = await axios.delete(
        `http://localhost:3000/api/note/delete/${noteId}`,
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

  const onSearchNote = async (query) => {
    try {
      const res = await axios.get("http://localhost:3000/api/note/search", {
        params: { query },
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error(res.data.message);
        return;
      }

      setIsSearch(true);
      setAllNotes(res.data.notes);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id;

    try {
      const res = await axios.put(
        `http://localhost:3000/api/note/update-note-pinned/${noteId}`,
        { isPinned: !noteData.isPinned },
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

  const handleAddNoteSuccess = () => {
    getAllNotes();
  };

  const rightSidebarWidth = isRightSidebarOpen ? "20%" : "4rem";

  //File upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result);
      };
      reader.readAsText(file);
    } else {
      toast.error("Vui lòng chọn tệp văn bản (.txt)");
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleSummarize = async () => {
    if (!fileContent.trim()) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tóm tắt!");
      return;
    }

    try {
      const response = await axios.post(
        "http://vietserver.bounceme.net:6082/summarize",
        { text: fileContent },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setSummary(response.data.response || "Không thể tạo tóm tắt.");
      toast.success("Tóm tắt thành công!");
    } catch (error) {
      console.error("Error summarizing text:", error.message);
      toast.error("Có lỗi xảy ra khi tóm tắt văn bản!");
    }
  };

  const handleGenerateMindmap = async () => {
    if (!fileContent.trim()) {
      toast.error(
        "Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo mindmap!"
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://vietserver.bounceme.net:6082/mindmap",
        { text: fileContent },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      setMindmapHtml(response.data);
      toast.success("Tạo mindmap thành công!");
    } catch (error) {
      console.error("Error generating mindmap:", error);
      toast.error("Có lỗi xảy ra khi tạo mindmap!");
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
          className={`transition-all duration-300 ${
            isSidebarOpen ? "w-1/5" : "w-16"
          } h-full bg-gray-100 p-4 relative shadow-md`}
          style={{ backgroundColor: "#C8BBBB" }}
        >
          <div className="flex justify-between items-center">
            {isSidebarOpen && (
              <button
                className="w-12 h-12 flex items-center justify-center rounded-md"
                onClick={() => {
                  setAddEditType("add");
                  setNoteData(null);
                  setIsAddEditVisible(true);
                }}
              >
                <MdAdd className="text-[24px] text-black" />
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
                    Oops! Không tìm thấy ghi chú nào phù hợp với tìm kiếm của
                    bạn
                  </p>
                ) : (
                  allNotes.map((note) => (
                    <NoteCard
                      key={note._id}
                      title={note.title}
                      isPinned={note.isPinned}
                      onEdit={() => handleEdit(note)}
                      onDelete={() => deleteNote(note)}
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
          className={`flex-1 p-5 overflow-y-auto h-full transition-all duration-300 ${
            isSidebarOpen ? "ml-0" : "ml-16"
          }`}
          style={{ margin: "auto", marginRight: rightSidebarWidth }}
        >
          {isAddEditVisible ? (
            <AddEditNotes
              onClose={() => {
                setIsAddEditVisible(false);
                setNoteData(null);
                handleAddNoteSuccess();
              }}
              noteData={noteData}
              type={addEditType}
              getAllNotes={getAllNotes}
            />
          ) : (
            <EmptyCard
              message={
                <>
                  Chọn một ghi chú có sẵn hoặc{" "}
                  <span
                    className="underline cursor-pointer text-black font-semibold"
                    onClick={() => {
                      setAddEditType("add");
                      setNoteData(null);
                      setIsAddEditVisible(true);
                    }}
                  >
                    tạo
                  </span>{" "}
                  ghi chú mới
                </>
              }
            />
          )}
          {summary && (
            <div className="mt-4 p-2 border rounded-md bg-gray-200">
              <h3 className="text-lg font-semibold">Tóm tắt:</h3>
              <p className="break-words whitespace-pre-wrap">{summary}</p>
            </div>
          )}
          {mindmapHtml && (
            <div className="mt-4 p-2 border rounded-md bg-gray-100">
              <iframe
                srcDoc={mindmapHtml}
                style={{ width: "100%", height: "400px", border: "none" }}
              />
            </div>
          )}
        </main>

        {/* RightSidebar */}
        <aside
          className={`transition-all duration-300 ${
            isRightSidebarOpen ? "w-1/5" : "w-16"
          } h-full bg-[#C8BBBB] p-4 relative shadow-md overflow-y-auto`}
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
              <h2 className="text-l mb-6 text-center">
                Chào bạn, {userInfo?.username}!
              </h2>
              <textarea
                className="w-full h-24 p-2 border rounded-md mb-4"
                placeholder="Nhập văn bản hoặc tải lên tài liệu của bạn."
                value={fileContent}
                onChange={(e) => setFileContent(e.target.value)}
              ></textarea>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="hidden"
                ref={fileInputRef}
              />
              <div className="flex justify-between gap-2">
                <button
                  className="w-12 h-12 text-black rounded-md flex items-center justify-center border border-gray-600"
                  onClick={handleUploadClick}
                >
                  <MdUpload className="text-[24px] text-black" />
                </button>
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
              </div>
            </>
          )}
        </aside>
      </div>
    </>
  );
};

export default Home;
