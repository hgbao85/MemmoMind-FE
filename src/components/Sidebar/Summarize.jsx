import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import { marked } from 'marked';

const Summarize = ({ summary, setSummary }) => {
  if (!summary) return null;

  return (
    <div className="relative mt-4 p-2 border rounded-md bg-gray-200">
      <div className="bg-white rounded-lg p-6 overflow-y-auto relative">
        <button
          onClick={() => setSummary(null)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <MdClose size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Tóm tắt</h2>
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: marked(summary),
          }}
        />
        {/* <div className="mt-6 flex justify-end">
          <button
            onClick={() =>
              handleAddNote({ title: "Tóm tắt mới", content: summary })
            }
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Thêm vào ghi chú mới
          </button>
        </div> */}
      </div>
    </div>
  );
};

Summarize.propTypes = {
  summary: PropTypes.string,
  setSummary: PropTypes.func.isRequired,
  handleAddNote: PropTypes.func.isRequired
};

export default Summarize; 