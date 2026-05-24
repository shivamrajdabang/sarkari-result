import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { url, rawText } = await req.json();

  let content = rawText || "";

  // URL se content fetch karo
  if (url && !rawText) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      });
      const html = await res.text();
      // HTML tags remove karo, sirf text rakho
      content = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .substring(0, 8000)
        .trim();
    } catch {
      return NextResponse.json({ error: "URL fetch nahi hua. Text copy karke do." }, { status: 400 });
    }
  }

  if (!content) {
    return NextResponse.json({ error: "Content nahi mila" }, { status: 400 });
  }

  // Claude API se rewrite karwao
  const prompt = `Tu ek sarkari job website ka content editor hai. Neeche diya gaya raw content ek government job notification ka hai.

Is content se ye information extract karke EXACTLY is JSON format mein do:

{
  "title": "Job ka poora naam (jaise: SSC CGL 2025 Recruitment)",
  "slug": "url-friendly-slug-with-hyphens",
  "department": "Department/Board ka naam",
  "category": "Railway/SSC/Bank/State PSC/Police/Army/Other mein se ek",
  "total_vacancy": 0,
  "post_wise_vacancy": "Post A: X posts\nPost B: Y posts",
  "eligibility_age": "Min-Max years (jaise: 18-27 years)",
  "eligibility_education": "Required qualification",
  "start_date": "DD-MM-YYYY format",
  "last_date": "DD-MM-YYYY format",
  "exam_date": "DD-MM-YYYY ya blank",
  "application_fee": "General: Rs X\nSC/ST: Rs Y\nMahila: Free",
  "how_to_apply": "Step 1: Official website kholo\nStep 2: Register karo\nStep 3: Form fill karo\nStep 4: Fee pay karo\nStep 5: Submit karo",
  "official_site": "https://...",
  "apply_link": "https://... ya blank",
  "notification_pdf": "https://... ya blank"
}

Sirf JSON do, koi extra text nahi. Agar koi field nahi mile to blank string do.

RAW CONTENT:
${content}`;

  try {
    const claudeRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const claudeData = await claudeRes.json();
    const text = claudeData.content?.[0]?.text || "";

    // JSON extract karo
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI se response nahi mila", raw: text }, { status: 500 });
    }

    const jobData = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, job: jobData });
  } catch (e) {
    return NextResponse.json({ error: "AI processing failed: " + String(e) }, { status: 500 });
  }
}
