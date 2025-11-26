import { GoogleGenAI } from "@google/genai";
import { GameConfig, GeneratedContent } from "../types";

// SỬA: Dùng import.meta.env.VITE_GEMINI_API_KEY
// Key này sẽ được lấy từ cấu hình Environment Variables trên Cloudflare
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// Khởi tạo client an toàn
const ai = new GoogleGenAI({ apiKey: apiKey || "MISSING_KEY" });

export const generateGameContent = async (config: GameConfig): Promise<GeneratedContent> => {
  if (!apiKey) {
    throw new Error("Chưa cấu hình API Key. Vui lòng kiểm tra cài đặt.");
  }
  
  // Use Pro model for better reasoning on simulation scenarios
  const modelId = "gemini-1.5-flash"; 

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
  2. Tạo dữ liệu trò chơi dưới dạng JSON.

  CẤU TRÚC JSON TRẢ VỀ (Tuyệt đối tuân thủ, không thêm markdown):
  {
    "title": "Tên trò chơi",
    "description": "Hướng dẫn cách chơi",
    "questions": [ ... ]
  }
  
  (Giữ nguyên phần prompt hướng dẫn chi tiết các loại game như file gốc của bạn...)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        // Lưu ý: Google Search Tool chỉ hoạt động nếu key hỗ trợ và model hỗ trợ.
        // Nếu lỗi, có thể bỏ comment dòng tools này.
        // tools: [{ googleSearch: {} }], 
      },
    });

    let text = response.text || "";
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
      throw new Error("Không thể phân tích dữ liệu từ AI. Hãy thử lại.");
    }

  } catch (error: any) {
    console.error("Gemini API Error", error);
    throw new Error(`Lỗi kết nối Gemini: ${error.message}`);
  }
};