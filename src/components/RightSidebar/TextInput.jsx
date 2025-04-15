import PropTypes from 'prop-types';
import { MdOutlineFileUpload, MdOpenInNew, MdClose } from 'react-icons/md';

const TextInput = ({
  fileContent,
  handleChange,
  handleFileUpload,
  handleRemoveFile,
  pdfUrl,
  imageSrc,
  charCount
}) => {
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
      <div className="text-right">
        {charCount}/{40000}
      </div>
      <div className="flex justify-between items-center w-full">
        <label className="cursor-pointer text-[13px] bg-blue-500 text-white px-2 py-2 mb-3 mt-3 rounded-lg hover:bg-blue-600 transition flex items-center gap-1">
          <MdOutlineFileUpload className="text-lg" />
          Chọn tệp
          <input
            type="file"
            accept=".txt,.pdf,image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>

        <div className="flex items-center space-x-3 ml-auto">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-[13px] bg-blue-500 text-white px-2 py-2 ml-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
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
              className="cursor-pointer text-[13px] bg-blue-500 text-white ml-2 px-2 py-2 rounded-lg hover:bg-blue-600 transition flex items-center gap-1"
              title="Xem ảnh đã upload"
            >
              <MdOpenInNew className="text-lg" />
              Xem ảnh
            </a>
          )}

          {(pdfUrl || imageSrc) && (
            <button
              onClick={handleRemoveFile}
              className="bg-red-500 cursor-pointer text-white px-2 py-2 rounded-lg transition"
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
    </div>
  );
};

TextInput.propTypes = {
  fileContent: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleFileUpload: PropTypes.func.isRequired,
  handleRemoveFile: PropTypes.func.isRequired,
  pdfUrl: PropTypes.string,
  imageSrc: PropTypes.string,
  charCount: PropTypes.number
};

export default TextInput; 