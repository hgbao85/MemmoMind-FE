/**
 * Xử lý chuyển đến câu hỏi trước
 */
export const handlePrevQuestion = (currentIndex, setCurrentIndex, isTransitioning, setIsTransitioning) => {
  if (currentIndex > 0 && !isTransitioning) {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex - 1);
      setIsTransitioning(false);
    }, 300);
  }
};

/**
 * Xử lý chuyển đến câu hỏi tiếp theo
 */
export const handleNextQuestion = (
  currentIndex, 
  setCurrentIndex, 
  totalQuestions, 
  isTransitioning, 
  setIsTransitioning
) => {
  if (currentIndex < totalQuestions - 1 && !isTransitioning) {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1);
      setIsTransitioning(false);
    }, 300);
  }
};

/**
 * Xử lý khi người dùng chọn câu trả lời
 */
export const handleAnswerSelection = (
  answer, 
  selectedAnswer, 
  setSelectedAnswer
) => {
  if (selectedAnswer === null) {
    setSelectedAnswer(answer);
  }
};

/**
 * Reset lại tất cả câu trả lời đã chọn
 */
export const resetAnswers = (setSelectedAnswer) => {
  setSelectedAnswer(null);
};

/**
 * Lưu câu hỏi trắc nghiệm dưới dạng HTML
 */
export const saveAsHTML = (multipleChoice, topic) => {
  // Tạo HTML từ dữ liệu câu hỏi
  let html = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Câu hỏi trắc nghiệm - ${topic}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
    }
    h1 {
      color: #2c3e50;
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid #eee;
      padding-bottom: 10px;
    }
    .question-container {
      margin-bottom: 30px;
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .question {
      font-weight: bold;
      margin-bottom: 10px;
      color: #2c3e50;
    }
    .answers {
      margin-left: 20px;
    }
    .answer {
      margin-bottom: 5px;
    }
    .correct-answer {
      color: #27ae60;
      font-weight: bold;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <h1>Câu hỏi trắc nghiệm - ${topic}</h1>
`;

  // Thêm từng câu hỏi vào HTML
  multipleChoice.forEach((questionObj, index) => {
    const questionTopic = Object.keys(questionObj)[0];
    const question = questionObj[questionTopic];
    
    if (question.Question && question.Answer && question['Wrong Answer']) {
      const answers = [...question['Wrong Answer'], question.Answer[0]];
      // Trộn ngẫu nhiên các câu trả lời
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }

      html += `
  <div class="question-container">
    <div class="question">${index + 1}. ${question.Question[0]}</div>
    <div class="answers">
`;
      
      // Thêm các lựa chọn
      const options = ['A', 'B', 'C', 'D'];
      answers.forEach((answer, i) => {
        html += `      <div class="answer">${options[i]}. ${answer}</div>\n`;
      });

      html += `
    </div>
    <div class="correct-answer">Đáp án đúng: ${question.Answer[0]}</div>
  </div>
`;
    }
  });

  html += `
</body>
</html>
`;

  // Tạo blob và tệp để tải xuống
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `multiple-choice-${topic.replace(/\s+/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Lấy nhãn (A, B, C, D) của câu trả lời
 */
export const getAnswerLabel = (answer, shuffledAnswers) => {
  const index = shuffledAnswers.indexOf(answer);
  if (index !== -1) {
    return `${["A", "B", "C", "D"][index]}. ${answer}`;
  }
  return answer;
};

/**
 * Kiểm tra xem câu trả lời có đúng không
 */
export const isCorrectAnswer = (selectedAnswer, correctAnswer) => {
  return selectedAnswer === correctAnswer;
}; 