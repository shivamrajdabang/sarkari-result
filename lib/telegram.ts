const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID!

export async function sendTelegramMessage(text: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHANNEL_ID,
          text,
          parse_mode: 'HTML',
          disable_web_page_preview: false,
        }),
      }
    )
    const data = await res.json()
    return data.ok
  } catch {
    return false
  }
}

export function formatJobPost(job: {
  title: string
  department: string
  total_vacancy: number
  last_date: string
  slug: string
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sarkari-result.vercel.app'
  return `🔴 <b>New Job Alert!</b>

📋 <b>${job.title}</b>
🏢 ${job.department}
👥 Total Vacancy: ${job.total_vacancy}
📅 Last Date: ${job.last_date}

🔗 <a href="${siteUrl}/jobs/${job.slug}">Full Details & Apply Link</a>

@sarkarijob1111`
}
