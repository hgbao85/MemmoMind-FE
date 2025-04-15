'use client'; // Đảm bảo chạy trong client component
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { MdOutlineFileUpload, MdOpenInNew, MdClose } from 'react-icons/md';

const TextInput = ({
  fileContent,
  handleChange,
  handleFileUpload,
  handleRemoveFile,
  handleSummarize,
  handleGenerateMultipleChoice,
  handleOther,
  pdfUrl,
  imageSrc,
  charCount,
  isSubmitting
}) => {
  const location = useLocation();
  const pathname = location.pathname;

  const isDisabled = !fileContent && !pdfUrl && !imageSrc;

  const handleSubmit = () => {
    if (pathname.includes('/summarize') && handleSummarize) {
      handleSummarize();
    } else if (pathname.includes('/multiplechoice') && handleGenerateMultipleChoice) {
      handleGenerateMultipleChoice();
    } else if (handleOther) {
      handleOther(); // fallback hoặc các route khác
    } else {
      console.warn('Không tìm thấy hàm xử lý tương ứng với route:', pathname);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 mb-2 border rounded-md">
      <textarea
        className="w-full h-24 p-2 border rounded-md mb-2"
        placeholder="Nhập văn bản hoặc tải lên tài liệu (.txt, .pdf, .jpg, .png) có sẵn."
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

      <div className="flex flex-wrap justify-between items-center w-full mt-4 gap-2">
        <label className="cursor-pointer text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1">
          <MdOutlineFileUpload className="text-lg" />
          Chọn tệp
          <input
            type="file"
            accept=".txt,.pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <div className="flex items-center space-x-2 ml-auto">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
              title="Xem PDF đã upload"
            >
              <MdOpenInNew className="text-lg" />
              Xem PDF
            </a>
          )}

          {imageSrc && (
            <a
              href={imageSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
              title="Xem ảnh đã upload"
            >
              <MdOpenInNew className="text-lg" />
              Xem ảnh
            </a>
          )}

          {(pdfUrl || imageSrc) && (
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

      {imageSrc && (
        <img
          src={imageSrc}
          alt="Uploaded"
          className="w-1/2 h-auto my-4 border rounded-md"
        />
      )}
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          className="w-full mt-4 h-auto border rounded-md shadow-lg"
        />
      )}

      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          disabled={isDisabled || isSubmitting}
          className={`px-6 py-2 rounded-lg text-white text-sm transition ${isDisabled || isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
            }`}
        >
          {isSubmitting ? 'Đang gửi...' : 'Gửi'}
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
  handleOther: PropTypes.func,
  pdfUrl: PropTypes.string,
  imageSrc: PropTypes.string,
  charCount: PropTypes.number,
  isSubmitting: PropTypes.bool
};

export default TextInput;
