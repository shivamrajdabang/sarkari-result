export interface JobPost {
  id: string
  title: string
  slug: string
  department: string
  category: string
  total_vacancy: number
  post_wise_vacancy: string
  eligibility_age: string
  eligibility_education: string
  start_date: string
  last_date: string
  exam_date: string | null
  application_fee: string
  how_to_apply: string
  official_site: string
  apply_link: string
  notification_pdf: string
  content: string
  published: boolean
  telegram_sent: boolean
  created_at: string
}

export type JobCategory = 'Railway' | 'SSC' | 'Bank' | 'State PSC' | 'Police' | 'Army' | 'Other'
