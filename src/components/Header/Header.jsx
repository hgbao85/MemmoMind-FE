import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';


const Header = ({ progress }) => {
    const location = useLocation();

    const getTitle = () => {
        switch (location.pathname) {
            case '/summarize':
                return 'Tóm tắt văn bản';
            case '/flashcards':
                return 'Tạo thẻ ghi nhớ';
            case '/mindmap':
                return 'Tạo sơ đồ tư duy';
            case '/powerpoint':
                return 'Tạo bài thuyết trình';
            case '/multiplechoice':
                return 'Tạo câu hỏi trắc nghiệm';
            case '/solve':
                return 'Giải bài tập';
        }
    };

    return (
        <div className="p-4 m-4 rounded-lg bg-white border-b border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">{getTitle()}</h2>

                <div className="flex flex-col items-center">
                    <p className="text-sm text-gray-600 mb-1">Chi phí bạn đã sử dụng AI</p>
                    <div className="w-52 bg-gray-300 rounded-full h-6 shadow-lg relative overflow-hidden border border-gray-400">
                        <div
                            className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.5)] animate-pulse"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm font-bold text-white drop-shadow-md animate-fade-in">
                            {progress.toFixed(2)}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

Header.propTypes = {
    progress: PropTypes.number.isRequired,
};

export default Header;