import PropTypes from 'prop-types';

const ActionButtons = ({
  loadingState,
  handleSummarize,
  handleGenerateMindmap,
  handleGenerateFlashCard,
  handleGenerateSolve,
  handleGeneratePowerpoint,
  handleGenerateMultipleChoice
}) => {
  const LoadingSpinner = () => (
    <div className="flex items-center space-x-2">
      <svg
        className="animate-spin h-2 w-2 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span>Loading</span>
    </div>
  );

  return (
    <>
      <div className="flex justify-between gap-2 pt-2">
        <button
          className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${
            loadingState.isLoading && loadingState.action === "summarize"
              ? "opacity-75 cursor-wait"
              : ""
          }`}
          onClick={handleSummarize}
          disabled={loadingState.isLoading}
          title="Tạo tóm tắt"
        >
          {loadingState.isLoading && loadingState.action === "summarize" ? (
            <LoadingSpinner />
          ) : (
            "Tóm Tắt"
          )}
        </button>

        <button
          className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${
            loadingState.isLoading && loadingState.action === "mindmap"
              ? "opacity-75 cursor-wait"
              : ""
          }`}
          onClick={handleGenerateMindmap}
          disabled={loadingState.isLoading}
          title="Tạo sơ đồ tư duy"
        >
          {loadingState.isLoading && loadingState.action === "mindmap" ? (
            <LoadingSpinner />
          ) : (
            "Mindmap"
          )}
        </button>

        <button
          className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${
            loadingState.isLoading && loadingState.action === "flashcard"
              ? "opacity-75 cursor-wait"
              : ""
          }`}
          onClick={handleGenerateFlashCard}
          disabled={loadingState.isLoading}
          title="Tạo thẻ ghi nhớ"
        >
          {loadingState.isLoading && loadingState.action === "flashcard" ? (
            <LoadingSpinner />
          ) : (
            "FlashCards"
          )}
        </button>
      </div>

      <div className="flex justify-between gap-2 pt-2">
        <button
          className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${
            loadingState.isLoading && loadingState.action === "solve"
              ? "opacity-75 cursor-wait"
              : ""
          }`}
          onClick={handleGenerateSolve}
          disabled={loadingState.isLoading}
          title="Hỗ trợ làm bài"
        >
          {loadingState.isLoading && loadingState.action === "solve" ? (
            <LoadingSpinner />
          ) : (
            "Hỗ trợ làm bài"
          )}
        </button>

        <button
          className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${
            loadingState.isLoading && loadingState.action === "powerpoint"
              ? "opacity-75 cursor-wait"
              : ""
          }`}
          onClick={handleGeneratePowerpoint}
          disabled={loadingState.isLoading}
          title="Tạo PowerPoint"
        >
          {loadingState.isLoading && loadingState.action === "powerpoint" ? (
            <LoadingSpinner />
          ) : (
            "PowerPoint"
          )}
        </button>

        <button
          className={`flex-1 h-12 w-6 text-[10px] font-medium text-white bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 rounded-2xl flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 ${
            loadingState.isLoading && loadingState.action === "multiplechoice"
              ? "opacity-75 cursor-wait"
              : ""
          }`}
          onClick={handleGenerateMultipleChoice}
          disabled={loadingState.isLoading}
          title="Tạo câu hỏi trắc nghiệm"
        >
          {loadingState.isLoading && loadingState.action === "multiplechoice" ? (
            <LoadingSpinner />
          ) : (
            "MultipleChoice"
          )}
        </button>
      </div>
    </>
  );
};

ActionButtons.propTypes = {
  loadingState: PropTypes.shape({
    isLoading: PropTypes.bool.isRequired,
    action: PropTypes.string
  }).isRequired,
  handleSummarize: PropTypes.func.isRequired,
  handleGenerateMindmap: PropTypes.func.isRequired,
  handleGenerateFlashCard: PropTypes.func.isRequired,
  handleGenerateSolve: PropTypes.func.isRequired,
  handleGeneratePowerpoint: PropTypes.func.isRequired,
  handleGenerateMultipleChoice: PropTypes.func.isRequired
};

export default ActionButtons; 