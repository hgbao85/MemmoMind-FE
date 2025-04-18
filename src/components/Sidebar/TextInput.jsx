'use client'; // Đảm bảo chạy trong client component
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { MdOutlineFileUpload, MdOpenInNew, MdClose } from 'react-icons/md';
import { useState, useRef } from 'react';
import { Oval } from 'react-loader-spinner';

const TextInput = ({
  fileContent,
  handleChange,
  handleFileUpload,
  handleRemoveFile,
  handleSummarize,
  handleGenerateMultipleChoice,
  handleGenerateSolve,
  handleGenerateMindmap,
  handleGenerateFlashCard,
  handleGeneratePowerpoint,
  pdfUrl,
  imageSrc,
  charCount,
  isLoading,
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  const [isDragDropVisible, setDragDropVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef(null);
  const fileInputRef = useRef(null);
  const isDisabled = !fileContent && !pdfUrl && !imageSrc;

  const handleSubmit = () => {
    if (pathname.includes('/summarize') && handleSummarize) {
      handleSummarize();
    } else if (pathname.includes('/multiplechoice') && handleGenerateMultipleChoice) {
      handleGenerateMultipleChoice();
    } else if (pathname.includes('/solve') && handleGenerateSolve) {
      handleGenerateSolve();
    } else if (pathname.includes('/mindmap') && handleGenerateMindmap) {
      handleGenerateMindmap();
    } else if (pathname.includes('/flashcards') && handleGenerateFlashCard) {
      handleGenerateFlashCard();
    } else if (pathname.includes('/powerpoint') && handleGeneratePowerpoint) {
      handleGeneratePowerpoint();
    } else {
      console.warn('Không tìm thấy hàm xử lý tương ứng với route:', pathname);
    }
  };

  const handleFileUploadClick = () => {
    setDragDropVisible(true); // Hiển thị form drag-and-drop
  };

  const handleBackToTextInput = () => {
    setDragDropVisible(false); // Quay lại form nhập văn bản
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload({ target: { files } });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 mb-2 border rounded-md">
      {!isDragDropVisible ? (
        <>
          <textarea
            className="w-full h-24 p-2 border rounded-md mb-2"
            placeholder="Nhập nội dung...."
            value={fileContent}
            onChange={handleChange}
            style={{
              maxHeight: "500px",
              minHeight: "150px",
              resize: "vertical",
            }}
            maxLength={40000}
          ></textarea>
          <div className="text-right text-sm text-gray-500">
            {charCount}/{40000}
          </div>
        </>
      ) : (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Drag-and-drop zone chỉ hiển thị khi chưa có file */}
          {!pdfUrl && !imageSrc && (
            <div
              ref={dropRef}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full md:w-1/2 flex-1 border-2 border-dashed px-4 py-3 rounded-lg text-center transition cursor-pointer ${isDragging ? 'border-blue-600 bg-blue-50' : 'border-gray-300'
                }`}
            >
              <label className="flex flex-col items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <MdOutlineFileUpload className="text-2xl text-blue-500" />
                <span>Kéo thả hoặc nhấn để chọn tệp</span>
                <input
                  type="file"
                  accept=".txt,.pdf,image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Preview Zone bên phải */}
          {(pdfUrl || imageSrc) && (
            <div className="w-full border rounded-md p-2">
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="Uploaded"
                  className="w-full h-auto border rounded-md"
                />
              )}
              {pdfUrl && (
                <iframe
                  src={pdfUrl}
                  title="PDF Viewer"
                  className="w-full h-auto border rounded-md"
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center w-full mt-4 gap-2">

        <div className="flex items-center space-x-2 ml-auto">
          {isDragDropVisible && pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
              title="Xem PDF đã upload"
            >
              <MdOpenInNew className="text-lg" />
              {/* Xem PDF */}
            </a>
          )}

          {isDragDropVisible && imageSrc && (
            <a
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
              title="Xem ảnh đã upload"
            >
              <MdOpenInNew className="text-lg" />
              {/* Xem ảnh */}
            </a>
          )}

          {(isDragDropVisible && (pdfUrl || imageSrc)) && (
            <div
              onClick={() => fileInputRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                  handleFileUpload({ target: { files: e.dataTransfer.files } });
                }
              }}
              title="Kéo tệp mới vào đây hoặc bấm để chọn"
              className="w-96 h-10 flex items-center justify-center rounded-lg bg-blue-100 hover:bg-blue-200 cursor-pointer transition border border-blue-400"
            >
              <MdOutlineFileUpload className="text-xl text-blue-600" />
              <span className="ml-2 text-sm text-blue-600 font-medium">Kéo thả tệp mới vào đây hoặc nhấn để chọn tệp</span>
              <input
                type="file"
                accept=".txt,.pdf,image/*"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
          {(isDragDropVisible && (pdfUrl || imageSrc)) && (
            <button
              onClick={handleRemoveFile}
              className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
              title="Xóa tài liệu đã upload"
            >
              <MdClose className="text-md" />
            </button>
          )}


        </div>
      </div>

      <div className="mt-6 flex justify-between items-center flex-wrap gap-2">
        {isDragDropVisible ? (
          <label
            className="cursor-pointer text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
            onClick={handleBackToTextInput}
          >
            Quay lại nhập văn bản
          </label>
        ) : (
          <label
            className="cursor-pointer text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
            onClick={handleFileUploadClick}
          >
            Tải lên tài liệu
          </label>
        )}

        <button
          onClick={handleSubmit}
          disabled={isDisabled || isLoading}
          className={`px-6 py-2 rounded-lg text-white text-sm transition ${isDisabled || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isLoading ? (
            <Oval
              height={22}
              width={22}
              color="white"
              secondaryColor="#ccc"
              strokeWidth={4}
              strokeWidthSecondary={4}
              visible={true}
            />
          ) : (
            <>
              {pathname.includes('/summarize') && 'Tóm tắt'}
              {pathname.includes('/multiplechoice') && 'Tạo câu hỏi trắc nghiệm'}
              {pathname.includes('/solve') && 'Hỗ trợ giải bài tập'}
              {pathname.includes('/mindmap') && 'Tạo sơ đồ tư duy'}
              {pathname.includes('/flashcards') && 'Tạo thẻ ghi nhớ'}
              {pathname.includes('/powerpoint') && 'Tạo PowerPoint'}
            </>
          )}
        </button>
      </div>

    </div>
  );
};

TextInput.propTypes = {
  fileContent: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  handleSummarize: PropTypes.func,
  handleGenerateMultipleChoice: PropTypes.func,
  handleGenerateSolve: PropTypes.func,
  handleGenerateMindmap: PropTypes.func,
  handleGenerateFlashCard: PropTypes.func,
  handleGeneratePowerpoint: PropTypes.func,
  handleOther: PropTypes.func,
  pdfUrl: PropTypes.string,
  imageSrc: PropTypes.string,
  charCount: PropTypes.number,
  isSubmitting: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export default TextInput;
