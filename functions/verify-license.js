// functions/verify-license.js

export async function onRequestPost(context) {
    const { request, env } = context;

    try {
        const { licenseKey } = await request.json();

        if (!licenseKey) {
            return new Response(JSON.stringify({ valid: false, message: "Vui lòng nhập mã." }), { status: 400 });
        }

        // --- LOGIC KIỂM TRA MÃ ---
        let isValid = false;

        // CÁCH 1: Kiểm tra mã cứng (Dùng để test ngay)
        if (licenseKey === "DEMO-2025" || licenseKey === "VIP-TEACHER") {
            isValid = true;
        }

        // CÁCH 2: Kiểm tra từ Cloudflare KV (Cần tạo KV Namespace tên là LICENSE_KV)
        if (env.LICENSE_KV) {
             const storedValue = await env.LICENSE_KV.get(licenseKey);
             if (storedValue === "active") isValid = true;
         }

        if (isValid) {
            return new Response(JSON.stringify({ valid: true, message: "Kích hoạt thành công!" }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ valid: false, message: "Mã kích hoạt không đúng hoặc đã hết hạn." }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }

}

