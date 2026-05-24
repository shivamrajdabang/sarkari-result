import { NextRequest, NextResponse } from "next/server";
import { sendTelegramMessage, formatJobPost } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const body = await req.json();

  const { data: job, error } = await supabaseAdmin
    .from("job_posts")
    .insert({ ...body, published: true, telegram_sent: false })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const message = formatJobPost(job);
  const sent = await sendTelegramMessage(message);

  await supabaseAdmin.from("job_posts").update({ telegram_sent: sent }).eq("id", job.id);

  return NextResponse.json({ success: true, job, telegram_sent: sent });
}
