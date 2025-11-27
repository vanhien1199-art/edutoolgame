import { GameConfig, GeneratedContent } from "../types";

export const generateGameContent = async (config: GameConfig, licenseKey: string): Promise<GeneratedContent> => {
  try {
    // Gọi về Server Cloudflare của bạn
    const response = await fetch('/generate-game', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        config: config, 
        licenseKey: licenseKey // Gửi kèm mã để server trừ tiền
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Lỗi tạo game từ máy chủ.");
    }

    // Xử lý ID cho câu hỏi để React render không lỗi
    if (data.questions) {
      data.questions = data.questions.map((q: any, i: number) => ({
         ...q,
         id: q.id || `gen_${Date.now()}_${i}`
      }));
    }

    return data as GeneratedContent;

  } catch (error: any) {
    console.error("API Error", error);
    throw new Error(error.message || "Không thể kết nối Server.");
  }
};
