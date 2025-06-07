import { z } from "zod";

export const counselorViewSchema = z.object({
  profile_id: z.string(),
  name: z.string(),
  avatar_url: z.string(),
  marketing_consent: z.boolean(),
  total_counseling_count: z.number(),
  years_of_experience: z.number(),
  is_verified: z.boolean(),
  short_introduction: z.string(),
  center_name: z.string(),
  center_address: z.string(),
  average_rating: z.number(),
  review_count: z.number(),
  introduction_greeting: z.string(),
})