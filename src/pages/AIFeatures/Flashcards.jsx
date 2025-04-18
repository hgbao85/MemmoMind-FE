/* eslint-disable no-unused-vars */
// src/pages/FlashcardsPage.jsx
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
import Flashcard from "../../components/Sidebar/Flashcard";
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

const FlashcardsPage = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [fileContent, setFileContent] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const initialUserCheck = useRef(false);
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [flashcard, setFlashCard] = useState("");
  const dispatch = useDispatch();
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const [noteData, setNoteData] = useState(null);
  const [addEditType, setAddEditType] = useState("add");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const topic =
    flashcard.length > 0 && currentIndex < flashcard.length
      ? Object.keys(flashcard[currentIndex])[0]
      : "";
  const content =
    flashcard.length > 0 && currentIndex < flashcard.length
      ? flashcard[currentIndex][topic]
      : null;
  const [isTransitioning, setIsTransitioning] = useState(false);


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

  useEffect(() => {
    if (!userInfo) return;

    if (userInfo.role === "freeVersion") {
      if (userInfo.totalFreeCost !== 0 && userInfo.freeCost !== undefined) {
        const percentage = (userInfo.freeCost / userInfo.totalFreeCost) * 100;
        setProgress(Math.min(percentage, 100));
      }
    } else if (userInfo.role === "costVersion") {
      if (userInfo.totalPurchasedCost !== 0 && userInfo.totalCost !== undefined) {
        const percentage = (userInfo.totalCost / userInfo.totalPurchasedCost) * 100;
        setProgress(Math.min(percentage, 100));
      }
    }
  }, [userInfo]);

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

  const handleGenerateFlashCard = async () => {
    if (!fileContent.trim() && !uploadedFile) {
      toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo flashcard!");
      return;
    }
    setIsLoading(true);
    try {
      let payload = { userId: currentUser.user._id };

      // Kiểm tra tệp được tải lên
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

      // Gửi yêu cầu đến API tạo flashcard
      const response = await axios.post(
        "http://localhost:6082/flashcard",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob", // Nhận phản hồi dưới dạng blob
        }
      );

      // Giải mã phản hồi nhận được từ server
      const arrayBuffer = await response.data.arrayBuffer();
      const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

      console.log("Decoded Data:", decodedData);  // Debug: Kiểm tra dữ liệu trả về

      // Lấy danh sách flashcards từ dữ liệu đã giải mã
      const flashcardData = decodedData?.json?.flashcard || [];

      // Kiểm tra nếu dữ liệu hợp lệ và có flashcards
      if (Array.isArray(flashcardData) && flashcardData.length > 0) {
        setFlashCard(flashcardData);  // Cập nhật trạng thái hiển thị flashcards
        setCurrentIndex(0);  // Đặt chỉ số hiện tại về 0
      } else {
        toast.error("Dữ liệu flashcard không hợp lệ!");  // Thông báo lỗi nếu dữ liệu không hợp lệ
        setFlashCard([]);  // Đảm bảo không có flashcard nào hiển thị
      }

      // Lưu total_cost nếu có trong phản hồi từ server
      const newCost = decodedData?.json?.total_cost || 0;
      console.log("Total Cost:", newCost);  // Debug: In ra total_cost

      if (newCost > 0) {
        // Gửi yêu cầu cập nhật chi phí lên server
        await axios.post(
          "https://memmomind-be-ycwv.onrender.com/api/user/update-cost",
          {
            userId: currentUser.user._id,
            newCost: newCost,
          },
          {
            headers: {
              Authorization: `Bearer ${currentUser.token}`,
            },
          }
        );
        console.log("Total cost saved:", newCost);
        // Cập nhật cost trong Redux store để cập nhật thanh tiến trình
        if (currentUser?.user?.role === "freeVersion") {
          dispatch(updateUserCost((currentUser?.user?.freeCost || 0) + newCost));
        } else if (currentUser?.user?.role === "costVersion") {
          dispatch(updateUserCost((currentUser?.user?.totalCost || 0) + newCost));
        }
      }

    } catch (error) {
      console.error("Error generating flashcard:", error);
      toast.error("Có lỗi xảy ra khi tạo flashcard!");  // Thông báo lỗi
    } finally {
      setIsLoading(false);
    }
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header progress={progress} />
        <div className="flex-1 overflow-auto p-4">
          <TextInput
            fileContent={fileContent}
            handleChange={handleChange}
            handleFileUpload={handleFileUpload}
            handleRemoveFile={handleRemoveFile}
            pdfUrl={pdfUrl}
            imageSrc={imageSrc}
            charCount={charCount}
            handleGenerateFlashCard={handleGenerateFlashCard}
            isLoading={isLoading}
          />
          {flashcard && <Flashcard
            flashcard={flashcard}
            setFlashCard={setFlashCard}
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            topic={topic}
            content={content}
            handleNext={handleNext}
            handlePrev={handlePrev}
            isTransitioning={isTransitioning}
            saveFlashcardAsHTML={saveFlashcardAsHTML}
          />}
        </div>
        <div className="m-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
          <Footer userInfo={userInfo} />
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;