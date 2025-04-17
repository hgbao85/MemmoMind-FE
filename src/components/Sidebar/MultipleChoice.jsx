/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { MdClose, MdArrowBack, MdArrowForward, MdRefresh, MdFileDownload } from "react-icons/md";

const MultipleChoice = ({
  topic,
  setMultipleChoice,
  currentChoiceIndex,
  isTransitioning,
  selectedAnswer,
  handlePrevmulchoice,
  handleNextmulchoice,
  saveMultipleChoiceAsHTML,
  multipleChoice,
  shuffledAnswers,
  isAnswerCorrect,
  handleAnswerClick,
  resetAllAnswers,
}) => {
  return (
    <div
      className="relative mt-4 p-2 border rounded-md bg-gray-200"
    >
      <div className="relative w-full max-w-7xl bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
        <button
          onClick={() => {
            setMultipleChoice([]);
            resetAllAnswers();
          }}
          className="absolute top-3 right-3 text-gray-600 hover:text-black"
          aria-label="Close MultipleChoice"
        >
          <MdClose className="text-2xl" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Câu hỏi trắc nghiệm
        </h2>

        <div
          className={`text-center transition-opacity duration-300 ${isTransitioning ? "opacity-0" : "opacity-100"
            }`}
        >
          <h3 className="text-lg font-semibold uppercase tracking-wide">
            {topic}
          </h3>
          <p className="question text-xl font-bold text-gray-800 mt-4">
            {multipleChoice[currentChoiceIndex]?.question}
          </p>
        </div>

        <div className="mt-4">
          {shuffledAnswers.map((answer, index) => (
            <button
              key={index}
              className={`block w-full text-left px-4 py-2 mt-2 rounded-md border 
    ${selectedAnswer !== null
                  ? answer === multipleChoice[currentChoiceIndex]?.correctAnswer
                    ? "bg-green-500 text-white border-green-700"
                    : answer === selectedAnswer
                      ? "bg-gray-500 text-white border-red-700"
                      : "bg-gray-300 text-gray-700 border-gray-500"
                  : "bg-gray-200 hover:bg-gray-300 border-gray-400"
                }`}
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswerClick(answer, currentChoiceIndex, index)}
            >
              <strong>{["A", "B", "C", "D"][index]}.</strong> {answer}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-4">
            {isAnswerCorrect ? (
              <span className="text-green-600 font-bold">✅ Chính xác!</span>
            ) : (
              <span className="text-red-600 font-bold">
                ❌ Sai
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center w-full max-w-md mt-4">
          <button onClick={handlePrevmulchoice} className="btn-arrow">
            <MdArrowBack className="text-3xl" />
          </button>
          <p className="text-lg font-semibold text-gray-700">
            {currentChoiceIndex + 1} / {multipleChoice.length}
          </p>
          <button onClick={handleNextmulchoice} className="btn-arrow">
            <MdArrowForward className="text-3xl" />
          </button>
        </div>

        <div className="w-full flex justify-between mt-3">
          <button
            onClick={resetAllAnswers}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center shadow-sm text-sm"
          >
            <MdRefresh className="inline-block mr-1 text-base" />
            Thử lại toàn bộ câu hỏi
          </button>
          <button
            onClick={saveMultipleChoiceAsHTML}
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

MultipleChoice.propTypes = {
  topic: PropTypes.string.isRequired,
  setMultipleChoice: PropTypes.func.isRequired,
  currentChoiceIndex: PropTypes.number.isRequired,
  setCurrentChoiceIndex: PropTypes.func.isRequired,
  isTransitioning: PropTypes.bool.isRequired,
  setIsTransitioning: PropTypes.func.isRequired,
  selectedAnswer: PropTypes.string,
  setSelectedAnswer: PropTypes.func.isRequired,
  handlePrevmulchoice: PropTypes.func.isRequired,
  handleNextmulchoice: PropTypes.func.isRequired,
  saveMultipleChoiceAsHTML: PropTypes.func.isRequired,
  multipleChoice: PropTypes.array.isRequired,
  shuffledAnswers: PropTypes.array.isRequired,
  isAnswerCorrect: PropTypes.bool,
  handleAnswerClick: PropTypes.func.isRequired,
  resetAllAnswers: PropTypes.func.isRequired,
};

export default MultipleChoice;