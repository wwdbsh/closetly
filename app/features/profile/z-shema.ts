import { z } from "zod";

export const counselorSchema = z.object({
  profile_id: z.string().uuid("Invalid profile ID format"),
  name: z.string().min(1, "Name is required"),
  role: z.string().optional(),
  avatar_url: z.string().optional(),
  counselor_id: z.string().uuid("Invalid counselor ID format").optional(),
  short_introduction: z.string().optional(),
  total_counseling_count: z.coerce.number().int().min(0).optional(),
  years_of_experience: z.coerce.number().int().min(0, "Experience must be non-negative").optional(),
  average_rating: z.coerce.number().min(0).max(5).optional(),
  review_count: z.coerce.number().int().min(0).optional(),
  center_name: z.string().optional(),
  center_address: z.string().optional(),
  introduction_greeting: z.string().optional(),
  is_verified: z.coerce.boolean().optional(),
  articles: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    institution: z.string().min(1, "Institution is required"),
    published_date: z.coerce.date(),
    article_url: z.string().url("Invalid article URL format"),
  })),
  methods: z.array(z.object({
    method: z.string().min(1, "Method is required"),
    price_per_hour: z.number(),
  })),
  introItems: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    display_order: z.number().int(),
  })),
});

export const loaderDataSchema = z.object({
  counselor: z.object({
    name: z.string().min(1, "Name is required"),
    avatar_url: z.string().optional(),
    short_introduction: z.string().optional(),
    introduction_greeting: z.string().optional(),
    total_counseling_count: z.coerce.number().int().min(0),
    years_of_experience: z.coerce.number().int().min(0).optional(),
    average_rating: z.number().min(0).max(5).optional(),
    review_count: z.number().int().min(0).optional(),
    center_name: z.string().optional(),
    center_address: z.string().optional(),
    is_verified: z.boolean().optional(),
    articles: z.array(z.object({
      title: z.string().min(1, "Title is required"),
      institution: z.string().min(1, "Institution is required"),
      published_date: z.coerce.date(),
      article_url: z.string().url("Invalid article URL format"),
    })),
    methods: z.array(z.object({
      method: z.string().min(1, "Method is required"),
      price_per_hour: z.number(),
    })),
    introItems: z.array(z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      display_order: z.number().int(),
    })),
    slug: z.string().min(1, "Slug is required"),
  }),
});