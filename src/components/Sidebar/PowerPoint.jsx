import PropTypes from 'prop-types';
import { MdClose, MdDownload } from 'react-icons/md';

const PowerPoint = ({
  powerpointPreview,
  setPowerpointPreview,
  handleDownloadPowerpoint
}) => {
  if (!powerpointPreview) return null;

  return (
    <div className="relative mt-4 p-2 border rounded-md bg-gray-200">
      <div className="bg-white rounded-lg p-6 h-full overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setPowerpointPreview(null)}
        >
          <MdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">PowerPoint</h2>

        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          PowerPoint đã được tạo thành công! Bạn có thể tải xuống file hoặc xem trước bên dưới.
        </div>

        <div className="w-full h-[70vh] mb-6 rounded overflow-hidden border border-gray-300">
          <iframe
            src={powerpointPreview.url}
            className="w-full h-full border-0"
            title="PowerPoint Preview"
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
            onClick={handleDownloadPowerpoint}
          >
            <MdDownload className="mr-2" size={20} />
            Tải xuống PowerPoint
          </button>
        </div>
      </div>
    </div>
  );
};

PowerPoint.propTypes = {
  powerpointPreview: PropTypes.shape({
    url: PropTypes.string.isRequired
  }),
  setPowerpointPreview: PropTypes.func.isRequired,
  handleDownloadPowerpoint: PropTypes.func.isRequired
};

export default PowerPoint;
