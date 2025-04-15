import PropTypes from 'prop-types';
import { MdClose, MdFileDownload, MdArrowBack, MdArrowForward } from 'react-icons/md';

const Flashcard = ({
  flashcard,
  setFlashCard,
  currentIndex,
  isFlipped,
  setIsFlipped,
  isTransitioning,
  handlePrev,
  handleNext,
  saveFlashcardAsHTML,
  topic,
  content
}) => {
  if (!flashcard || flashcard.length === 0) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
      style={{ zIndex: 1000 }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
        <button
          onClick={() => setFlashCard([])}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          aria-label="Close Flashcard"
        >
          <MdClose className="text-2xl" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Thẻ ghi nhớ
        </h2>

        <div className="flashcard-container w-full max-w-2xl">
          <div
            className={`flashcard ${isFlipped ? "flipped" : ""} ${
              isTransitioning ? "hidden" : ""
            }`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="front">
              <h3 className="text-lg font-semibold uppercase tracking-wide text-center">
                {topic}
              </h3>
              <p className="question text-xl font-bold text-gray-800 mt-4 text-center">
                {content?.Question?.[0] || "Không có dữ liệu"}
              </p>
            </div>
            <div className="back">
              <p className="answer text-xl font-bold text-gray-900 mt-4 text-center">
                {content?.Answer?.[0] || "Không có dữ liệu"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center w-full max-w-md mt-4">
          <button onClick={handlePrev} className="btn-arrow">
            <MdArrowBack className="text-3xl" />
          </button>
          <p className="text-lg font-semibold text-gray-700">
            {currentIndex + 1} / {flashcard.length}
          </p>
          <button onClick={handleNext} className="btn-arrow">
            <MdArrowForward className="text-3xl" />
          </button>
        </div>

        <div className="w-full flex justify-end mt-3">
          <button
            onClick={saveFlashcardAsHTML}
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

Flashcard.propTypes = {
  flashcard: PropTypes.arrayOf(PropTypes.any).isRequired,
  setFlashCard: PropTypes.func.isRequired,
  currentIndex: PropTypes.number.isRequired,
  isFlipped: PropTypes.bool.isRequired,
  setIsFlipped: PropTypes.func.isRequired,
  isTransitioning: PropTypes.bool.isRequired,
  handlePrev: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  saveFlashcardAsHTML: PropTypes.func.isRequired,
  topic: PropTypes.string.isRequired,
  content: PropTypes.shape({
    Question: PropTypes.arrayOf(PropTypes.string),
    Answer: PropTypes.arrayOf(PropTypes.string)
  })
};

export default Flashcard; 