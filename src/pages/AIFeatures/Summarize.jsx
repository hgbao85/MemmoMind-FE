/* eslint-disable no-unused-vars */
// src/pages/SummarizePage.jsx
import TextInput from '../../components/Sidebar/TextInput';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState, useRef, useEffect } from 'react';
import { toast } from "react-toastify";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import * as msgpack from "@msgpack/msgpack";
import { updateUserCost } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import Summarize from '../../components/Sidebar/Summarize';
import Footer from '../../components/Footer/Footer';

const SummarizePage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fileContent, setFileContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const initialUserCheck = useRef(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [summary, setSummary] = useState("");
  const dispatch = useDispatch();
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const [noteData, setNoteData] = useState(null);
  const [addEditType, setAddEditType] = useState("add");
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    if (!initialUserCheck.current) {
      initialUserCheck.current = true;
      if (!currentUser) {
        navigate("/");
      } else {
        getUserInfo();
      }
    }
  }, [currentUser, navigate]);

  const getUserInfo = async () => {
    try {
      const res = await api.get("https://memmomind-be-ycwv.onrender.com/api/user/current", {
        withCredentials: true,
      });

      if (!res.data.success) {
        toast.error("Không thể lấy thông tin người dùng!");
        return;
      }

      setUserInfo(res.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
      toast.error("Lỗi khi lấy thông tin người dùng!");
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setFileContent(value);
    setCharCount(value.length);
    setPdfUrl('');
    setImageSrc('');
  };

  const handleRemoveFile = () => {
    setFileContent('');
    setPdfUrl('');
    setImageSrc('');
    setCharCount(0);
  };

  const handleAddNote = (note = { title: "", content: "" }) => {
    setIsManuallyClosed(false);
    setNoteData(note);
    setAddEditType("add");
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

    if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setImageSrc(imageUrl);
      setPdfUrl(null);
    } else if (file.type === "application/pdf") {
      const pdfUrl = URL.createObjectURL(file);
      setPdfUrl(pdfUrl);
      setImageSrc(null);
    } else {
      alert("Chỉ hỗ trợ các định dạng file: .pdf, .jpg, .png");
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
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

      const response = await axios.post(
        "http://vietserver.ddns.net:6082/summarize",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      const arrayBuffer = await response.data.arrayBuffer();
      const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

      console.log("Decoded Data:", decodedData);

      // Lấy dữ liệu từ `decodedData.json`
      const summaryText = decodedData?.json?.summarize || "Không thể tạo tóm tắt.";
      setSummary(summaryText);

      const newCost = decodedData?.json?.total_cost || 0;

      // Gửi total_cost về BE để lưu vào model User
      if (newCost > 0 && currentUser?.user?._id && currentUser?.token) {
        await axios.post("https://memmomind-be-ycwv.onrender.com/api/user/update-cost", {
          userId: currentUser.user._id,
          newCost: newCost,
        },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          });
        console.log("Total cost saved:", newCost);

        // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
        if (currentUser?.user?.role === "freeVersion") {
          dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
        } else if (currentUser?.user?.role === "costVersion") {
          dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
        }
      }
    } catch (error) {
      console.error("Error summarizing:", error.message);
      toast.error("Có lỗi xảy ra khi tóm tắt!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="m-4 p-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Tạo tóm tắt</h2>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          <TextInput
            fileContent={fileContent}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            pdfUrl={pdfUrl}
            imageSrc={imageSrc}
            charCount={charCount}
            handleSummarize={handleSummarize}
          />
          {summary && <Summarize summary={summary} setSummary={setSummary} handleAddNote={handleAddNote} />}
        </div>
        <div className="m-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SummarizePage;
