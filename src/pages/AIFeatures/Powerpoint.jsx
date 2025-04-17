// src/pages/PowerPointPage.jsx
import TextInput from '../../components/Sidebar/TextInput';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState } from 'react';
import Footer from '../../components/Footer/Footer';

const PowerPointPage = () => {
    const [fileContent, setFileContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [pdfUrl, setPdfUrl] = useState('');
    const [imageSrc, setImageSrc] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setFileContent(value);
        setCharCount(value.length);
        setPdfUrl('');
        setImageSrc('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        if (file.type === 'application/pdf') {
            const url = URL.createObjectURL(file);
            setPdfUrl(url);
            setFileContent('');
            setImageSrc('');
            setCharCount(0);
        } else if (file.type.startsWith('image/')) {
            const url = URL.createObjectURL(file);
            setImageSrc(url);
            setFileContent('');
            setPdfUrl('');
            setCharCount(0);
        } else {
            reader.onload = (event) => {
                const text = event.target.result;
                setFileContent(text);
                setCharCount(text.length);
                setPdfUrl('');
                setImageSrc('');
            };
            reader.readAsText(file);
        }
    };

    const handleRemoveFile = () => {
        setFileContent('');
        setPdfUrl('');
        setImageSrc('');
        setCharCount(0);
    };
    return (

        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="p-4 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold mb-2">PowerPoint</h2>
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
                    />
                </div>
                <div>
                    <Footer />
                </div>
            </div>
        </div>

    );
};

export default PowerPointPage;





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