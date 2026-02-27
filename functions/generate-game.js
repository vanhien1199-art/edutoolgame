import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequestPost(context) {
    const { request, env } = context;

    // Cấu hình CORS
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json"
    };

    if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const body = await request.json();
        const { config, licenseKey } = body;

        // ---------------------------------------------------------
        // 1. KIỂM TRA MÃ KÍCH HOẠT & TRỪ TIỀN (KV)
        // ---------------------------------------------------------
        if (!env.LICENSE_KV) {
            return new Response(JSON.stringify({ error: "Lỗi hệ thống: Chưa cấu hình LICENSE_KV" }), { status: 500, headers: corsHeaders });
        }
        if (!env.GOOGLE_API_KEY) {
            return new Response(JSON.stringify({ error: "Lỗi hệ thống: Chưa cấu hình GOOGLE_API_KEY" }), { status: 500, headers: corsHeaders });
        }

        if (!licenseKey) {
            return new Response(JSON.stringify({ error: "Vui lòng nhập Mã kích hoạt!" }), { status: 403, headers: corsHeaders });
        }

        // Bỏ qua trừ tiền nếu là mã DEMO-2025
        if (licenseKey !== 'DEMO-2025') {
            const creditStr = await env.LICENSE_KV.get(licenseKey);

            if (creditStr === null) {
                return new Response(JSON.stringify({ error: "⛔ MÃ KHÔNG TỒN TẠI! Vui lòng liên hệ Admin." }), { status: 403, headers: corsHeaders });
            }

            let currentCredit = parseInt(creditStr);
            if (isNaN(currentCredit)) currentCredit = 0;

            if (currentCredit <= 0) {
                return new Response(JSON.stringify({ error: "⛔ MÃ ĐÃ HẾT LƯỢT SỬ DỤNG. Vui lòng nạp thêm!" }), { status: 402, headers: corsHeaders });
            }

            // Trừ 1 lượt
            await env.LICENSE_KV.put(licenseKey, (currentCredit - 1).toString());
        }

        // ---------------------------------------------------------
        // 2. GỌI GEMINI AI (SERVER SIDE)
        // ---------------------------------------------------------
        
        const genAI = new GoogleGenerativeAI(env.GOOGLE_API_KEY);
        // Sử dụng 1.5-flash để đảm bảo ổn định (2.5 hiện chưa public API rộng rãi)
        const modelId = "gemini-3-pro-preview"; 
        const model = genAI.getGenerativeModel({ model: modelId });

        // --- BẮT ĐẦU PROMPT (GIỮ NGUYÊN TUYỆT ĐỐI) ---
        const prompt = `
  Bạn là một chuyên gia giáo dục Việt Nam, am hiểu chương trình GDPT 2018 và nội dung SGK ${config.bookSeries}.
Nhiệm vụ: Tạo nội dung trò chơi tình huống khởi động bài học mới cho bài học:
- Môn: ${config.subject}
- Lớp: ${config.grade}
- Bài: ${config.lessonName}
- Hoạt động: ${config.activityType}
- Loại game: ${config.gameType}
${config.activityType === 'practice' ? `- Số lượng câu hỏi: ${config.questionCount}` : ''}
  1. Hãy TÌM KIẾM (dùng công cụ) tình huống mở đầu hoặc nội dung liên quan của bài học trong SGK (ví dụ, hình ảnh, bài tập, từ khóa quan trọng).
  2. Tạo dữ liệu trò chơi dưới dạng JSON.
  ${config.activityType === 'practice' ? `\n  Yêu cầu về số lượng: Tạo chính xác ${config.questionCount} mục trong mảng "questions".` : ''}
${config.activityType === 'warmup' ? `
  *** NGUYÊN TẮC VÀNG KHI TẠO GAME KHỞI ĐỘNG ***
  Game khởi động phải là một TÌNH HUỐNG THỰC TẾ, ngắn (3-5 phút) để kích thích tư duy và kết nối vào bài học.
  - Đặc điểm: Gần gũi, yêu cầu học sinh suy nghĩ và lựa chọn, giúp giáo viên dẫn dắt vào bài một cách tự nhiên.
  - Yêu cầu: Bắt buộc phải tạo ra một kịch bản/tình huống cụ thể, không chỉ là câu hỏi lý thuyết đơn thuần.

  - Ví dụ theo môn:
    * Toán: Tình huống "Cứu trợ toán học" - máy bay cần tính nhiên liệu theo công thức trong bài.
    * Tin học: Tình huống "Máy tính bị lỗi!" - chọn cách xử lý sự cố mạng/file.
    * Lịch sử: Tình huống "Bạn sẽ làm gì nếu là họ?" - đặt học sinh vào một bối cảnh lịch sử và yêu cầu đưa ra quyết định.
    * Khoa học / Vật lý: Tình huống "Lựa chọn an toàn" - xử lý thế nào khi thiết bị điện bị chập.
   
  Hãy áp dụng triệt để tư duy này để tạo ra nội dung game khởi động hấp dẫn và ý nghĩa.
  ` : ''}

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
        // --- KẾT THÚC PROMPT ---

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text();
        
        // Xử lý làm sạch JSON
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Trả về JSON cho Client
        return new Response(text, { headers: corsHeaders });

    } catch (error) {
        console.error("Generate Game Error:", error);
        return new Response(JSON.stringify({ error: "Lỗi xử lý: " + error.message }), { status: 500, headers: corsHeaders });
    }
}


