import PropTypes from 'prop-types';
import { marked } from 'marked';
import { MdClose, MdAdd } from 'react-icons/md';

const NotesSection = ({ 
  summary, 
  setSummary, 
  solve, 
  setSolve, 
  handleAddNote 
}) => {
  return (
    <div>
      {/* Hiển thị Summary nếu có */}
      {summary && (
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
      )}

      {/* Hiển thị Solve nếu có */}
      {solve && (
        <div className="relative mt-4 p-2 border rounded-md bg-gray-200">
          <button
            onClick={() => setSolve(null)}
            className="absolute top-2 right-2 text-gray-600 hover:text-black"
            aria-label="Close Solve"
          >
            <MdClose className="text-xl" />
          </button>
          <div className="markdown-preview">
            <h3 className="text-lg font-semibold">Giải pháp:</h3>
            <div
              className="break-words markdown-content"
              dangerouslySetInnerHTML={{
                __html: marked(solve || "", {
                  breaks: true,
                  gfm: true,
                  sanitize: true,
                }),
              }}
            />
          </div>
          <button
            onClick={() =>
              handleAddNote({ title: "Giải pháp mới", content: solve })
            }
            className="mt-2 px-2 py-0.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center shadow-sm text-xs ml-auto"
          >
            <MdAdd className="inline-block mr-1 text-sm" />
            Thêm vào ghi chú mới
          </button>
        </div>
      )}
    </div>
  );
};

NotesSection.propTypes = {
  summary: PropTypes.string,
  setSummary: PropTypes.func,
  solve: PropTypes.string,
  setSolve: PropTypes.func,
  handleAddNote: PropTypes.func.isRequired
};

export default NotesSection; 