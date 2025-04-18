/* eslint-disable no-unused-vars */
// src/pages/PowerPointPage.jsx
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
import PowerPoint from '../../components/Sidebar/PowerPoint';
import PaymentModal from '../../components/PaymentModal.jsx/PaymentModal';
import Footer from '../../components/Footer/Footer';
import Header from '../../components/Header/Header';

const PowerPointPage = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [fileContent, setFileContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [pdfUrl, setPdfUrl] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const initialUserCheck = useRef(false);
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [powerpointPreview, setPowerpointPreview] = useState("");
    const dispatch = useDispatch();
    const [uploadedFile, setUploadedFile] = useState(null);
    const [pptxFilename, setPptxFilename] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const isPopupOpen = useSelector((state) => state.payment.isPopupOpen);
    const [amount, setAmount] = useState(1000);
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

    const handleGeneratePowerpoint = async () => {
        if (!fileContent.trim() && !uploadedFile) {
            toast.error("Vui lòng nhập văn bản hoặc tải lên tệp trước khi tạo PowerPoint!");
            return;
        }
        setIsLoading(true);
        try {
            let payload = { userId: currentUser.user._id, text: fileContent };

            if (uploadedFile) {
                const base64String = await convertFileToBase64(uploadedFile);
                payload.file = base64String;
                payload.fileType = uploadedFile.type;
                payload.fileName = uploadedFile.name;
            }

            // Gửi yêu cầu API để tạo PowerPoint
            const response = await axios.post(
                "http://localhost:6082/powpoint-create",
                payload,
                {
                    headers: { "Content-Type": "application/json" },
                    responseType: "blob",
                }
            );

            const arrayBuffer = await response.data.arrayBuffer();
            const decodedData = msgpack.decode(new Uint8Array(arrayBuffer));

            const jsonData = decodedData.json;
            let contentType = jsonData?.metadata?.content_type || "application/pdf";
            let filename = jsonData?.metadata?.filename || "unknown.pdf";
            let pptxPath = jsonData?.powpointPath || "";

            let pdfUrl = null;

            // Nếu có dữ liệu file, tạo URL cho PDF
            if (decodedData.file) {
                const pdfBlob = new Blob([decodedData.file], { type: contentType });
                pdfUrl = URL.createObjectURL(pdfBlob);
            }

            // Nếu có đường dẫn PowerPoint, lưu lại
            if (pptxPath) {
                setPptxFilename(pptxPath);
            }

            // Mở PDF nếu có
            if (pdfUrl) {
                window.open(pdfUrl, "_blank");
            } else {
                console.error("❌ Không thể mở PDF vì pdfUrl là null");
            }

            console.log("Decoded Data:", decodedData);

            // Hiển thị preview PowerPoint
            setPowerpointPreview((prev) => ({
                ...prev,
                url: pdfUrl,
                filename: filename,
            }));

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
            console.error("Error generating PowerPoint:", error);
            toast.error("Có lỗi xảy ra khi tạo PowerPoint!");  // Thông báo lỗi
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPowerpoint = async () => {
        if (!pptxFilename) {
            toast.error("Không tìm thấy đường dẫn PowerPoint!");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:6082/powpoint-download",
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
                        handleGeneratePowerpoint={handleGeneratePowerpoint}
                        isLoading={isLoading}
                    />
                    {powerpointPreview && <PowerPoint
                        powerpointPreview={powerpointPreview}
                        setPowerpointPreview={setPowerpointPreview}
                        handleDownloadPowerpoint={handleDownloadPowerpoint}
                    />}
                </div>
                <div className="m-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
                    <Footer userInfo={userInfo} />
                </div>
            </div>
        </div>
    );
};

export default PowerPointPage;