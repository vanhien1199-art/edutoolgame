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

  1. Hãy TÌM KIẾM (dùng công cụ) nội dung thực tế của bài học này trong SGK.
  2. Tạo dữ liệu trò chơi dưới dạng JSON chuẩn (không markdown).
  
  CẤU TRÚC JSON TRẢ VỀ:
  {
    "title": "Tên trò chơi",
    "description": "Hướng dẫn cách chơi",
    "questions": [ ... ]
  }
  
  CHI TIẾT CẤU TRÚC "questions" THEO TỪNG LOẠI GAME:

  *** LOẠI 1: simulation (Mô phỏng - Dành cho Warm-up) ***
  Mục tiêu: Tạo ra một hoạt động Kéo & Thả (Drag & Drop) để phân loại hoặc ghép hình.
  Chỉ trả về 1 phần tử trong mảng "questions" chứa cấu hình toàn bộ màn chơi.
  Cấu trúc:
  {
    "id": "sim1",
    "question": "Câu lệnh hướng dẫn (Ví dụ: Hãy kéo các quả táo vào giỏ tương ứng)",
    "simulationConfig": {
       "backgroundTheme": "Mô tả bối cảnh (Ví dụ: Bàn tiệc, Nông trại, Vũ trụ)",
       "zones": [
          { "id": "z1", "label": "Nhãn khu vực 1 (Ví dụ: Số chẵn)", "color": "#e0f2fe" },
          { "id": "z2", "label": "Nhãn khu vực 2 (Ví dụ: Số lẻ)", "color": "#fce7f3" }
       ],
       "items": [
          { "id": "i1", "content": "Nội dung (Chữ hoặc Emoji)", "zoneId": "z1" },
          { "id": "i2", "content": "Nội dung", "zoneId": "z2" }
          // Tạo khoảng 6-10 item
       ]
    }
  }

  *** LOẠI 2: sequencing (Sắp xếp thứ tự) ***
  Mục tiêu: Sắp xếp các bước/quy trình/sự kiện theo đúng trật tự.
  Cấu trúc:
  {
    "id": "seq1",
    "question": "Hãy sắp xếp các bước sau theo đúng trình tự:",
    "sequenceOrder": 1, // Thứ tự đúng (1, 2, 3...)
    "content": "Nội dung bước (Ví dụ: Trứng nở ra ấu trùng)" 
  }
  (Tạo 4-6 mục với sequenceOrder từ 1 đến N, xáo trộn thứ tự trong mảng cũng được, client sẽ hiển thị xáo trộn)

  *** LOẠI 3: quiz (Trắc nghiệm) ***
  {
    "id": "q1",
    "question": "Câu hỏi...",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "Đáp án đúng",
    "explanation": "Giải thích ngắn"
  }

  *** LOẠI 4: matching (Ghép đôi) ***
  {
    "id": "m1",
    "question": "Ghép cặp",
    "matchPair": { "left": "Vế trái", "right": "Vế phải" }
  }

  *** LOẠI 5: wheel (Vòng quay) ***
  {
    "id": "w1",
    "question": "Câu hỏi...",
    "wheelLabel": "Nhãn trên vòng quay (ngắn)",
    "correctAnswer": "Đáp án",
    "explanation": "Giải thích"
  }

  YÊU CẦU QUAN TRỌNG:
  - Nội dung phải CHÍNH XÁC theo kiến thức bài học trong SGK ${config.bookSeries}.
  - Nếu là Simulation: Hãy chọn tình huống thực tế trong sách (Ví dụ: Toán lớp 1 bài Cao thấp -> Kéo vật vào ô Cao/Thấp; KHTN bài Tách chất -> Kéo dụng cụ vào đúng phương pháp).
  ${config.activityType === 'practice' ? `- Phải tạo chính xác ${config.questionCount} câu hỏi/mục.` : ''}
  - Chỉ trả về JSON thuần, không markdown.
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
