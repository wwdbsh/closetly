/**
 * User Profile Schema
 * 
 * This file defines the database schema for user profiles and sets up
 * Supabase Row Level Security (RLS) policies to control data access.
 */
import { sql } from "drizzle-orm";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";
import { timestamps } from "~/core/db/helpers.server";
import { 
  boolean,
  pgPolicy,
  pgTable,
  text,
  uuid,
  bigint,
  pgEnum,
  timestamp,
  integer,
  numeric,
  varchar,
} from "drizzle-orm/pg-core";
import { counselingSessions } from "../counselors/schema";

/**
 * Profiles Table
 * 
 * Stores additional user profile information beyond the core auth data.
 * Links to Supabase auth.users table via profile_id foreign key.
 * 
 * Includes Row Level Security (RLS) policies to ensure users can only
 * access and modify their own profile data.
 */
export const profiles = pgTable(
  "profiles",
  {
    // Primary key that references the Supabase auth.users id
    // Using CASCADE ensures profile is deleted when user is deleted
    profile_id: uuid()
      .primaryKey()
      .references(() => authUsers.id, {
        onDelete: "cascade",
      }),
    name: text().notNull(),
    avatar_url: text(),
    marketing_consent: boolean("marketing_consent").notNull().default(false),
    // Adds created_at and updated_at timestamp columns
    ...timestamps,
  },
  (table) => [
    // RLS Policy: Users can only update their own profile
    pgPolicy("edit-profile-policy", {
      for: "update",
      to: authenticatedRole,
      as: "permissive",
      withCheck: sql`${authUid} = ${table.profile_id}`,
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only delete their own profile
    pgPolicy("delete-profile-policy", {
      for: "delete",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
    // RLS Policy: Users can only view their own profile
    pgPolicy("select-profile-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.profile_id}`,
    }),
  ],
);

// user_role enum 정의
export const userRoleEnum = pgEnum("user_role", ["client", "counselor"]);

// users 테이블 정의
export const users = pgTable(
  "users",
  {
    user_id: uuid("user_id").primaryKey().references(() => authUsers.id, { onDelete: "cascade" }),
    role: userRoleEnum("role").notNull(),
    email: text("email").notNull().unique(),
    nickname: text("nickname").unique(),
    avatar_background_color: text("avatar_background_color").$type<`#${string}`>(),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    sql`CREATE INDEX idx_users_email ON users(email)`,
    sql`CREATE INDEX idx_users_role ON users(role)`,
  ],
);

export const clients = pgTable("clients", {
  client_user_id: uuid("client_user_id")
    .primaryKey()
    .references(() => users.user_id, { onDelete: "cascade" }),
});

export const counselors = pgTable("counselors", {
  counselor_user_id: uuid("counselor_user_id")
    .primaryKey()
    .references(() => users.user_id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  profile_image_url: varchar("profile_image_url", { length: 2048 }),
  total_counseling_count: integer("total_counseling_count").notNull().default(0),
  years_of_experience: integer("years_of_experience").notNull().default(0),
  is_verified: boolean("is_verified").notNull().default(false),
  short_introduction: varchar("short_introduction", { length: 300 }),
  center_name: varchar("center_name", { length: 255 }),
  center_address: varchar("center_address", { length: 500 }),
  average_rating: numeric("average_rating", { precision: 3, scale: 2 }).notNull().default("0.00"),
  review_count: integer("review_count").notNull().default(0),
  introduction_greeting: text("introduction_greeting"),
}, (table) => [
  sql`CREATE INDEX idx_counselors_name ON counselors(name)`
]);

export const counselingMethodEnum = pgEnum("counseling_method", ["chat", "phone", "video", "visit"]);

export const counselorAvailableMethods = pgTable("counselor_available_methods", {
  available_method_id: bigint("available_method_id", { mode: "bigint" }).primaryKey(),
  counselor_id: uuid("counselor_id").notNull().references(() => counselors.counselor_user_id, { onDelete: "cascade" }),
  method: counselingMethodEnum("method").notNull(),
  price_per_hour: integer("price_per_hour").notNull(),
  is_active: boolean("is_active").notNull().default(true),
}, (table) => [
  sql`CREATE UNIQUE INDEX idx_counselor_available_methods_counselor_id_method ON counselor_available_methods(counselor_id, method)`,
  sql`CREATE INDEX idx_counselor_available_methods_counselor_id ON counselor_available_methods(counselor_id)`
]);

export const counselorIntroductionItems = pgTable("counselor_introduction_items", {
  item_id: bigint("item_id", { mode: "bigint" }).primaryKey(),
  counselor_id: uuid("counselor_id").notNull().references(() => counselors.counselor_user_id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  display_order: integer("display_order").notNull(),
}, (table) => [
  sql`CREATE INDEX idx_counselor_introduction_items_counselor_id ON counselor_introduction_items(counselor_id)`
]);

export const counselorArticles = pgTable("counselor_articles", {
  article_id: bigint("article_id", { mode: "bigint" }).primaryKey(),
  counselor_id: uuid("counselor_id").notNull().references(() => counselors.counselor_user_id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }),
  published_date: timestamp("published_date", { withTimezone: true }),
  article_url: varchar("article_url", { length: 2048 }).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  sql`CREATE INDEX idx_counselor_articles_counselor_id ON counselor_articles(counselor_id)`
]);

export const chatRooms = pgTable("chat_rooms", {
  chat_room_id: bigint("chat_room_id", { mode: "bigint" }).primaryKey(),
  // 필요한 다른 필드들 추가
});

export const chatMessages = pgTable("chat_messages", {
  message_id: bigint("message_id", { mode: "bigint" }).primaryKey(),
  chat_room_id: bigint("chat_room_id", { mode: "bigint" }).references(() => chatRooms.chat_room_id, { onDelete: "cascade" }),
  session_id: bigint("session_id", { mode: "bigint" }).references(() => counselingSessions.session_id, { onDelete: "cascade" }),
  sender_user_id: uuid("sender_user_id").notNull().references(() => users.user_id, { onDelete: "set null" }),
  message_content: text("message_content").notNull(),
  sent_at: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
  is_read: boolean("is_read").notNull().default(false),
}, (table) => [
  sql`CREATE INDEX idx_chat_messages_chat_room_id_sent_at ON chat_messages(chat_room_id, sent_at)`,
  sql`CREATE INDEX idx_chat_messages_session_id_sent_at ON chat_messages(session_id, sent_at)`,
  sql`CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_user_id)`,
  sql`ALTER TABLE chat_messages ADD CONSTRAINT check_message_context CHECK (
    (chat_room_id IS NOT NULL AND session_id IS NULL) OR
    (chat_room_id IS NULL AND session_id IS NOT NULL)
  )`,
]);

export const reviews = pgTable("reviews", {
  review_id: bigint("review_id", { mode: "bigint" }).primaryKey(),
  session_id: bigint("session_id", { mode: "bigint" }).notNull().unique().references(() => counselingSessions.session_id, { onDelete: "cascade" }),
  client_user_id: uuid("client_user_id").notNull().references(() => users.user_id, { onDelete: "cascade" }),
  counselor_user_id: uuid("counselor_user_id").notNull().references(() => users.user_id, { onDelete: "cascade" }),
  rating_professionalism: numeric("rating_professionalism", { precision: 2, scale: 1 }).notNull(),
  rating_effectiveness: numeric("rating_effectiveness", { precision: 2, scale: 1 }).notNull(),
  rating_kindness: numeric("rating_kindness", { precision: 2, scale: 1 }).notNull(),
  overall_rating: numeric("overall_rating", { precision: 3, scale: 2 }).notNull(),
  comment: text("comment"),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  sql`CREATE INDEX idx_reviews_session_id ON reviews(session_id)`,
  sql`CREATE INDEX idx_reviews_client_id ON reviews(client_user_id)`,
  sql`CREATE INDEX idx_reviews_counselor_id ON reviews(counselor_user_id)`,
  sql`CREATE INDEX idx_reviews_created_at ON reviews(created_at)`,
  sql`ALTER TABLE reviews ADD CONSTRAINT check_rating_professionalism CHECK (rating_professionalism >= 0.5 AND rating_professionalism <= 5.0 AND MOD(rating_professionalism * 2, 1) = 0)`,
  sql`ALTER TABLE reviews ADD CONSTRAINT check_rating_effectiveness CHECK (rating_effectiveness >= 0.5 AND rating_effectiveness <= 5.0 AND MOD(rating_effectiveness * 2, 1) = 0)`,
  sql`ALTER TABLE reviews ADD CONSTRAINT check_rating_kindness CHECK (rating_kindness >= 0.5 AND rating_kindness <= 5.0 AND MOD(rating_kindness * 2, 1) = 0)`,
  sql`ALTER TABLE reviews ADD CONSTRAINT check_overall_rating CHECK (overall_rating >= 0.50 AND overall_rating <= 5.00)`,
]);