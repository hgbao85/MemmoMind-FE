import { useState } from 'react';
import { MdClose, MdFileDownload, MdArrowBack, MdArrowForward, MdRefresh } from 'react-icons/md';
import PropTypes from 'prop-types';
import {
  handlePrevQuestion,
  handleNextQuestion,
  handleAnswerSelection,
  resetAnswers,
  saveAsHTML,
  getAnswerLabel,
  isCorrectAnswer
} from './utils/multipleChoiceUtils';
import {
  generateMultipleChoice,
  prepareMultipleChoiceData
} from './utils/generateMultipleChoice';

const MultipleChoice = ({
  text,
  topic,
  setMultipleChoice,
  currentChoiceIndex,
  setCurrentChoiceIndex,
  isTransitioning,
  setIsTransitioning,
  selectedAnswer,
  setSelectedAnswer
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [multipleChoiceData, setMultipleChoiceData] = useState({
    multipleChoice: [],
    topicMulchoice: '',
    contentMulchoice: { question: '', correctAnswer: '' },
    shuffledAnswers: []
  });

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);
      const choices = await generateMultipleChoice(text, topic);
      const data = prepareMultipleChoiceData(choices, topic);
      setMultipleChoiceData(data);
      setMultipleChoice(data.multipleChoice);
      setCurrentChoiceIndex(0);
      setSelectedAnswer(null);
    } catch (err) {
      setError(err.message || 'Failed to generate multiple choice questions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Đang tạo câu hỏi trắc nghiệm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!multipleChoiceData.multipleChoice.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tạo câu hỏi trắc nghiệm
          </button>
        </div>
      </div>
    );
  }

  const handlePrevmulchoice = () => {
    handlePrevQuestion(currentChoiceIndex, setCurrentChoiceIndex, isTransitioning, setIsTransitioning);
  };

  const handleNextmulchoice = () => {
    handleNextQuestion(currentChoiceIndex, setCurrentChoiceIndex, multipleChoiceData.multipleChoice.length, isTransitioning, setIsTransitioning);
  };

  const handleAnswerClick = (answer) => {
    handleAnswerSelection(answer, selectedAnswer, setSelectedAnswer, multipleChoiceData.contentMulchoice);
  };

  const resetAllAnswers = () => {
    resetAnswers(setSelectedAnswer);
  };

  const saveMultipleChoiceAsHTML = () => {
    saveAsHTML(multipleChoiceData.multipleChoice, multipleChoiceData.topicMulchoice);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
      style={{ zIndex: 1000 }}
    >
      <div className="relative w-full max-w-3xl bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
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
            {multipleChoiceData.topicMulchoice}
          </h3>
          <p className="question text-xl font-bold text-gray-800 mt-4">
            {multipleChoiceData.contentMulchoice.question}
          </p>
        </div>

        <div className="mt-4">
          {multipleChoiceData.shuffledAnswers.map((answer, index) => (
            <button
              key={index}
              className={`block w-full text-left px-4 py-2 mt-2 rounded-md border 
                ${selectedAnswer
                  ? answer === multipleChoiceData.contentMulchoice.correctAnswer
                    ? "bg-green-500 text-white border-green-700"
                    : selectedAnswer === multipleChoiceData.contentMulchoice.correctAnswer
                      ? "bg-gray-300 text-gray-700 border-gray-500"
                      : answer === selectedAnswer
                        ? "bg-red-500 text-white border-red-700"
                        : "bg-gray-300 text-gray-700 border-gray-500"
                  : "bg-gray-200 hover:bg-gray-300 border-gray-400"
                }`}
              disabled={selectedAnswer !== null}
              onClick={() => handleAnswerClick(answer)}
            >
              <strong>{["A", "B", "C", "D"][index]}.</strong> {answer}
            </button>
          ))}
        </div>

        {selectedAnswer !== null && (
          <div className="mt-4">
            {isCorrectAnswer(selectedAnswer, multipleChoiceData.contentMulchoice.correctAnswer) ? (
              <span className="text-green-600 font-bold">✅ Chính xác!</span>
            ) : (
              <span className="text-red-600 font-bold">
                ❌ Đáp án đúng là:{" "}
                {getAnswerLabel(multipleChoiceData.contentMulchoice.correctAnswer, multipleChoiceData.shuffledAnswers)}
              </span>
            )}
          </div>
        )}

        <div className="flex justify-between items-center w-full max-w-md mt-4">
          <button onClick={handlePrevmulchoice} className="btn-arrow">
            <MdArrowBack className="text-3xl" />
          </button>
          <p className="text-lg font-semibold text-gray-700">
            {currentChoiceIndex + 1} / {multipleChoiceData.multipleChoice.length}
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
  text: PropTypes.string.isRequired,
  topic: PropTypes.string,
  setMultipleChoice: PropTypes.func.isRequired,
  currentChoiceIndex: PropTypes.number.isRequired,
  setCurrentChoiceIndex: PropTypes.func.isRequired,
  isTransitioning: PropTypes.bool.isRequired,
  setIsTransitioning: PropTypes.func.isRequired,
  selectedAnswer: PropTypes.string,
  setSelectedAnswer: PropTypes.func.isRequired
};

export default MultipleChoice; 