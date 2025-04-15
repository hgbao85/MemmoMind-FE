import { useState } from 'react';
import { Filter, Grid, Calendar, Gift, Pencil, Image, Zap, Clock, Mail, Share2 } from 'lucide-react';
import Sidebar from '../../components/Sidebar/Sidebar';
export default function Home() {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Favourite Notes'];
  
  const notes = [
    {
      id: 1,
      icon: <Calendar className="text-blue-500" />,
      title: 'Weekly Planner',
      content: 'Virtual Digital Marketing Course every week on Monday, Wednesday and Saturday.Virtual Digital Marketing Course every week on Monday',
      shareCount: '03 Share',
      date: '12 Jan 2021',
      onlyYou: true,
    },
    {
      id: 2,
      icon: <Gift className="text-purple-500" />,
      title: 'Birthday Celebration',
      content: 'You can easily share via message, WhatsApp, emails etc. You can also save your notes and edit it later or can easily delete the note.',
      onlyYou: true,
      date: '10 Jan 2021',
    },
    {
      id: 3,
      icon: <Pencil className="text-orange-500" />,
      title: 'Essay Outline',
      content: [
        'Content should be of topic.',
        '300 Words only.',
        'Make presentation.',
      ],
      onlyYou: true,
      date: '09 Jan 2021',
    },
    {
      id: 4,
      icon: <Calendar className="text-pink-500" />,
      title: 'Lecture Notes',
      content: [
        'Chapter 1 notes.',
        'Chapter 2 Assignment.',
        'Chapter 3 practical File.',
      ],
      checklist: true,
      onlyYou: true,
      date: '09 Jan 2021',
    },
    {
      id: 5,
      icon: <Image className="text-blue-500" />,
      title: 'Image Notes',
      images: ['/api/placeholder/100/75', '/api/placeholder/100/75', '/api/placeholder/100/75'],
      shareCount: '01 Share',
      date: '05 Jan 2021',
    },
    {
      id: 6,
      icon: <Zap className="text-green-500" />,
      title: 'Benefits of NotePlus',
      content: 'Take organized notes and share later as meeting minutes or check-list with this simple accessible Noteplus. Each note you create will be stored on a virtual page of the NotePlus. You',
      shareCount: '02 Share',
      date: '10 Jan 2021',
    },
    {
      id: 7,
      icon: <Clock className="text-green-500" />,
      title: 'Quick Summary',
      content: 'Need to write a summary note of the subject you just finished? NotePlus lets you do in on-the-go! \n\nHttps://Dribble.com/Shots/6387620',
      onlyYou: true,
      date: '11 Jan 2021',
    },
    {
      id: 8,
      icon: <Mail className="text-orange-500" />,
      title: 'Address & Email',
      content: 'Quickly note down the address and email address on NotePlus so that you can access it from anywhere.',
      shareCount: '04 Share',
      date: '13 Jan 2021',
    },
    {
      id: 9,
      icon: <Zap className="text-blue-500" />,
      title: 'NotePlus for Entrepreneurs',
      content: 'With NotePlus, you can easily share via message, WhatsApp, emails etc. You can also save your notes and edit it later or can easily delete the note.',
      onlyYou: true,
      date: '14 Jan 2021',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">

      <Sidebar
      // gọi hàm
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Write Your Note" 
                className="w-full p-2 rounded border border-gray-200"
              />
            </div>
          </div>
        </div>
        
        {/* Notes Section */}
        <div className="flex-1 overflow-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Your Notes</h2>
            
            <div className="flex border-b border-gray-200">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
              <div className="ml-auto flex">
                <button className="p-2 text-gray-500">
                  <Filter size={18} />
                </button>
                <button className="p-2 text-gray-500">
                  <Grid size={18} />
                </button>
              </div>
            </div>
          </div>
          
          {/* Notes Grid */}
          <div className="grid grid-cols-3 gap-4">
            {notes.map(note => (
              <div key={note.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-gray-100 p-2 rounded">
                      {note.icon}
                    </div>
                    <button className="text-gray-400">
                      <span>•••</span>
                    </button>
                  </div>
                  
                  <h3 className="font-bold mb-2">{note.title}</h3>
                  
                  {Array.isArray(note.content) ? (
                    <ul className="text-sm text-gray-600 mb-4">
                      {note.content.map((item, i) => (
                        <li key={i} className="mb-1 flex items-start">
                          {note.checklist ? (
                            <span className="mr-2 text-gray-400 border border-gray-300 rounded w-4 h-4 flex-shrink-0 mt-0.5"></span>
                          ) : (
                            <span className="mr-2">•</span>
                          )}
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : note.images ? (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {note.images.map((img, i) => (
                        <img key={i} src={img} alt="Note" className="rounded" />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 mb-4">{note.content}</p>
                  )}
                </div>
                
                <div className="border-t border-gray-200 p-2 flex items-center text-xs text-gray-500">
                  {note.onlyYou && (
                    <div className="flex items-center mr-4">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                      <span>Only You</span>
                    </div>
                  )}
                  
                  {note.shareCount && (
                    <div className="flex items-center mr-4">
                      <Share2 size={12} className="mr-1" />
                      <span>{note.shareCount}</span>
                    </div>
                  )}
                  
                  <div className="ml-auto flex items-center">
                    <Calendar size={12} className="mr-1" />
                    <span>{note.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex justify-between text-xs text-gray-500">
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
          <div>
            <span>2025© NotePlus</span>
          </div>
        </div>
      </div>
    </div>
  );
}



// /* eslint-disable no-unused-vars */
// import { useEffect, useState, useRef } from "react";
// import { toast } from "react-toastify";
// // import EmptyCard from "../../components/EmptyCard/EmptyCard";
// import api from "../../services/api";
// import axios from "axios";
// import "./flashcard.css";
// import { marked } from "marked";
// import * as msgpack from "@msgpack/msgpack";
// import { useMemo } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { closePopup } from "../../redux/user/paymentSlice";
// import { updateUserCost } from "../../redux/user/userSlice";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../../components/Navbar";
// import ChatbaseWidget from "../../components/ChatBase/ChatbaseWidget";

// // Import các component từ RightSidebar
// import RightSidebar from "../../components/RightSidebar/RightSidebar";
// import Summarize from "../../components/RightSidebar/Summarize";
// import Mindmap from "../../components/RightSidebar/Mindmap";
// import Flashcard from "../../components/RightSidebar/Flashcard";
// import Solve from "../../components/RightSidebar/Solve";
// import PowerPoint from "../../components/RightSidebar/PowerPoint";
// import MultipleChoice from "../../components/RightSidebar/MultipleChoice";

// // Import các component mới tạo
// import LeftSidebar from "../../components/LeftSidebar/LeftSidebar";
// import MainContent from "../../components/MainContent/MainContent";

// const Home = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const initialUserCheck = useRef(false);
//   const [formKey, setFormKey] = useState(0);
//   const [userInfo, setUserInfo] = useState(null);
//   const [allNotes, setAllNotes] = useState([]);
//   const [pinnedNotes, setPinnedNotes] = useState([]);
//   const [deletedNotes, setDeletedNotes] = useState([]);
//   const [showPinned, setShowPinned] = useState(false);
//   const [showDeleted, setShowDeleted] = useState(false);
//   const [isSearch, setIsSearch] = useState(false);
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//   const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
//   const [addEditType, setAddEditType] = useState("add");
//   const [noteData, setNoteData] = useState(null);
//   const [fileContent, setFileContent] = useState("");
//   const [mindmapHtml, setMindmapHtml] = useState("");
//   const [summary, setSummary] = useState("");
//   const [flashcard, setFlashCard] = useState("");
//   const [solve, setSolve] = useState("");
//   const [powerpointPreview, setPowerpointPreview] = useState("");
//   const [pptxFilename, setPptxFilename] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showAllNotes, setShowAllNotes] = useState(true);
//   const [imageSrc, setImageSrc] = useState(null);
//   const [pdfUrl, setPdfUrl] = useState(null);
//   const [isManuallyClosed, setIsManuallyClosed] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [charCount, setCharCount] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [topicMulchoice, setTopicMulchoice] = useState("");
//   const [userAnswers, setUserAnswers] = useState({});
//   const isPopupOpen = useSelector((state) => state.payment.isPopupOpen);
//   const dispatch = useDispatch();
//   const [amount, setAmount] = useState(1000);
//   const topic =
//     flashcard.length > 0 && currentIndex < flashcard.length
//       ? Object.keys(flashcard[currentIndex])[0]
//       : "";
//   const content =
//     flashcard.length > 0 && currentIndex < flashcard.length
//       ? flashcard[currentIndex][topic]
//       : null;
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const navigate = useNavigate();
//   const [multipleChoice, setMultipleChoice] = useState([]);
//   const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
//   const [selectedAnswer, setSelectedAnswer] = useState(null);
//   const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
//   const currentQuestionData =
//     multipleChoice.length > 0 && currentChoiceIndex < multipleChoice.length
//       ? multipleChoice[currentChoiceIndex]
//       : null;

//   const contentMulchoice = useMemo(() => {
//     if (!currentQuestionData) {
//       return {
//         question: "Không có dữ liệu",
//         correctAnswer: "Không có dữ liệu",
//         wrongAnswers: [],
//       };
//     }

//     const topicKey = Object.keys(currentQuestionData)[0]; // Lấy chủ đề hiện tại
//     const questionData = currentQuestionData[topicKey] || {}; // Lấy dữ liệu câu hỏi

//     return {
//       question: questionData.Question?.[0] || "Không có dữ liệu",
//       correctAnswer: questionData.Answer?.[0] || "Không có dữ liệu",
//       wrongAnswers: questionData["Wrong Answer"] || [],
//     };
//   }, [currentQuestionData]);


//   const [shuffledAnswers, setShuffledAnswers] = useState([]);

//   useEffect(() => {
//     if (contentMulchoice.correctAnswer !== "Không có dữ liệu") {
//       setShuffledAnswers(shuffleAnswers(contentMulchoice.correctAnswer, contentMulchoice.wrongAnswers));
//     }
//   }, [contentMulchoice]);

//   useEffect(() => {
//     const previousAnswer = userAnswers[currentChoiceIndex] || null;
//     setSelectedAnswer(previousAnswer);
//     setIsAnswerCorrect(previousAnswer === contentMulchoice.correctAnswer);
//   }, [currentChoiceIndex, contentMulchoice, userAnswers]);

//   const [loadingState, setLoadingState] = useState({
//     isLoading: false,
//     action: "",
//   });

//   useEffect(() => {
//     if (!initialUserCheck.current) {
//       initialUserCheck.current = true;
//       if (!currentUser) {
//         navigate("/");
//       } else {
//         getUserInfo();
//         getAllNotes();
//         getTrashedNotes();
//         setAddEditType("add");
//         setIsManuallyClosed(false);
//       }
//     }
//   }, [currentUser, navigate]);

//   useEffect(() => {
//     if (multipleChoice.length > 0 && currentChoiceIndex < multipleChoice.length) {
//       const currentQuestionObj = multipleChoice[currentChoiceIndex];
//       const topicKey = Object.keys(currentQuestionObj)[0]; // Lấy chủ đề của câu hỏi hiện tại
//       setTopicMulchoice(topicKey || "Không có dữ liệu");
//     } else {
//       setTopicMulchoice("Không có dữ liệu");
//     }
//   }, [multipleChoice, currentChoiceIndex]);

//   const shuffleAnswers = (correctAnswer, wrongAnswers) => {
//     let options = [...wrongAnswers, correctAnswer]; // Thêm cả câu đúng
//     for (let i = options.length - 1; i > 0; i--) {
//       const j = Math.floor(Math.random() * (i + 1));
//       [options[i], options[j]] = [options[j], options[i]]; // Hoán đổi ngẫu nhiên
//     }
//     return options;
//   };

//   // Hàm lấy thông tin User hiện tại
//   const getUserInfo = async () => {
//     try {
//       const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
//         withCredentials: true,
//       });

//       if (!res.data.success) {
//         toast.error("Không thể lấy thông tin người dùng!");
//         return;
//       }

//       setUserInfo(res.data.user);
//     } catch (error) {
//       console.error("Error fetching user info:", error);
//       toast.error("Lỗi khi lấy thông tin người dùng!");
//     }
//   };

//   // 📝 Lấy tất cả ghi chú
//   const getAllNotes = async () => {
//     try {
//       const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/note/all", {
//         withCredentials: true,
//       });

//       if (!res.data.success) return;

//       let fetchedNotes = res.data.notes.filter((note) => !note.isDeleted);

//       fetchedNotes = fetchedNotes.sort(
//         (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//       );

//       setAllNotes(fetchedNotes);
//       setPinnedNotes(fetchedNotes.filter((note) => note.isPinned));
//     } catch (error) {
//       console.error("Error fetching notes:", error);
//       toast.error("Lỗi khi tải danh sách ghi chú!");
//     }
//   };

//   const handleAddNote = (note = { title: "", content: "" }) => {
//     setIsManuallyClosed(false);
//     setNoteData(note);
//     setAddEditType("add");
//   };

//   const handleShowAllNotes = () => {
//     setShowAllNotes(true);
//     setShowPinned(false);
//     setShowDeleted(false);
//   };

//   const updateIsPinned = async (noteData) => {
//     const noteId = noteData._id;

//     try {
//       const res = await api.put(
//         `https://memmomind-be-ycwv.onrender.com/api/note/update-note-pinned/${noteId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (!res.data.success) {
//         toast.error(res.data.message);
//         return;
//       }

//       setAllNotes((prevNotes) =>
//         prevNotes.map((note) =>
//           note._id === noteId ? { ...note, isPinned: !note.isPinned } : note
//         )
//       );

//       setPinnedNotes((prevPinned) =>
//         !noteData.isPinned
//           ? [...prevPinned, { ...noteData, isPinned: true }]
//           : prevPinned.filter((note) => note._id !== noteId)
//       );
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // 🗑 Lấy danh sách ghi chú trong thùng rác (isDeleted=true)
//   const getTrashedNotes = async () => {
//     try {
//       const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/all?isDeleted=true`, { withCredentials: true });
//       if (!res.data.notes) return;
//       setDeletedNotes(res.data.notes);
//     } catch (error) {
//       console.error("Error fetching deleted notes:", error);
//       toast.error("Lỗi khi tải danh sách ghi chú đã xóa!");
//     }
//   };

//   const handleEdit = (note) => {
//     setIsManuallyClosed(false);
//     setNoteData(note);
//     setAddEditType("edit");
//   };

//   const handleShowNote = (note) => {
//     setNoteData(note);
//     setAddEditType("view");
//     setIsManuallyClosed(false);
//     setFormKey((prev) => prev + 1);
//   };

//   const onSearchNote = async (query) => {
//     try {
//       if (!query.trim()) {
//         toast.error("Vui lòng nhập từ khóa tìm kiếm!");
//         return;
//       }

//       const res = await api.get(`https://memmomind-be-ycwv.onrender.com/api/note/search`, {
//         params: { keyword: query },
//         withCredentials: true,
//       });

//       const filteredNotes = res.data.notes.filter((note) => !note.isDeleted);
//       if (
//         !res.data.notes ||
//         (res.data.notes.length === 0 && filteredNotes.length === 0)
//       ) {
//         toast.info("Không tìm thấy ghi chú nào!");
//         setIsSearch(false);
//         return;
//       }
//       setIsSearch(true);
//       setAllNotes(filteredNotes);
//     } catch (error) {
//       console.error("Error searching notes:", error);
//       toast.error(error.response?.data?.message || "Lỗi khi tìm kiếm!");
//     }
//   };

//   const handleClearSearch = () => {
//     setIsSearch(false);
//     getAllNotes();
//   };

//   // Di chuyển ghi chú vào thùng rác
//   const moveToTrash = async (noteId) => {
//     try {
//       const res = await api.put(
//         `https://memmomind-be-ycwv.onrender.com/api/note/trash/${noteId}`,
//         {},
//         { withCredentials: true }
//       );

//       if (!res.data.success) {
//         toast.error(res.data.message);
//         return;
//       }

//       if (noteData && noteData._id === noteId) {
//         setNoteData(null); // Làm trống giao diện chính
//         setAddEditType("add"); // Chuyển về chế độ thêm ghi chú mới
//       }

//       toast.success(res.data.message);
//       getAllNotes(); // Cập nhật danh sách notes
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   // Khôi phục ghi chú từ thùng rác
//   const restoreNote = async (noteId) => {
//     try {
//       if (!noteId) {
//         toast.error("ID ghi chú không hợp lệ!");
//         return;
//       }

//       const res = await api.delete(
//         `https://memmomind-be-ycwv.onrender.com/api/note/delete-restore/${noteId}?actionType=restore`,
//         { withCredentials: true }
//       );

//       if (
//         !res.data ||
//         res.data.message !== "Operation performed successfully"
//       ) {
//         toast.error(res.data.message || "Lỗi khi khôi phục ghi chú!");
//         return;
//       }

//       toast.success("Khôi phục note thành công!");
//       getTrashedNotes();
//       getAllNotes();
//     } catch (error) {
//       console.error("Error restoring note:", error);
//       toast.error(
//         error.response?.data?.message || "Lỗi khi khôi phục ghi chú!"
//       );
//     }
//   };

//   // Xóa ghi chú vĩnh viễn từ thùng rác
//   const permanentlyDeleteNote = async (noteId) => {
//     try {
//       if (!noteId) {
//         toast.error("ID ghi chú không hợp lệ!");
//         return;
//       }

//       const res = await api.delete(
//         `https://memmomind-be-ycwv.onrender.com/api/note/delete-restore/${noteId}?actionType=delete`,
//         { withCredentials: true }
//       );

//       if (
//         !res.data ||
//         res.data.message !== "Operation performed successfully"
//       ) {
//         toast.error(res.data.message || "Lỗi khi xóa ghi chú!");
//         return;
//       }

//       if (noteData && noteData._id === noteId) {
//         setNoteData(null); // Làm trống giao diện chính
//         setAddEditType("add"); // Chuyển về chế độ thêm ghi chú mới
//       }

//       toast.success("Xóa ghi chú vĩnh viễn thành công!");
//       getTrashedNotes();
//     } catch (error) {
//       console.error("Error deleting note:", error);
//       toast.error(error.response?.data?.message || "Lỗi khi xóa ghi chú!");
//     }
//   };

//   const handleAddNoteSuccess = () => {
//     getAllNotes();
//   };

//   const rightSidebarWidth = isRightSidebarOpen ? "20%" : "4rem";

//   // Hiển thị ghi chú ghim
//   const handleShowPinned = () => {
//     setShowAllNotes(false);
//     setShowPinned(!showPinned);
//     setShowDeleted(false);
//   };

//   // 🗑 Hiển thị ghi chú trong thùng rác
//   const handleShowDeleted = () => {
//     setShowDeleted(!showDeleted);
//     setShowPinned(false);

//     if (!showDeleted) {
//       getTrashedNotes();
//     }
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     // Validate file size (< 30MB)
//     const maxSize = 30 * 1024 * 1024; // 30MB in bytes
//     if (file.size > maxSize) {
//       toast.error("Kích thước file vượt quá 30MB!");
//       return;
//     }

//     const reader = new FileReader();
//     setUploadedFile(file); // Lưu file để gửi API

//     if (file.type === "text/plain") {
//       reader.onload = (e) => {
//         let content = e.target.result;

//         // Loại bỏ các ký tự xuống dòng
//         content = content.replace(/\r?\n/g, "");

//         // Validate text length (< 40000 characters)
//         if (content.length > 40000) {
//           toast.error("Nội dung văn bản vượt quá 40000 ký tự!");
//           return;
//         }
//         setFileContent(content);
//         setCharCount(content.length);
//       };
//       reader.readAsText(file);
//     } else if (file.type.startsWith("image/")) {
//       const imageUrl = URL.createObjectURL(file);
//       setImageSrc(imageUrl);
//       setPdfUrl(null);
//     } else if (file.type === "application/pdf") {
//       const pdfUrl = URL.createObjectURL(file);
//       setPdfUrl(pdfUrl);
//       setImageSrc(null);
//     } else {
//       alert("Chỉ hỗ trợ các định dạng file: .txt, .pdf, .jpg, .png");
//     }
//   };

//   const handleChange = (e) => {
//     const content = e.target.value;
//     setFileContent(content);
//     setCharCount(content.length);
//   };

//   // Chuyển file thành base64
//   const convertFileToBase64 = (file) => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file);
//       reader.onload = () => resolve(reader.result.split(",")[1]); // Lấy phần Base64
//       reader.onerror = (error) => reject(error);
//     });
//   };

//   const handleNext = () => {
//     setIsTransitioning(true); // Ẩn flashcard trước khi chuyển
//     setTimeout(() => {
//       setCurrentIndex((prev) => (prev + 1) % flashcard.length);
//       setIsFlipped(false); // Reset trạng thái lật
//       setIsTransitioning(false); // Hiển thị flashcard sau khi cập nhật
//     }, 100);
//   };

//   const handlePrev = () => {
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setCurrentIndex(
//         (prev) => (prev - 1 + flashcard.length) % flashcard.length
//       );
//       setIsFlipped(false);
//       setIsTransitioning(false);
//     }, 100);
//   };

//   const handleNextmulchoice = () => {
//     setIsTransitioning(true); // Bắt đầu hiệu ứng chuyển câu
//     setTimeout(() => {
//       setCurrentChoiceIndex((prevIndex) =>
//         prevIndex < multipleChoice.length - 1 ? prevIndex + 1 : 0
//       );
//       setIsTransitioning(false); // Kết thúc hiệu ứng sau khi cập nhật
//     }, 100); // Thời gian ngắn để tạo hiệu ứng mượt mà
//   };

//   const handlePrevmulchoice = () => {
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setCurrentChoiceIndex((prevIndex) =>
//         prevIndex > 0 ? prevIndex - 1 : multipleChoice.length - 1
//       );
//       setIsTransitioning(false);
//     }, 100);
//   };

//   const handleRemoveFile = () => {
//     setPdfUrl(null);
//     setImageSrc(null);
//   };

//   const saveMindmapAsHTML = () => {
//     if (!mindmapHtml) {
//       toast.error("Không có Mindmap để lưu!");
//       return;
//     }

//     const blob = new Blob([mindmapHtml], { type: "text/html" });
//     const link = document.createElement("a");
//     link.href = URL.createObjectURL(blob);
//     link.download = "mindmap.html";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const saveFlashcardAsHTML = () => {
//     let flashcardHTML = `
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Flashcards</title>
//         <style>
//           * {
//             margin: 0;
//             padding: 0;
//             box-sizing: border-box;
//           }
//           body {
//             font-family: Arial, sans-serif;
//             text-align: center;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             height: 100vh;
//             background-color: #f8f9fa;
//           }
//           h1 {
//             font-size: 28px;
//             font-weight: bold;
//             margin-bottom: 20px;
//           }

//           .flashcard-wrapper {
//             padding: 20px;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
//             border: 2px solid #d1d5db;
//             width: 90%;
//             max-width: 650px;
//             text-align: center;
//           }

//           .flashcard-container {
//             width: 100%;
//             max-width: 600px;
//             height: 300px;
//             perspective: 1000px;
//             position: relative;
//             margin: auto;
//           }

//           .flashcard {
//             width: 100%;
//             height: 100%;
//             transform-style: preserve-3d;
//             transition: transform 0.6s ease-in-out;
//             cursor: pointer;
//             position: relative;
//             border-radius: 12px;
//           }

//           .flipped {
//             transform: rotateY(180deg);
//           }

//           .front, .back {
//             position: absolute;
//             width: 100%;
//             height: 100%;
//             backface-visibility: hidden;
//             display: flex;
//             flex-direction: column;
//             align-items: center;
//             justify-content: center;
//             padding: 20px;
//             border-radius: 12px;
//             box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
//             font-size: 18px;
//             font-weight: bold;
//           }

//           .front {
//             background: #cfe2ff;
//             color: #0d47a1;
//           }

//           .back {
//             background: #ffd6a5;
//             transform: rotateY(180deg);
//             color: #5d4037;
//           }

//           .navigation {
//             display: flex;
//             justify-content: center;
//             align-items: center;
//             margin-top: 20px;
//             gap: 30px;
//           }

//           .btn {
//             background: none;
//             border: none;
//             font-size: 28px;
//             cursor: pointer;
//             transition: transform 0.2s ease-in-out;
//           }

//           .btn:hover {
//             transform: scale(1.2);
//           }

//           #counter {
//             font-size: 18px;
//             font-weight: bold;
//             color: #333;
//           }
//         </style>
//       </head>
//       <body>
//         <h1>Thẻ ghi nhớ</h1>
//         <div class="flashcard-wrapper">
//           <div class="flashcard-container">
//             <div class="flashcard" id="flashcard">
//               <div class="front" id="flashcard-front"></div>
//               <div class="back" id="flashcard-back"></div>
//             </div>
//           </div>
//           <div class="navigation">
//             <button class="btn" onclick="prevCard()">⬅</button>
//             <span id="counter">1 / ${flashcard.length}</span>
//             <button class="btn" onclick="nextCard()">➡</button>
//           </div>
//         </div>

//         <script>
//           let flashcards = ${JSON.stringify(flashcard)};
//           let currentIndex = 0;
//           let isFlipped = false;

//           function updateFlashcard() {
//             let card = flashcards[currentIndex];
//             let topic = Object.keys(card)[0];
//             let content = card[topic];
//             document.getElementById("flashcard-front").innerHTML = "<h3 style='margin-bottom: 10px; text-transform: uppercase; font-size: 16px; font-weight: bold;'>" + topic + "</h3><p style='font-size: 20px; font-weight: 600;'>" + (content.Question?.[0] || "Không có dữ liệu") + "</p>";
//             document.getElementById("flashcard-back").innerHTML = "<p style='font-size: 20px; font-weight: 600;'>" + (content.Answer?.[0] || "Không có dữ liệu") + "</p>";
//             document.getElementById("counter").innerText = (currentIndex + 1) + " / " + flashcards.length;
//             document.getElementById("flashcard").classList.remove("flipped");
//             isFlipped = false;
//           }

//           document.getElementById("flashcard").addEventListener("click", () => {
//             isFlipped = !isFlipped;
//             document.getElementById("flashcard").classList.toggle("flipped");
//           });

//           function nextCard() {
//             currentIndex = (currentIndex + 1) % flashcards.length;
//             updateFlashcard();
//           }

//           function prevCard() {
//             currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
//             updateFlashcard();
//           }

//           updateFlashcard();
//         </script>
//       </body>
//       </html>
//     `;

//     const blob = new Blob([flashcardHTML], { type: "text/html" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "flashcard.html";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   const handlePayment = async () => {
//     try {
//       const orderCode = Date.now();
//       const res = await api.post("/payment/create-payment", {
//         orderCode,
//         amount,
//         description: "Nap tien Memmomind",
//         cancelUrl: `${window.location.origin}/payment/cancel`,
//         returnUrl: `${window.location.origin}/payment/success?&amount=${amount}`,
//       });

//       if (res.data?.data?.checkoutUrl) {
//         window.location.href = res.data.data.checkoutUrl;
//       }
//     } catch (error) {
//       console.error("Lỗi thanh toán:", error);
//     }
//   };

//   // Hàm tạo tóm tắt
//   const handleSummarize = async () => {
//     if (!fileContent.trim() && !uploadedFile) {
//       toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tóm tắt!");
//       return;
//     }

//     setLoadingState({ isLoading: true, action: "summarize" });

//     try {
//       let payload = { userId: currentUser.user._id };

//       if (uploadedFile) {
//         if (uploadedFile.type === "text/plain") {
//           const text = await uploadedFile.text();
//           payload.text = text;
//         } else {
//           const base64String = await convertFileToBase64(uploadedFile);
//           payload.file = base64String;
//           payload.fileType = uploadedFile.type;
//           payload.fileName = uploadedFile.name;
//         }
//       } else {
//         payload.text = fileContent;
//       }

//       // Gửi request API AI để tóm tắt văn bản
//       const response = await axios.post(
//         "http://vietserver.ddns.net:6082/summarize",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//           responseType: "blob", // Nhận phản hồi dưới dạng blob
//         }
//       );

//       const arrayBuffer = await response.data.arrayBuffer();
//       const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

//       console.log("Decoded Data:", decodedData);

//       // Lấy dữ liệu từ `decodedData.json`
//       const summaryText = decodedData?.json?.summarize || "Không thể tạo tóm tắt.";
//       setSummary(summaryText);

//       // Giả sử API trả về total_cost trong response
//       const newCost = decodedData?.json?.total_cost || 0;

//       // Gửi total_cost về BE để lưu vào model User
//       if (newCost > 0 && currentUser?.user?._id && currentUser?.token) {
//         await axios.post("https://memmomind-be-ycwv.onrender.com/api/user/update-cost", {
//           userId: currentUser.user._id,
//           newCost: newCost,
//         },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`, // Thêm token vào header
//             },
//           });
//         console.log("Total cost saved:", newCost);

//         // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
//         if (currentUser?.user?.role === "freeVersion") {
//           dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
//         } else if (currentUser?.user?.role === "costVersion") {
//           dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
//         }
//       }

//     } catch (error) {
//       console.error("Error summarizing:", error.message);
//       toast.error("Có lỗi xảy ra khi tóm tắt!");
//     } finally {
//       setLoadingState({ isLoading: false, action: "" });
//     }
//   };

//   // Hàm tạo mindmap
//   const handleGenerateMindmap = async () => {
//     if (!fileContent.trim() && !uploadedFile) {
//       toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo mindmap!");
//       return;
//     }

//     setLoadingState({ isLoading: true, action: "mindmap" });

//     try {
//       let payload = { userId: currentUser.user._id };

//       if (uploadedFile) {
//         if (uploadedFile.type === "text/plain") {
//           const text = await uploadedFile.text();
//           payload.text = text;
//         } else {
//           const base64String = await convertFileToBase64(uploadedFile);
//           payload.file = base64String;
//           payload.fileType = uploadedFile.type;
//           payload.fileName = uploadedFile.name;
//         }
//       } else {
//         payload.text = fileContent;
//       }

//       const response = await axios.post("http://vietserver.ddns.net:6082/mindmap", payload, {
//         headers: { "Content-Type": "application/json" },
//         responseType: "blob",
//       });

//       const arrayBuffer = await response.data.arrayBuffer();
//       const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

//       const jsonData = decodedData.json;

//       if (jsonData.metadata && jsonData.metadata.content_type === "application/html") {
//         const htmlContent = new TextDecoder().decode(decodedData.file);
//         setMindmapHtml(htmlContent); // Cập nhật state hiển thị mindmap
//       }

//       // Kiểm tra xem có trường total_cost trong metadata không
//       const newCost = jsonData?.total_cost || 0;

//       if (newCost > 0) {
//         // Gửi yêu cầu cập nhật chi phí lên server
//         await axios.post(
//           "https://memmomind-be-ycwv.onrender.com/api/user/update-cost",
//           {
//             userId: currentUser.user._id,
//             newCost: newCost,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );
//         console.log("Total cost saved:", newCost);
//         // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
//         if (currentUser?.user?.role === "freeVersion") {
//           dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
//         } else if (currentUser?.user?.role === "costVersion") {
//           dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
//         }
//       }

//     } catch (error) {
//       console.error("Error generating mindmap:", error);
//       toast.error("Có lỗi xảy ra khi tạo mindmap!");
//     } finally {
//       setLoadingState({ isLoading: false, action: "" });
//     }
//   };

//   // Hàm tạo flashcard từ văn bản hoặc tệp tải lên
//   const handleGenerateFlashCard = async () => {
//     if (!fileContent.trim() && !uploadedFile) {
//       toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo flashcard!");
//       return;
//     }

//     setLoadingState({ isLoading: true, action: "flashcard" });

//     try {
//       let payload = { userId: currentUser.user._id };

//       // Kiểm tra tệp được tải lên
//       if (uploadedFile) {
//         if (uploadedFile.type === "text/plain") {
//           const text = await uploadedFile.text();
//           payload.text = text;
//         } else {
//           const base64String = await convertFileToBase64(uploadedFile);
//           payload.file = base64String;
//           payload.fileType = uploadedFile.type;
//           payload.fileName = uploadedFile.name;
//         }
//       } else {
//         payload.text = fileContent;
//       }

//       // Gửi yêu cầu đến API tạo flashcard
//       const response = await axios.post(
//         "http://vietserver.ddns.net:6082/flashcard",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//           responseType: "blob", // Nhận phản hồi dưới dạng blob
//         }
//       );

//       // Giải mã phản hồi nhận được từ server
//       const arrayBuffer = await response.data.arrayBuffer();
//       const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

//       console.log("Decoded Data:", decodedData);  // Debug: Kiểm tra dữ liệu trả về

//       // Lấy danh sách flashcards từ dữ liệu đã giải mã
//       const flashcardData = decodedData?.json?.flashcard || [];

//       // Kiểm tra nếu dữ liệu hợp lệ và có flashcards
//       if (Array.isArray(flashcardData) && flashcardData.length > 0) {
//         setFlashCard(flashcardData);  // Cập nhật trạng thái hiển thị flashcards
//         setCurrentIndex(0);  // Đặt chỉ số hiện tại về 0
//       } else {
//         toast.error("Dữ liệu flashcard không hợp lệ!");  // Thông báo lỗi nếu dữ liệu không hợp lệ
//         setFlashCard([]);  // Đảm bảo không có flashcard nào hiển thị
//       }

//       // Lưu total_cost nếu có trong phản hồi từ server
//       const newCost = decodedData?.json?.total_cost || 0;
//       console.log("Total Cost:", newCost);  // Debug: In ra total_cost

//       if (newCost > 0) {
//         // Gửi yêu cầu cập nhật chi phí lên server
//         await axios.post(
//           "https://memmomind-be-ycwv.onrender.com/api/user/update-cost",
//           {
//             userId: currentUser.user._id,
//             newCost: newCost,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );
//         console.log("Total cost saved:", newCost);
//         // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
//         if (currentUser?.user?.role === "freeVersion") {
//           dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
//         } else if (currentUser?.user?.role === "costVersion") {
//           dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
//         }
//       }

//     } catch (error) {
//       console.error("Error generating flashcard:", error);
//       toast.error("Có lỗi xảy ra khi tạo flashcard!");  // Thông báo lỗi
//     } finally {
//       setLoadingState({ isLoading: false, action: "" });  // Đặt lại trạng thái tải
//     }
//   };

//   // Hàm giải bài tập
//   const handleGenerateSolve = async () => {
//     if (!fileContent.trim() && !uploadedFile) {
//       toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo solve!");
//       return;
//     }

//     setLoadingState({ isLoading: true, action: "solve" });

//     try {
//       let payload = { userId: currentUser.user._id };

//       // Kiểm tra tệp được tải lên
//       if (uploadedFile) {
//         if (uploadedFile.type === "text/plain") {
//           const text = await uploadedFile.text();
//           payload.text = text;
//         } else {
//           const base64String = await convertFileToBase64(uploadedFile);
//           payload.file = base64String;
//           payload.fileType = uploadedFile.type;
//           payload.fileName = uploadedFile.name;
//         }
//       } else {
//         payload.text = fileContent;
//       }

//       // Gửi yêu cầu đến API giải bài tập
//       const response = await axios.post(
//         "http://vietserver.ddns.net:6082/ommi-solver",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//           responseType: "blob", // Nhận phản hồi dưới dạng blob
//         }
//       );

//       // Giải mã phản hồi nhận được từ server
//       const arrayBuffer = await response.data.arrayBuffer();
//       const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

//       console.log("Decoded Data:", decodedData);  // Debug: Kiểm tra dữ liệu trả về

//       // Lấy dữ liệu giải bài tập từ phản hồi
//       const solveResponse = decodedData?.json?.omniSolver || "Không thể giải bài tập.";
//       setSolve(solveResponse);  // Cập nhật trạng thái hiển thị giải bài tập

//       // Lưu total_cost nếu có trong phản hồi từ server
//       const newCost = decodedData?.json?.total_cost || 0;
//       console.log("Total Cost:", newCost);  // Debug: In ra total_cost

//       if (newCost > 0) {
//         // Gửi yêu cầu cập nhật chi phí lên server
//         await axios.post(
//           "https://memmomind-be-ycwv.onrender.com/api/user/update-cost",
//           {
//             userId: currentUser.user._id,
//             newCost: newCost,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );
//         console.log("Total cost saved:", newCost);
//         // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
//         if (currentUser?.user?.role === "freeVersion") {
//           dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
//         } else if (currentUser?.user?.role === "costVersion") {
//           dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
//         }
//       }

//     } catch (error) {
//       console.error("Error solving:", error.message);
//       toast.error("Có lỗi xảy ra khi giải bài tập!");  // Thông báo lỗi
//     } finally {
//       setLoadingState({ isLoading: false, action: "" });  // Đặt lại trạng thái tải
//     }
//   };



//   const handleGeneratePowerpoint = async () => {
//     if (!fileContent.trim() && !uploadedFile) {
//       toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo PowerPoint!");
//       return;
//     }

//     setLoadingState({ isLoading: true, action: "powerpoint" });

//     try {
//       let payload = { userId: currentUser.user._id, text: fileContent };

//       if (uploadedFile) {
//         const base64String = await convertFileToBase64(uploadedFile);
//         payload.file = base64String;
//         payload.fileType = uploadedFile.type;
//         payload.fileName = uploadedFile.name;
//       }

//       // Gửi yêu cầu API để tạo PowerPoint
//       const response = await axios.post(
//         "http://vietserver.ddns.net:6082/powpoint-create",
//         payload,
//         {
//           headers: { "Content-Type": "application/json" },
//           responseType: "blob",
//         }
//       );

//       const arrayBuffer = await response.data.arrayBuffer();
//       const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

//       const jsonData = decodedData.json;
//       let contentType = jsonData?.metadata?.content_type || "application/pdf";
//       let filename = jsonData?.metadata?.filename || "unknown.pdf";
//       let pptxPath = jsonData?.powpointPath || "";

//       let pdfUrl = null;

//       // Nếu có dữ liệu file, tạo URL cho PDF
//       if (decodedData.file) {
//         const pdfBlob = new Blob([decodedData.file], { type: contentType });
//         pdfUrl = URL.createObjectURL(pdfBlob);
//       }

//       // Nếu có đường dẫn PowerPoint, lưu lại
//       if (pptxPath) {
//         setPptxFilename(pptxPath);
//       }

//       // Mở PDF nếu có
//       if (pdfUrl) {
//         window.open(pdfUrl, "_blank");
//       } else {
//         console.error("❌ Không thể mở PDF vì pdfUrl là null");
//       }

//       console.log("Decoded Data:", decodedData);

//       // Hiển thị preview PowerPoint
//       setPowerpointPreview((prev) => ({
//         ...prev,
//         url: pdfUrl,
//         filename: filename,
//       }));

//       // Lưu total_cost nếu có trong phản hồi từ server
//       const newCost = decodedData?.json?.total_cost || 0;
//       console.log("Total Cost:", newCost);  // Debug: In ra total_cost

//       if (newCost > 0) {
//         // Gửi yêu cầu cập nhật chi phí lên server
//         await axios.post(
//           "https://memmomind-be-ycwv.onrender.com/api/user/update-cost",
//           {
//             userId: currentUser.user._id,
//             newCost: newCost,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );
//         console.log("Total cost saved:", newCost);

//         // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
//         if (currentUser?.user?.role === "freeVersion") {
//           dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
//         } else if (currentUser?.user?.role === "costVersion") {
//           dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
//         }
//       }

//     } catch (error) {
//       console.error("Error generating PowerPoint:", error);
//       toast.error("Có lỗi xảy ra khi tạo PowerPoint!");  // Thông báo lỗi
//     } finally {
//       setLoadingState({ isLoading: false, action: "" });  // Đặt lại trạng thái tải
//     }
//   };


//   const handleDownloadPowerpoint = async () => {
//     if (!pptxFilename) {
//       toast.error("Không tìm thấy đường dẫn PowerPoint!");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://vietserver.ddns.net:6082/powpoint-download",
//         { powpointPath: pptxFilename },
//         {
//           headers: { "Content-Type": "application/json" },
//           responseType: "blob",
//         }
//       );

//       // Lưu file PowerPoint xuống máy người dùng
//       const blob = new Blob([response.data], {
//         type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//       });
//       const link = document.createElement("a");
//       link.href = URL.createObjectURL(blob);
//       link.download = "presentation.pptx";
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//     } catch (error) {
//       toast.error("Lỗi khi tải xuống PowerPoint!");
//     }
//   };

//   const handleGenerateMultipleChoice = async () => {
//     if (!fileContent.trim() && !uploadedFile) {
//       toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo câu hỏi trắc nghiệm!");
//       return;
//     }

//     setLoadingState({ isLoading: true, action: "multiplechoice" });

//     try {
//       let payload = { userId: currentUser.user._id };

//       if (uploadedFile) {
//         if (uploadedFile.type === "text/plain") {
//           const text = await uploadedFile.text();
//           payload.text = text;
//         } else {
//           const base64String = await convertFileToBase64(uploadedFile);
//           payload.file = base64String;
//           payload.fileType = uploadedFile.type;
//           payload.fileName = uploadedFile.name;
//         }
//       } else {
//         payload.text = fileContent;
//       }

//       const response = await axios.post(
//         "http://vietserver.ddns.net:6082/mul-choices",
//         payload,
//         { headers: { "Content-Type": "application/json" }, responseType: "arraybuffer" }
//       );

//       let jsonResponse;
//       try {
//         jsonResponse = msgpack.decode(new Uint8Array(response.data));
//         console.log("Decoded Response:", jsonResponse);
//       } catch (err) {
//         console.error("Lỗi giải mã MessagePack:", err);
//         return toast.error("Lỗi dữ liệu từ API, thử lại sau!");
//       }

//       let questions = jsonResponse?.json?.multipleChoices;
//       let topicMulchoice =
//         questions && typeof questions === "object" && !Array.isArray(questions)
//           ? Object.keys(questions)[0]
//           : "Không có dữ liệu";

//       // Chuyển đổi dữ liệu thành mảng nếu nó là object
//       if (questions && typeof questions === "object" && !Array.isArray(questions)) {
//         questions = Object.values(questions);
//       }

//       if (Array.isArray(questions) && questions.length > 0) {
//         setMultipleChoice(questions);
//         setCurrentChoiceIndex(0);
//         setTopicMulchoice(topicMulchoice);
//       } else {
//         toast.error("Dữ liệu MultipleChoice không hợp lệ!");
//         setMultipleChoice([]);
//       }

//       // Lưu total_cost nếu có trong phản hồi từ server
//       const newCost = jsonResponse?.json?.total_cost || 0;
//       console.log("Total Cost:", newCost);  // Debug: In ra total_cost

//       if (newCost > 0) {
//         // Gửi yêu cầu cập nhật chi phí lên server
//         await axios.post(
//           "https://memmomind-be-ycwv.onrender.com/api/user/update-cost",
//           {
//             userId: currentUser.user._id,
//             newCost: newCost,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${currentUser.token}`,
//             },
//           }
//         );
//         console.log("Total cost saved:", newCost);

//         // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
//         if (currentUser?.user?.role === "freeVersion") {
//           dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
//         } else if (currentUser?.user?.role === "costVersion") {
//           dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
//         }
//       }

//     } catch (error) {
//       console.error("Error generating multiple choice:", error);
//       toast.error("Có lỗi xảy ra khi tạo câu hỏi trắc nghiệm!");
//     } finally {
//       setLoadingState({ isLoading: false, action: "" });
//     }
//   };


//   const handleAnswerClick = (selectedAnswer) => {
//     setUserAnswers((prevAnswers) => ({
//       ...prevAnswers,
//       [currentChoiceIndex]: selectedAnswer, // Lưu đáp án theo index câu hỏi
//     }));
//     setSelectedAnswer(selectedAnswer);
//     setIsAnswerCorrect(selectedAnswer === contentMulchoice.correctAnswer);
//   };


//   const resetAllAnswers = () => {
//     setCurrentChoiceIndex(0);
//     setUserAnswers({});
//     setSelectedAnswer(null);
//     setIsAnswerCorrect(null);
//   };


//   const saveMultipleChoiceAsHTML = () => {
//     if (!multipleChoice || multipleChoice.length === 0) {
//       toast.error("Không có câu hỏi trắc nghiệm để lưu!");
//       return;
//     }

//     // Định dạng lại dữ liệu câu hỏi theo đúng cấu trúc UI trên web
//     const formattedQuestions = multipleChoice.map((questionData, index) => {
//       let topic = Object.keys(questionData).find(
//         (key) => key !== "Question" && key !== "Answer" && key !== "Wrong Answer"
//       ) || "Không có dữ liệu";

//       let content = questionData[topic] || questionData;

//       return {
//         index: index, // Đánh số câu hỏi
//         topic: topic,
//         question: content.Question[0] || "Không có dữ liệu",
//         correctAnswer: content.Answer[0] || "Không có dữ liệu",
//         wrongAnswers: content["Wrong Answer"] || [],
//       };
//     });

//     // Convert JSON thành chuỗi để nhúng vào HTML
//     const questions = JSON.stringify(formattedQuestions);

//     let multipleChoiceHTML = `
//       <!DOCTYPE html>
//       <html lang="vi">
//       <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <title>Câu hỏi trắc nghiệm</title>
//           <style>
//               body {
//                   font-family: Arial, sans-serif;
//                   background: #f4f4f4;
//                   display: flex;
//                   justify-content: center;
//                   align-items: center;
//                   height: 100vh;
//               }
//               .quiz-container {
//                   background: white;
//                   padding: 20px;
//                   border-radius: 10px;
//                   box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
//                   width: 500px;
//                   text-align: center;
//               }
//               h2 {
//                   font-size: 22px;
//                   font-weight: bold;
//               }
//               h3 {
//                   font-size: 18px;
//                   margin-top: 15px;
//               }
//               #topic {
//                   font-size: 16px;
//                   font-weight: bold;
//                   color: #007BFF;
//                   margin-bottom: 10px;
//                   text-transform: uppercase;
//               }
//               .options button {
//                   display: block;
//                   width: 100%;
//                   padding: 10px;
//                   margin: 5px 0;
//                   border: none;
//                   background: #ececec;
//                   cursor: pointer;
//                   border-radius: 5px;
//                   text-align: left;
//                   font-size: 16px;
//                   transition: 0.3s;
//               }
//               .options button:hover {
//                   background: #ddd;
//               }
//               .options button.correct {
//                   background: #28a745;
//                   color: white;
//               }
//               .options button.incorrect {
//                   background: #dc3545;
//                   color: white;
//               }
//               .navigation {
//                   display: flex;
//                   justify-content: space-between;
//                   margin-top: 15px;
//               }
//               .navigation button {
//                   background: #007BFF;
//                   color: white;
//                   padding: 10px 15px;
//                   border: none;
//                   border-radius: 5px;
//                   cursor: pointer;
//                   font-size: 16px;
//               }
//               .reset-btn {
//                   background: #dc3545;
//                   margin-top: 10px;
//                   color: white;
//                   border: none;
//                   padding: 8px;
//                   border-radius: 5px;
//                   cursor: pointer;
//                   font-size: 14px;
//               }
//               #resultMessage {
//                   margin-top: 10px;
//                   font-weight: bold;
//                   font-size: 16px;
//                   padding: 10px;
//                   border-radius: 5px;
//                   display: inline-block;
//               }
//           </style>
//       </head>
//       <body>
//           <div class="quiz-container">
//               <h2>Câu hỏi trắc nghiệm</h2>
//               <h3 id="topic"></h3>
//               <h3 id="question"></h3>
//               <div class="options" id="options"></div>
//               <p id="resultMessage"></p>
//               <div class="navigation">
//                   <button onclick="prevQuestion()">&#9664; Trước</button>
//                   <span id="counter"></span>
//                   <button onclick="nextQuestion()">Tiếp &#9654;</button>
//               </div>
//               <button class="reset-btn" onclick="resetQuiz()">Thử lại toàn bộ câu hỏi</button>
//           </div>
          
//           <script>
//               let questions = ${questions};
//               let currentQuestionIndex = 0;
//               let userAnswers = {}; // Lưu nội dung đáp án người dùng chọn
  
//               function loadQuestion() {
//                   let questionData = questions[currentQuestionIndex];
//                   let { topic, question, correctAnswer, wrongAnswers } = questionData;
  
//                   // Đảo ngẫu nhiên vị trí đáp án
//                   let answers = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
//                   let labels = ["A", "B", "C", "D"];
  
//                   document.getElementById("topic").innerText = topic.toUpperCase();
//                   document.getElementById("question").innerText = question;
  
//                   document.getElementById("options").innerHTML = answers.map((answer, index) => 
//                       \`<button onclick="checkAnswer(this, '\${answer}', '\${correctAnswer}')"
//                           id="btn-\${index}">\${labels[index]}. \${answer}
//                       </button>\`
//                   ).join("");
  
//                   document.getElementById("counter").innerText = (currentQuestionIndex + 1) + " / " + questions.length;
//                   document.getElementById("resultMessage").innerText = "";
  
//                   // Kiểm tra nếu người dùng đã chọn trước đó
//                   if (userAnswers[currentQuestionIndex] !== undefined) {
//                       let selectedAnswer = userAnswers[currentQuestionIndex];
//                       let buttons = document.querySelectorAll(".options button");
  
//                       buttons.forEach((btn) => {
//                           if (btn.innerText.includes(selectedAnswer)) {
//                               btn.classList.add(selectedAnswer === correctAnswer ? "correct" : "incorrect");
//                           }
//                           if (btn.innerText.includes(correctAnswer)) {
//                               btn.classList.add("correct");
//                           }
//                           btn.disabled = true;
//                       });
//                   }
//               }
  
//               function checkAnswer(button, selectedAnswer, correctAnswer) {
//                   let buttons = document.querySelectorAll(".options button");
//                   if (userAnswers[currentQuestionIndex] !== undefined) return; // Chỉ chọn 1 lần
  
//                   userAnswers[currentQuestionIndex] = selectedAnswer;
//                   buttons.forEach(btn => btn.disabled = true);
  
//                   if (selectedAnswer === correctAnswer) {
//                       button.classList.add("correct");
//                       document.getElementById("resultMessage").innerText = "✅ Đáp án đúng!";
//                   } else {
//                       button.classList.add("incorrect");
//                       buttons.forEach(b => {
//                           if (b.innerText.includes(correctAnswer)) {
//                               b.classList.add("correct");
//                           }
//                       });
//                       document.getElementById("resultMessage").innerText = "❌ Đáp án đúng là: " + correctAnswer;
//                   }
//               }
  
//               function nextQuestion() {
//                   currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
//                   loadQuestion();
//               }
  
//               function prevQuestion() {
//                   currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
//                   loadQuestion();
//               }
  
//               function resetQuiz() {
//                   currentQuestionIndex = 0;
//                   userAnswers = {};
//                   loadQuestion();
//               }
              
//               loadQuestion();
//           </script>
//       </body>
//       </html>
//     `;

//     const blob = new Blob([multipleChoiceHTML], { type: "text/html" });
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "multiple_choice.html";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   return (
//     <>
//       {userInfo ? (
//         <Navbar
//           userInfo={userInfo}
//           onSearchNote={onSearchNote}
//           handleClearSearch={handleClearSearch}
//         />
//       ) : (
//         <p>Loading...</p>
//       )}

//       <div className="flex h-screen" style={{ overflow: "hidden" }}>
//         {/* Left Sidebar */}
//         <LeftSidebar 
//           isSidebarOpen={isSidebarOpen}
//           setIsSidebarOpen={setIsSidebarOpen}
//           handleShowAllNotes={handleShowAllNotes}
//           handleAddNote={handleAddNote}
//           handleShowPinned={handleShowPinned}
//           handleShowDeleted={handleShowDeleted}
//           isSearch={isSearch}
//           showPinned={showPinned}
//           showDeleted={showDeleted}
//           showAllNotes={showAllNotes}
//           allNotes={allNotes}
//           pinnedNotes={pinnedNotes}
//           deletedNotes={deletedNotes}
//           handleEdit={handleEdit}
//           moveToTrash={moveToTrash}
//           updateIsPinned={updateIsPinned}
//           handleShowNote={handleShowNote}
//           restoreNote={restoreNote}
//           permanentlyDeleteNote={permanentlyDeleteNote}
//         />

//         {/* Main Content */}
//         <MainContent 
//           isSidebarOpen={isSidebarOpen}
//           isRightSidebarOpen={isRightSidebarOpen}
//           isManuallyClosed={isManuallyClosed}
//           formKey={formKey}
//           noteData={noteData}
//           addEditType={addEditType}
//           setNoteData={setNoteData}
//           setAddEditType={setAddEditType}
//           setIsManuallyClosed={setIsManuallyClosed}
//           handleAddNoteSuccess={handleAddNoteSuccess}
//           setFormKey={setFormKey}
//           getAllNotes={getAllNotes}
//           amount={amount}
//           setAmount={setAmount}
//           handlePayment={handlePayment}
//           summary={summary}
//           setSummary={setSummary}
//           solve={solve}
//           setSolve={setSolve}
//           handleAddNote={handleAddNote}
//         />

//         {/* Right Sidebar */}
//         <RightSidebar
//           isRightSidebarOpen={isRightSidebarOpen}
//           setIsRightSidebarOpen={setIsRightSidebarOpen}
//           userInfo={userInfo}
//           fileContent={fileContent}
//           handleChange={handleChange}
//           handleFileUpload={handleFileUpload}
//           handleRemoveFile={handleRemoveFile}
//           pdfUrl={pdfUrl}
//           imageSrc={imageSrc}
//           charCount={charCount}
//           loadingState={loadingState}
//           handleSummarize={handleSummarize}
//           handleGenerateMindmap={handleGenerateMindmap}
//           handleGenerateFlashCard={handleGenerateFlashCard}
//           handleGenerateSolve={handleGenerateSolve}
//           handleGeneratePowerpoint={handleGeneratePowerpoint}
//           handleGenerateMultipleChoice={handleGenerateMultipleChoice}
//         />
        
//         {/* Các component hiển thị kết quả */}
//         {summary && <Summarize summary={summary} setSummary={setSummary} handleAddNote={handleAddNote} />}
//         {mindmapHtml && <Mindmap mindmapHtml={mindmapHtml} setMindmapHtml={setMindmapHtml} />}
//         {flashcard && <Flashcard 
//           flashcard={flashcard} 
//           setFlashCard={setFlashCard} 
//           currentIndex={currentIndex}
//           setCurrentIndex={setCurrentIndex}
//           isFlipped={isFlipped}
//           setIsFlipped={setIsFlipped}
//           topic={topic}
//           content={content}
//           handleNext={handleNext}
//           handlePrev={handlePrev}
//           saveFlashcardAsHTML={saveFlashcardAsHTML}
//         />}
//         {solve && <Solve solve={solve} setSolve={setSolve} handleAddNote={handleAddNote} />}
//         {powerpointPreview && <PowerPoint 
//           powerpointPreview={powerpointPreview} 
//           setPowerpointPreview={setPowerpointPreview} 
//           handleDownloadPowerpoint={handleDownloadPowerpoint} 
//         />}
//         {multipleChoice && multipleChoice.length > 0 && (
//           <MultipleChoice 
//             text={fileContent}
//             topic={topicMulchoice}
//             setMultipleChoice={setMultipleChoice}
//             currentChoiceIndex={currentChoiceIndex}
//             setCurrentChoiceIndex={setCurrentChoiceIndex}
//             isTransitioning={isTransitioning}
//             setIsTransitioning={setIsTransitioning}
//             selectedAnswer={selectedAnswer}
//             setSelectedAnswer={setSelectedAnswer}
//           />
//         )}
//       </div>
//       <ChatbaseWidget />
//     </>
//   );
// };

// export default Home;
