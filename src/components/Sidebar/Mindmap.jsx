import PropTypes from 'prop-types';
import { MdClose, MdFileDownload } from 'react-icons/md';

const Mindmap = ({ mindmapHtml, setMindmapHtml, saveMindmapAsHTML }) => {
  if (!mindmapHtml) return null;

  return (
    <div
      className="relative mt-4 p-2 border rounded-md bg-gray-200"
    >
      <div className="relative w-full max-w-7xl bg-white rounded-lg shadow-lg p-4">
        <button
          onClick={() => setMindmapHtml(null)}
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          aria-label="Close Mindmap"
        >
          <MdClose className="text-xl" />
        </button>

        <h2 className="text-xl font-bold text-center text-gray-800 mb-3">
          Sơ đồ tư duy
        </h2>

        <iframe
          srcDoc={mindmapHtml}
          className="w-full h-[510px] border-none rounded-md shadow"
          style={{
            display: "block",
            overflow: "hidden",
          }}
        />

        <div className="flex justify-end mt-3">
          <button
            onClick={saveMindmapAsHTML}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center shadow-sm text-sm"
          >
            <MdFileDownload className="inline-block mr-1 text-base" />
            Tải xuống
          </button>
        </div>
      </div>
    </div>
  );
};

Mindmap.propTypes = {
  mindmapHtml: PropTypes.string,
  setMindmapHtml: PropTypes.func.isRequired,
  saveMindmapAsHTML: PropTypes.func.isRequired
};

export default Mindmap; 