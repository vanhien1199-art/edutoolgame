import { GoogleGenerativeAI } from '@google/generative-ai';

const lessonPrompts = {
    'default': `Bạn là một trợ giảng chung cho môn Khoa học Tự nhiên.`
};

export async function onRequest(context) {
    // Lấy API Key từ biến môi trường của Cloudflare (Backend dùng GOOGLE_API_KEY)
    const apiKey = context.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'Lỗi cấu hình server: Thiếu API Key' }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    if (context.request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const { question, lesson_id } = await context.request.json();
        
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = lessonPrompts[lesson_id] || lessonPrompts['default'];
        const fullPrompt = `${systemPrompt}\n\nCâu hỏi của học sinh: "${question}"`;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const aiResponse = response.text();

        return new Response(JSON.stringify({ answer: aiResponse }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}