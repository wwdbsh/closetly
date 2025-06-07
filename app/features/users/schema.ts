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
  primaryKey,
  serial,
} from "drizzle-orm/pg-core";

// enum 정의
export const userRoleEnum = pgEnum("user_role", ["client", "counselor"]);
export const counselingMethodEnum = pgEnum("counseling_method", ["chat", "phone", "video"]);

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
    role: userRoleEnum().notNull().default("client"),
    avatar_url: text(),
    marketing_consent: boolean("marketing_consent").notNull().default(false),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
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
    sql`CREATE INDEX idx_profiles_role ON profiles(role)`,
  ],
);

export const clients = pgTable("clients", {
  client_id: uuid()
    .primaryKey()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  nickname: text().unique().notNull(),
  avatar_background_color: text().$type<`#${string}`>().notNull(),
  ...timestamps,
}, (table) => [
  // 본인만 자신의 row를 조회/수정/삭제할 수 있도록 RLS 정책 추가
  pgPolicy("edit-client-policy", {
    for: "update",
    to: authenticatedRole,
    as: "permissive",
    withCheck: sql`${authUid} = ${table.client_id}`,
    using: sql`${authUid} = ${table.client_id}`,
  }),
  pgPolicy("delete-client-policy", {
    for: "delete",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.client_id}`,
  }),
  pgPolicy("select-client-policy", {
    for: "select",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.client_id}`,
  }),
]);

export const counselors = pgTable("counselors", {
  counselor_id: uuid()
    .primaryKey()
    .references(() => profiles.profile_id, { onDelete: "cascade" }),
  total_counseling_count: integer("total_counseling_count").notNull().default(0),
  years_of_experience: integer("years_of_experience").notNull().default(0),
  is_verified: boolean("is_verified").notNull().default(false),
  short_introduction: text(),
  center_name: text(),
  center_address: text(),
  average_rating: numeric("average_rating", { precision: 3, scale: 2 }).notNull().default("0.00"),
  review_count: integer("review_count").notNull().default(0),
  introduction_greeting: text(),
  ...timestamps,
}, (table) => [
  // 본인만 자신의 row를 조회/수정/삭제할 수 있도록 RLS 정책 추가
  pgPolicy("edit-counselorcounselor-policy", {
    for: "update",
    to: authenticatedRole,
    as: "permissive",
    withCheck: sql`${authUid} = ${table.counselor_id}`,
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("delete-counselor-policy", {
    for: "delete",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("select-counselor-policy", {
    for: "select",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
]);

export const counselorAvailableMethods = pgTable("counselor_available_methods", {
  counselor_id: uuid()
    .notNull()
    .references(() => counselors.counselor_id, { onDelete: "cascade" }),
  method: counselingMethodEnum("method").notNull(),
  price_per_hour: integer("price_per_hour").notNull(),
  is_active: boolean("is_active").notNull().default(true),
  ...timestamps,
}, (table) => [
  primaryKey({
    columns: [table.counselor_id, table.method],
  }),
  pgPolicy("edit-counselor-method-policy", {
    for: "update",
    to: authenticatedRole,
    as: "permissive",
    withCheck: sql`${authUid} = ${table.counselor_id}`,
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("delete-counselor-method-policy", {
    for: "delete",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("select-counselor-method-policy", {
    for: "select",
    to: authenticatedRole,
    as: "permissive",
    using: sql`true`,
  }),
]);

export const counselorIntroductionItems = pgTable("counselor_introduction_items", {
  item_id: serial("item_id").primaryKey(),
  counselor_id: uuid()
    .notNull()
    .references(() => counselors.counselor_id, { onDelete: "cascade" }),
  title: text().notNull(),
  description: text().notNull(),
  display_order: integer("display_order").notNull(),
  ...timestamps,
}, (table) => [
  sql`CREATE UNIQUE INDEX idx_counselor_item_order ON counselor_introduction_items(counselor_id, display_order)`,
  pgPolicy("edit-counselor-item-policy", {
    for: "update",
    to: authenticatedRole,
    as: "permissive",
    withCheck: sql`${authUid} = ${table.counselor_id}`,
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("delete-counselor-item-policy", {
    for: "delete",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("select-counselor-item-policy", {
    for: "select",
    to: authenticatedRole,
    as: "permissive",
    using: sql`true`,
  }),
]);

export const counselorArticles = pgTable("counselor_articles", {
  article_id: serial("article_id").primaryKey(),
  counselor_id: uuid()
    .notNull()
    .references(() => counselors.counselor_id, { onDelete: "cascade" }),
  title: text().notNull(),
  institution: text(),
  published_date: timestamp("published_date", { withTimezone: true }),
  article_url: text().notNull(),
  ...timestamps,
}, (table) => [
  sql`CREATE INDEX idx_counselor_articles_counselor_id ON counselor_articles(counselor_id)`,
  pgPolicy("edit-counselor-article-policy", {
    for: "update",
    to: authenticatedRole,
    as: "permissive",
    withCheck: sql`${authUid} = ${table.counselor_id}`,
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("delete-counselor-article-policy", {
    for: "delete",
    to: authenticatedRole,
    as: "permissive",
    using: sql`${authUid} = ${table.counselor_id}`,
  }),
  pgPolicy("select-counselor-article-policy", {
    for: "select",
    to: authenticatedRole,
    as: "permissive",
    using: sql`true`,
  }),
]);

// export const chatRooms = pgTable("chat_rooms", {
//   chat_room_id: bigint("chat_room_id", { mode: "bigint" }).primaryKey(),
//   // 필요한 다른 필드들 추가
// });

// export const chatMessages = pgTable("chat_messages", {
//   message_id: bigint("message_id", { mode: "bigint" }).primaryKey(),
//   chat_room_id: bigint("chat_room_id", { mode: "bigint" }).references(() => chatRooms.chat_room_id, { onDelete: "cascade" }),
//   session_id: bigint("session_id", { mode: "bigint" }).references(() => counselingSessions.session_id, { onDelete: "cascade" }),
//   sender_id: uuid()
//     .notNull()
//     .references(() => profiles.profile_id, { onDelete: "set null" }),
//   message_content: text().notNull(),
//   sent_at: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
//   is_read: boolean("is_read").notNull().default(false),
// }, (table) => [
//   sql`CREATE INDEX idx_chat_messages_chat_room_id_sent_at ON chat_messages(chat_room_id, sent_at)`,
//   sql`CREATE INDEX idx_chat_messages_session_id_sent_at ON chat_messages(session_id, sent_at)`,
//   sql`CREATE INDEX idx_chat_messages_sender_id ON chat_messages(sender_id)`,
//   sql`ALTER TABLE chat_messages ADD CONSTRAINT check_message_context CHECK (
//     (chat_room_id IS NOT NULL AND session_id IS NULL) OR
//     (chat_room_id IS NULL AND session_id IS NOT NULL)
//   )`,
// ]);

// export const reviews = pgTable("reviews", {
//   review_id: bigint("review_id", { mode: "bigint" }).primaryKey(),
//   session_id: bigint("session_id", { mode: "bigint" }).notNull().unique().references(() => counselingSessions.session_id, { onDelete: "cascade" }),
//   client_id: uuid()
//     .notNull()
//     .references(() => profiles.profile_id, { onDelete: "cascade" }),
//   counselor_id: uuid()
//     .notNull()
//     .references(() => counselors.counselor_id, { onDelete: "cascade" }),
//   rating_professionalism: numeric("rating_professionalism", { precision: 2, scale: 1 }).notNull(),
//   rating_effectiveness: numeric("rating_effectiveness", { precision: 2, scale: 1 }).notNull(),
//   rating_kindness: numeric("rating_kindness", { precision: 2, scale: 1 }).notNull(),
//   overall_rating: numeric("overall_rating", { precision: 3, scale: 2 }).notNull(),
//   comment: text("comment"),
//   created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
//   updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
// }, (table) => [
//   sql`CREATE INDEX idx_reviews_session_id ON reviews(session_id)`,
//   sql`CREATE INDEX idx_reviews_client_id ON reviews(client_id)`,
//   sql`CREATE INDEX idx_reviews_counselor_id ON reviews(counselor_id)`,
//   sql`CREATE INDEX idx_reviews_created_at ON reviews(created_at)`,
//   sql`ALTER TABLE reviews ADD CONSTRAINT check_rating_professionalism CHECK (rating_professionalism >= 0.5 AND rating_professionalism <= 5.0 AND MOD(rating_professionalism * 2, 1) = 0)`,
//   sql`ALTER TABLE reviews ADD CONSTRAINT check_rating_effectiveness CHECK (rating_effectiveness >= 0.5 AND rating_effectiveness <= 5.0 AND MOD(rating_effectiveness * 2, 1) = 0)`,
//   sql`ALTER TABLE reviews ADD CONSTRAINT check_rating_kindness CHECK (rating_kindness >= 0.5 AND rating_kindness <= 5.0 AND MOD(rating_kindness * 2, 1) = 0)`,
//   sql`ALTER TABLE reviews ADD CONSTRAINT check_overall_rating CHECK (overall_rating >= 0.50 AND overall_rating <= 5.00)`,
// ]);