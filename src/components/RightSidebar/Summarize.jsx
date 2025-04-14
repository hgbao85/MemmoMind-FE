import PropTypes from 'prop-types';
import { MdClose, MdAdd } from 'react-icons/md';
import { marked } from 'marked';

const Summarize = ({ summary, setSummary, handleAddNote }) => {
  if (!summary) return null;

  return (
    <div className="relative mt-4 p-2 border rounded-md bg-gray-200">
      <button
        onClick={() => setSummary(null)}
        className="absolute top-2 right-2 text-gray-600 hover:text-black"
        aria-label="Close Summary"
      >
        <MdClose className="text-xl" />
      </button>
      <h2 className="text-lg font-bold text-gray-800 mb-3">Tóm tắt</h2>
      <div
        className="prose"
        dangerouslySetInnerHTML={{
          __html: marked(summary),
        }}
      />
      <button
        onClick={() =>
          handleAddNote({ title: "Tóm tắt mới", content: summary })
        }
        className="mt-2 px-2 py-0.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center shadow-sm text-xs ml-auto"
      >
        <MdAdd className="inline-block mr-1 text-sm" />
        Thêm vào ghi chú mới
      </button>
    </div>
  );
};

Summarize.propTypes = {
  summary: PropTypes.string,
  setSummary: PropTypes.func.isRequired,
  handleAddNote: PropTypes.func.isRequired
};

export default Summarize; 