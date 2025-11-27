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
  Bạn là một chuyên gia giáo dục Việt Nam, am hiểu chương trình GDPT 2018 và nội dung SGK ${config.bookSeries} tại nguồn trang: https://hanhtrangso.nxbgd.vn/.
Nhiệm vụ: Tạo nội dung trò chơi tình huống khởi động bài học mới cho bài học:
- Môn: ${config.subject}
- Lớp: ${config.grade}
- Bài: ${config.lessonName}
- Hoạt động: ${config.activityType}
- Loại game: ${config.gameType}
${config.activityType === 'practice' ? `- Số lượng câu hỏi: ${config.questionCount}` : ''}
Trò chơi tình huống khởi động là các hoạt động ngắn (3–7 phút) được thiết kế theo tình huống thực tế, giúp học sinh:
- Khởi động não bộ trước khi vào bài mới
- Tạo hứng thú và thu hút sự chú ý
- Kích hoạt kiến thức nền có liên quan đến nội dung học
- Tạo môi trường học tập tích cực, tương tác ngay từ đầu tiết học
Đặc điểm của trò chơi tình huống:
- Có một tình huống thực tế gần gũi, liên quan trực tiếp đến bài học.
- Học sinh phải suy nghĩ – thảo luận – đưa ra lựa chọn.
- Không cần chuẩn bị phức tạp.
- Thời lượng ngắn nhưng tạo hiệu ứng “đặt vấn đề” rất tốt.
- Giúp giáo viên dẫn vào bài tự nhiên, mạch lạc.
Các dạng trò chơi tình huống phổ biến:
1. Tình huống lựa chọn (A/B/C): Ngắn – nhanh – phù hợp mọi môn.
2. Tình huống đóng vai: Một nhóm đóng vai xử lý tình huống → dẫn vào bài.
3. Tình huống quan sát hình ảnh/video: Xem hình → đặt câu hỏi → vào bài mới.
4. Tình huống giải cứu / thử thách: Tạo áp lực nhẹ: "Cần giúp nhân vật vượt qua thử thách".

1. Hãy TÌM KIẾM (dùng công cụ) tình huống mở đầu hoặc nội dung liên quan của bài học này trong SGK (ví dụ, hình ảnh, bài tập, từ khóa quan trọng, tình huống thực tế gần gũi).
2. Tạo dữ liệu trò chơi dưới dạng JSON, dựa trên tình huống thực tế từ SGK, đảm bảo ngắn gọn (3-7 phút), kích thích suy nghĩ/thảo luận, và dẫn dắt tự nhiên vào bài học.
${config.activityType === 'practice' ? `\n Yêu cầu về số lượng: Tạo chính xác ${config.questionCount} mục trong mảng "questions".` : ''}
   - Nếu loại game là fast_quiz hoặc quiz, giữ số lượng câu hỏi ít (2-4) để phù hợp khởi động, tập trung vào lựa chọn nhanh.
   - Nếu loại game là comparison, sequencing, matching, hoặc tương tự, tạo 1-2 item chính với tình huống so sánh/thứ tự/ghép đôi từ bài học.
   - Nếu loại game là keyword_guess, mystery_box, simulation, wheel, tạo 1 item duy nhất với tình huống đoán/đố/mô phỏng thực tế.
   - Tích hợp yếu tố tình huống thực tế (ví dụ: "Trong cuộc sống hàng ngày, khi bạn gặp tình huống X, bạn sẽ làm gì?") để khởi động và kết nối kiến thức nền.
CẤU TRÚC JSON TRẢ VỀ:
{
  "title": "Tên trò chơi (Hấp dẫn, liên quan bài học, gợi ý tình huống thực tế)",
  "description": "Hướng dẫn cách chơi ngắn gọn, nhấn mạnh tình huống thực tế và cách dẫn vào bài học",
  "questions": [ ... danh sách câu hỏi/dữ liệu với tình huống ...]
}
CHI TIẾT CẤU TRÚC "questions" THEO TỪNG LOẠI GAME (Điều chỉnh để phù hợp tình huống khởi động):
*** LOẠI: fast_quiz (Kahoot/Quizizz) ***
Tạo các câu hỏi trắc nghiệm NHANH, ngắn gọn, dựa trên tình huống thực tế, kích thích tư duy.
{
  "id": "fq1",
  "question": "Tình huống: ... Câu hỏi ngắn...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "Đáp án đúng",
  "explanation": "Giải thích siêu ngắn, kết nối vào bài học"
}
*** LOẠI: comparison (Tìm điểm chung/khác) ***
So sánh 2 đối tượng/khái niệm trong bài học qua tình huống thực tế. Chỉ trả về 1 item duy nhất cấu hình game.
{
  "id": "comp1",
  "question": "Tình huống: ... Hãy phân loại các đặc điểm sau vào nhóm phù hợp",
  "comparisonConfig": {
     "groupA": "Đối tượng A (Ví dụ: Tế bào thực vật)",
     "groupB": "Đối tượng B (Ví dụ: Tế bào động vật)",
     "items": [
        { "id": "i1", "content": "Có thành cellulozo", "belongsTo": "A" },
        { "id": "i2", "content": "Có nhân", "belongsTo": "Both" },
        { "id": "i3", "content": "Không có lục lạp", "belongsTo": "B" }
        // Tạo khoảng 4-6 item để ngắn gọn
     ]
  }
}
*** LOẠI: number_grid (Chọn ô số) ***
Tạo chính xác 9 câu hỏi cho 9 ô số, nhưng mỗi câu dựa trên tình huống nhỏ.
{
  "id": "ng1",
  "question": "Tình huống cho ô số 1: ...",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": "Đáp án đúng",
  "explanation": "Giải thích"
}
*** LOẠI: keyword_guess (Bắn tên/Đoán từ khóa) ***
Chỉ trả về 1 item duy nhất, dựa trên tình huống đoán từ khóa chính bài học.
{
  "id": "kg1",
  "question": "Tình huống: ... Đoán chủ đề",
  "keywordConfig": {
     "keywords": ["Từ khóa 1", "Từ khóa 2", "Từ khóa 3", "Từ khóa 4"],
     "finalAnswer": "Tên chủ đề/bài học cần đoán"
  }
}
*** LOẠI: mystery_box (Hộp bí mật) ***
Chỉ trả về 1 item duy nhất, với tình huống hộp bí mật thực tế.
{
  "id": "mb1",
  "question": "Tình huống: Trong hộp bí mật có gì liên quan đến bài học?",
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
Chỉ trả về 1 phần tử cấu hình toàn bộ màn chơi Kéo-Thả, dựa trên tình huống mô phỏng thực tế.
{
  "id": "sim1",
  "question": "Tình huống: ... Câu lệnh hướng dẫn...",
  "simulationConfig": {
     "backgroundTheme": "Mô tả bối cảnh thực tế",
     "zones": [
        { "id": "z1", "label": "Khu vực 1", "color": "#e0f2fe" },
        { "id": "z2", "label": "Khu vực 2", "color": "#fce7f3" }
     ],
     "items": [
        { "id": "i1", "content": "Nội dung", "zoneId": "z1" }
        // Tạo khoảng 4-6 item để ngắn
     ]
  }
}
*** LOẠI: sequencing (Sắp xếp thứ tự) ***
{
  "id": "seq1",
  "question": "Tình huống: Sắp xếp theo thứ tự...",
  "sequenceOrder": 1, // 1, 2, 3...
  "content": "Nội dung bước"
}
*** LOẠI: quiz (Trắc nghiệm thường) ***
{ "id": "q1", "question": "Tình huống: ...", "options": ["..."], "correctAnswer": "...", "explanation": "..." }
*** LOẠI: matching (Ghép đôi) ***
{ "id": "m1", "question": "Tình huống: ...", "matchPair": { "left": "...", "right": "..." } }
*** LOẠI: wheel (Vòng quay) ***
{ "id": "w1", "question": "Tình huống: ...", "wheelLabel": "...", "correctAnswer": "...", "explanation": "..." }
YÊU CẦU: JSON thuần, không markdown, nội dung chính xác SGK, đảm bảo tình huống thực tế và khởi động hiệu quả.
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
