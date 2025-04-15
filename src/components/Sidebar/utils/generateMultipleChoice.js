/**
 * Tạo câu hỏi trắc nghiệm từ nội dung văn bản
 * @param {string} text - Nội dung văn bản để tạo câu hỏi
 * @param {string} topic - Chủ đề của câu hỏi (không bắt buộc)
 * @returns {Promise<Array>} Mảng các câu hỏi trắc nghiệm
 */
export const generateMultipleChoice = async (text, topic) => {
  if (!text || text.trim() === '') {
    throw new Error('Vui lòng nhập nội dung văn bản để tạo câu hỏi trắc nghiệm');
  }

  try {
    // Giả lập API call để tạo câu hỏi trắc nghiệm
    // Trong thực tế, bạn sẽ thay thế bằng cuộc gọi API thực tế
    return new Promise((resolve) => {
      setTimeout(() => {
        // Tạo dữ liệu mẫu đại diện cho kết quả từ API
        const questionTopic = topic || 'Kiến thức chung';
        
        // Tạo 5 câu hỏi mẫu dựa trên chủ đề
        const sampleQuestions = [
          {
            [questionTopic]: {
              Question: ['Đâu là thủ đô của Việt Nam?'],
              Answer: ['Hà Nội'],
              'Wrong Answer': ['Hồ Chí Minh', 'Đà Nẵng', 'Huế']
            }
          },
          {
            [questionTopic]: {
              Question: ['Việt Nam có bao nhiêu tỉnh thành?'],
              Answer: ['63'],
              'Wrong Answer': ['54', '60', '65']
            }
          },
          {
            [questionTopic]: {
              Question: ['Sông dài nhất Việt Nam là gì?'],
              Answer: ['Sông Mê Kông'],
              'Wrong Answer': ['Sông Hồng', 'Sông Đà', 'Sông Đồng Nai']
            }
          },
          {
            [questionTopic]: {
              Question: ['Việt Nam độc lập vào năm nào?'],
              Answer: ['1945'],
              'Wrong Answer': ['1954', '1975', '1986']
            }
          },
          {
            [questionTopic]: {
              Question: ['Ngôn ngữ chính thức của Việt Nam là gì?'],
              Answer: ['Tiếng Việt'],
              'Wrong Answer': ['Tiếng Anh', 'Tiếng Pháp', 'Tiếng Hoa']
            }
          }
        ];
        
        resolve(sampleQuestions);
      }, 1000); // Giả lập độ trễ 1 giây
    });
  } catch (error) {
    throw new Error(`Lỗi khi tạo câu hỏi trắc nghiệm: ${error.message}`);
  }
};

/**
 * Chuẩn bị dữ liệu câu hỏi trắc nghiệm để sử dụng trong component
 * @param {Array} choices - Mảng câu hỏi từ API
 * @param {string} topic - Chủ đề câu hỏi
 * @returns {Object} Dữ liệu đã được xử lý
 */
export const prepareMultipleChoiceData = (choices, topic) => {
  if (!choices || !Array.isArray(choices) || choices.length === 0) {
    throw new Error('Không nhận được dữ liệu câu hỏi hợp lệ');
  }

  // Lấy chủ đề từ câu hỏi đầu tiên nếu không được cung cấp
  const topicMulchoice = topic || Object.keys(choices[0])[0] || 'Câu hỏi trắc nghiệm';
  
  // Lấy dữ liệu từ câu hỏi đầu tiên
  const firstQuestion = choices[0][topicMulchoice] || {};
  const question = firstQuestion.Question?.[0] || 'Không có câu hỏi';
  const correctAnswer = firstQuestion.Answer?.[0] || 'Không có đáp án đúng';
  const wrongAnswers = firstQuestion['Wrong Answer'] || [];

  // Trộn các câu trả lời
  const shuffledAnswers = shuffleAnswers(correctAnswer, wrongAnswers);

  return {
    multipleChoice: choices,
    topicMulchoice,
    contentMulchoice: { question, correctAnswer, wrongAnswers },
    shuffledAnswers
  };
};

/**
 * Trộn ngẫu nhiên các câu trả lời
 * @param {string} correctAnswer - Câu trả lời đúng
 * @param {Array} wrongAnswers - Mảng các câu trả lời sai
 * @returns {Array} Mảng các câu trả lời đã trộn
 */
const shuffleAnswers = (correctAnswer, wrongAnswers) => {
  const options = [...wrongAnswers, correctAnswer];
  
  // Thuật toán Fisher-Yates để trộn mảng
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return options;
};
