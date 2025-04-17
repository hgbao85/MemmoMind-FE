// src/pages/FlashcardsPage.jsx
import TextInput from '../../components/Sidebar/TextInput';
import Sidebar from '../../components/Sidebar/Sidebar';
import { useState } from 'react';
import Footer from '../../components/Footer/Footer';

const FlashcardsPage = () => {
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
                            <h2 className="text-xl font-bold mb-2">Flashcards</h2>
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

export default FlashcardsPage;



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