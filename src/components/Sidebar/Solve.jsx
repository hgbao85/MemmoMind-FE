import PropTypes from 'prop-types';
import { MdClose } from 'react-icons/md';
import { marked } from 'marked';

const Solve = ({ solve, setSolve, handleAddNote }) => {
  if (!solve) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-3/4 max-h-[80vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={() => setSolve(null)}
        >
          <MdClose size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-4">Giải pháp</h2>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: marked(solve) }}
        />

        <div className="mt-6 flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => handleAddNote("Giải pháp", solve)}
          >
            Thêm vào ghi chú mới
          </button>
        </div>
      </div>
    </div>
  );
};

Solve.propTypes = {
  solve: PropTypes.string,
  setSolve: PropTypes.func.isRequired,
  handleAddNote: PropTypes.func.isRequired
};

export default Solve; 