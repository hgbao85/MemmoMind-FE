// src/pages/MindmapPage.jsx
import TextInput from '../../components/Sidebar/TextInput';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState } from 'react';
import Footer from '../../components/Footer/Footer';

const MindmapPage = () => {
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
                            <h2 className="text-xl font-bold mb-2">Mindmap</h2>
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

export default MindmapPage;




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