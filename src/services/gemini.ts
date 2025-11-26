import { GoogleGenerativeAI } from "@google/generative-ai";
import { GameConfig, GeneratedContent } from "../types";

// Sử dụng biến môi trường chuẩn Vite
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  console.error("VITE_GEMINI_API_KEY is missing");
}

const genAI = new GoogleGenerativeAI(apiKey || "MISSING_KEY");

export const generateGameContent = async (config: GameConfig): Promise<GeneratedContent> => {
  // Logic giữ nguyên, chỉ thay đổi cách gọi model
  const modelId = "gemini-2.5-flash"; 
  const model = genAI.getGenerativeModel({ model: modelId });

  const prompt = `
  Bạn là một chuyên gia giáo dục Việt Nam, am hiểu chương trình GDPT 2018 và SGK ${config.bookSeries}.
  Nhiệm vụ: Tạo nội dung trò chơi giáo dục cho bài học:
  - Môn: ${config.subject}
  - Lớp: ${config.grade}
  - Bài: ${config.lessonName}
  - Hoạt động: ${config.activityType}
  - Loại game: ${config.gameType}
  ${config.activityType === 'practice' ? `- Số lượng câu hỏi: ${config.questionCount}` : ''}

  1. Hãy TÌM KIẾM (dùng công cụ) nội dung liên quan của bài học này trong SGK (ưu tiên tính huống mở đầu, ví dụ, tình huống mở đầu, hình ảnh, bài tập, từ khóa quan trọng).
  2. Tạo dữ liệu trò chơi dưới dạng JSON.
  ${config.activityType === 'practice' ? `\n  Yêu cầu về số lượng: Tạo chính xác ${config.questionCount} mục trong mảng "questions".` : ''}

  CẤU TRÚC JSON TRẢ VỀ:
  {
    "title": "Tên trò chơi (Hấp dẫn, liên quan bài học)",
    "description": "Hướng dẫn cách chơi ngắn gọn",
    "questions": [ ... danh sách câu hỏi/dữ liệu ...]
  }

  CHI TIẾT CẤU TRÚC "questions" THEO TỪNG LOẠI GAME:

  *** LOẠI: fast_quiz (Kahoot/Quizizz) ***
  Tạo các câu hỏi trắc nghiệm NHANH, ngắn gọn, kích thích tư duy.
  {
    "id": "fq1",
    "question": "Câu hỏi ngắn...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "Đáp án đúng",
    "explanation": "Giải thích siêu ngắn"
  }

  *** LOẠI: comparison (Tìm điểm chung/khác) ***
  So sánh 2 đối tượng/khái niệm trong bài học. Chỉ trả về 1 item duy nhất cấu hình game.
  {
    "id": "comp1",
    "question": "Hãy phân loại các đặc điểm sau vào nhóm phù hợp",
    "comparisonConfig": {
       "groupA": "Đối tượng A (Ví dụ: Tế bào thực vật)",
       "groupB": "Đối tượng B (Ví dụ: Tế bào động vật)",
       "items": [
          { "id": "i1", "content": "Có thành cellulozo", "belongsTo": "A" },
          { "id": "i2", "content": "Có nhân", "belongsTo": "Both" },
          { "id": "i3", "content": "Không có lục lạp", "belongsTo": "B" }
          // Tạo khoảng 6-8 item
       ]
    }
  }

  *** LOẠI: number_grid (Chọn ô số) ***
  Tạo chính xác 9 câu hỏi cho 9 ô số.
  {
    "id": "ng1",
    "question": "Câu hỏi cho ô số 1...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "Đáp án đúng",
    "explanation": "Giải thích"
  }

  *** LOẠI: keyword_guess (Bắn tên/Đoán từ khóa) ***
  Chỉ trả về 1 item duy nhất.
  {
    "id": "kg1",
    "question": "Đuổi hình bắt chữ / Đoán chủ đề",
    "keywordConfig": {
       "keywords": ["Từ khóa 1", "Từ khóa 2", "Từ khóa 3", "Từ khóa 4"],
       "finalAnswer": "Tên chủ đề/bài học cần đoán"
    }
  }

  *** LOẠI: mystery_box (Hộp bí mật) ***
  Chỉ trả về 1 item duy nhất.
  {
    "id": "mb1",
    "question": "Trong hộp bí mật có gì?",
    "mysteryConfig": {
       "hints": [
          "Gợi ý 1: Nó có màu...",
          "Gợi ý 2: Nó dùng để...",
          "Gợi ý 3: Nó xuất hiện ở..."
       ],
       "itemContent": "Tên vật/khái niệm trong hộp"
    }
  }

  *** LOẠI: simulation (Mô phỏng tương tác) ***
  Chỉ trả về 1 phần tử cấu hình toàn bộ màn chơi Kéo-Thả.
  {
    "id": "sim1",
    "question": "Câu lệnh hướng dẫn...",
    "simulationConfig": {
       "backgroundTheme": "Mô tả bối cảnh",
       "zones": [
          { "id": "z1", "label": "Khu vực 1", "color": "#e0f2fe" },
          { "id": "z2", "label": "Khu vực 2", "color": "#fce7f3" }
       ],
       "items": [
          { "id": "i1", "content": "Nội dung", "zoneId": "z1" }
          // Tạo khoảng 6-10 item
       ]
    }
  }

  *** LOẠI: sequencing (Sắp xếp thứ tự) ***
  {
    "id": "seq1",
    "question": "Sắp xếp theo thứ tự...",
    "sequenceOrder": 1, // 1, 2, 3...
    "content": "Nội dung bước" 
  }

  *** LOẠI: quiz (Trắc nghiệm thường) ***
  { "id": "q1", "question": "...", "options": ["..."], "correctAnswer": "...", "explanation": "..." }

  *** LOẠI: matching (Ghép đôi) ***
  { "id": "m1", "question": "...", "matchPair": { "left": "...", "right": "..." } }

  *** LOẠI: wheel (Vòng quay) ***
  { "id": "w1", "question": "...", "wheelLabel": "...", "correctAnswer": "...", "explanation": "..." }

  YÊU CẦU: JSON thuần, không markdown, nội dung chính xác SGK.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Xử lý làm sạch JSON
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(text) as GeneratedContent;
      if (parsed.questions) {
        parsed.questions = parsed.questions.map((q, i) => ({
           ...q,
           id: q.id || `gen_${Date.now()}_${i}`
        }));
      }
      return parsed;
    } catch (e) {
      console.error("JSON Parse Error", e);
      throw new Error("Không thể phân tích dữ liệu từ AI.");
    }

  } catch (error: any) {
    console.error("Gemini API Error", error);
    throw new Error("Lỗi kết nối Gemini.");
  }
};
