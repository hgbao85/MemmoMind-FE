/* eslint-disable no-unused-vars */
// src/pages/MultipleChoicePage.jsx
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
import MultipleChoice from '../../components/Sidebar/MultipleChoice';
import Footer from '../../components/Footer/Footer';
import { useMemo } from "react";
import Header from '../../components/Header/Header';

const MultipleChoicePage = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [fileContent, setFileContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [pdfUrl, setPdfUrl] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const initialUserCheck = useRef(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const dispatch = useDispatch();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
    const [topicMulchoice, setTopicMulchoice] = useState("");
    const [multipleChoice, setMultipleChoice] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [shuffledAnswers, setShuffledAnswers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

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

        if (file.type === "text/plain") {
            reader.onload = (e) => {
                let content = e.target.result;

                // Loại bỏ các ký tự xuống dòng
                content = content.replace(/\r?\n/g, "");

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

    const handleGenerateMultipleChoice = async () => {
        if (!fileContent.trim() && !uploadedFile) {
            toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo câu hỏi trắc nghiệm!");
            return;
        }
        setIsLoading(true);
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
                "http://localhost:6082/mul-choices",
                payload,
                { headers: { "Content-Type": "application/json" }, responseType: "arraybuffer" }
            );

            let jsonResponse;
            try {
                jsonResponse = msgpack.decode(new Uint8Array(response.data));
                console.log("Decoded Response:", jsonResponse);
            } catch (err) {
                console.error("Lỗi giải mã MessagePack:", err);
                return toast.error("Lỗi dữ liệu từ API, thử lại sau!");
            }

            let questions = jsonResponse?.json?.multipleChoices;
            let topicMulchoice =
                questions && typeof questions === "object" && !Array.isArray(questions)
                    ? Object.keys(questions)[0]
                    : "Không có dữ liệu";

            // Chuyển đổi dữ liệu thành mảng nếu nó là object
            if (questions && typeof questions === "object" && !Array.isArray(questions)) {
                questions = Object.values(questions);
            }

            if (Array.isArray(questions) && questions.length > 0) {
                setMultipleChoice(questions);
                setCurrentChoiceIndex(0);
                setTopicMulchoice(topicMulchoice);
            } else {
                toast.error("Dữ liệu MultipleChoice không hợp lệ!");
                setMultipleChoice([]);
            }

            // Lưu total_cost nếu có trong phản hồi từ server
            const newCost = jsonResponse?.json?.total_cost || 0;
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
            console.error("Error generating multiple choice:", error);
            toast.error("Có lỗi xảy ra khi tạo câu hỏi trắc nghiệm!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (multipleChoice.length > 0 && currentChoiceIndex < multipleChoice.length) {
            const currentQuestionObj = multipleChoice[currentChoiceIndex];
            const topicKey = Object.keys(currentQuestionObj)[0]; // Lấy chủ đề của câu hỏi hiện tại
            setTopicMulchoice(topicKey || "Không có dữ liệu");
        } else {
            setTopicMulchoice("Không có dữ liệu");
        }
    }, [multipleChoice, currentChoiceIndex]);

    const shuffleAnswers = (correctAnswer, wrongAnswers) => {
        let options = [...wrongAnswers, correctAnswer]; // Thêm cả câu đúng
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]]; // Hoán đổi ngẫu nhiên
        }
        return options;
    };

    const currentQuestionData =
        multipleChoice.length > 0 && currentChoiceIndex < multipleChoice.length
            ? multipleChoice[currentChoiceIndex]
            : null;

    const contentMulchoice = useMemo(() => {
        if (!currentQuestionData) {
            return {
                question: "Không có dữ liệu",
                correctAnswer: "Không có dữ liệu",
                wrongAnswers: [],
            };
        }
        const topicKey = Object.keys(currentQuestionData)[0]; // Lấy chủ đề hiện tại
        const questionData = currentQuestionData[topicKey] || {}; // Lấy dữ liệu câu hỏi
        return {
            question: questionData.Question?.[0] || "Không có dữ liệu",
            correctAnswer: questionData.Answer?.[0] || "Không có dữ liệu",
            wrongAnswers: questionData["Wrong Answer"] || [],
        };
    }, [currentQuestionData]);

    useEffect(() => {
        if (contentMulchoice.correctAnswer !== "Không có dữ liệu") {
            setShuffledAnswers(shuffleAnswers(contentMulchoice.correctAnswer, contentMulchoice.wrongAnswers));
        }
    }, [contentMulchoice]);


    useEffect(() => {
        const previousAnswer = userAnswers[currentChoiceIndex] || null;
        setSelectedAnswer(previousAnswer);
        setIsAnswerCorrect(previousAnswer === contentMulchoice.correctAnswer);
    }, [currentChoiceIndex, contentMulchoice, userAnswers]);

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

        // Định dạng lại dữ liệu câu hỏi theo đúng cấu trúc UI trên web
        const formattedQuestions = multipleChoice.map((questionData, index) => {
            let topic = Object.keys(questionData).find(
                (key) => key !== "Question" && key !== "Answer" && key !== "Wrong Answer"
            ) || "Không có dữ liệu";

            let content = questionData[topic] || questionData;

            return {
                index: index, // Đánh số câu hỏi
                topic: topic,
                question: content.Question[0] || "Không có dữ liệu",
                correctAnswer: content.Answer[0] || "Không có dữ liệu",
                wrongAnswers: content["Wrong Answer"] || [],
            };
        });

        // Convert JSON thành chuỗi để nhúng vào HTML
        const questions = JSON.stringify(formattedQuestions);

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
                  let { topic, question, correctAnswer, wrongAnswers } = questionData;
  
                  // Đảo ngẫu nhiên vị trí đáp án
                  let answers = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
                  let labels = ["A", "B", "C", "D"];
  
                  document.getElementById("topic").innerText = topic.toUpperCase();
                  document.getElementById("question").innerText = question;
  
                  document.getElementById("options").innerHTML = answers.map((answer, index) => 
                      \`<button onclick="checkAnswer(this, '\${answer}', '\${correctAnswer}')"
                          id="btn-\${index}">\${labels[index]}. \${answer}
                      </button>\`
                  ).join("");
  
                  document.getElementById("counter").innerText = (currentQuestionIndex + 1) + " / " + questions.length;
                  document.getElementById("resultMessage").innerText = "";
  
                  // Kiểm tra nếu người dùng đã chọn trước đó
                  if (userAnswers[currentQuestionIndex] !== undefined) {
                      let selectedAnswer = userAnswers[currentQuestionIndex];
                      let buttons = document.querySelectorAll(".options button");
  
                      buttons.forEach((btn) => {
                          if (btn.innerText.includes(selectedAnswer)) {
                              btn.classList.add(selectedAnswer === correctAnswer ? "correct" : "incorrect");
                          }
                          if (btn.innerText.includes(correctAnswer)) {
                              btn.classList.add("correct");
                          }
                          btn.disabled = true;
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
                  } else {
                      button.classList.add("incorrect");
                      buttons.forEach(b => {
                          if (b.innerText.includes(correctAnswer)) {
                              b.classList.add("correct");
                          }
                      });
                      document.getElementById("resultMessage").innerText = "❌ Đáp án đúng là: " + correctAnswer;
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
                        handleGenerateMultipleChoice={handleGenerateMultipleChoice}
                        isSubmitting={isSubmitting}
                        isLoading={isLoading}
                    />
                    {multipleChoice && multipleChoice.length > 0 && (
                        <MultipleChoice
                            topic={topicMulchoice}
                            setMultipleChoice={setMultipleChoice}
                            currentChoiceIndex={currentChoiceIndex}
                            setCurrentChoiceIndex={setCurrentChoiceIndex}
                            isTransitioning={isTransitioning}
                            setIsTransitioning={setIsTransitioning}
                            selectedAnswer={selectedAnswer}
                            setSelectedAnswer={setSelectedAnswer}
                            handlePrevmulchoice={() => setCurrentChoiceIndex((prev) => Math.max(prev - 1, 0))}
                            handleNextmulchoice={() => setCurrentChoiceIndex((prev) => Math.min(prev + 1, multipleChoice.length - 1))}
                            saveMultipleChoiceAsHTML={saveMultipleChoiceAsHTML}
                            multipleChoice={multipleChoice}
                            shuffledAnswers={shuffledAnswers}
                            isAnswerCorrect={isAnswerCorrect}
                            handleAnswerClick={handleAnswerClick}
                            resetAllAnswers={resetAllAnswers}
                            contentMulchoice={contentMulchoice}
                            userAnswers={userAnswers}
                            setUserAnswers={setUserAnswers}
                        />
                    )}
                </div>

                <div className="m-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
                    <Footer />
                </div>
            </div>
        </div>
    );
};

export default MultipleChoicePage;
