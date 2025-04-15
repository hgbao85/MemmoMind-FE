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
    const [isManuallyClosed, setIsManuallyClosed] = useState(false);
    const [noteData, setNoteData] = useState(null);
    const [addEditType, setAddEditType] = useState("add");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [currentChoiceIndex, setCurrentChoiceIndex] = useState(0);
    const [topicMulchoice, setTopicMulchoice] = useState("");
    const [multipleChoice, setMultipleChoice] = useState([]);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);


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
            alert("Chỉ hỗ trợ các định dạng file: .txt, .pdf, .jpg, .png");
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
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-2">MultipleChoice</h2>
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
                        handleGenerateMultipleChoice={handleGenerateMultipleChoice}
                        isSubmitting={isSubmitting}
                    />
                </div>
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

            {multipleChoice && multipleChoice.length > 0 && (
                <MultipleChoice
                    text={fileContent}
                    topic={topicMulchoice}
                    setMultipleChoice={setMultipleChoice}
                    currentChoiceIndex={currentChoiceIndex}
                    setCurrentChoiceIndex={setCurrentChoiceIndex}
                    isTransitioning={isTransitioning}
                    setIsTransitioning={setIsTransitioning}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                />
            )}
        </div>
    );
};

export default MultipleChoicePage;
