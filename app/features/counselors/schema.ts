// import { bigint, integer, pgEnum, pgTable, text, timestamp, varchar, primaryKey, uuid } from "drizzle-orm/pg-core";
// import { counselingMethodEnum, counselorAvailableMethods, users } from "../users/schema";
// import { sql } from "drizzle-orm";

// export const placeCategories = pgTable("place_categories", {
//   place_category_id: integer("place_category_id").primaryKey(),
//   name: varchar("name", { length: 100 }).notNull().unique(),
// });

// export const situationCategories = pgTable("situation_categories", {
//   situation_category_id: integer("situation_category_id").primaryKey(),
//   name: varchar("name", { length: 100 }).notNull().unique(),
// });

// export const symptomCategories = pgTable("symptom_categories", {
//   symptom_category_id: integer("symptom_category_id").primaryKey(),
//   name: varchar("name", { length: 100 }).notNull().unique(),
// });


// export const ageGroupRangeEnum = pgEnum("age_group_range", ["10-19", "20-29", "30-39", "40-49", "50-59", "60+"]);
// export const genderTypeEnum = pgEnum("gender_type", ["male", "female"]);
// export const applicationStatusEnum = pgEnum("application_status", ["pending_approval", "accepted", "rejected", "canceled_by_client", "awaiting_confirmation"]);

// export const counselingApplications = pgTable("counseling_applications", {
//   application_id: bigint("application_id", { mode: "bigint" }).primaryKey(),
//   client_user_id: uuid("client_user_id").notNull().references(() => users.user_id, { onDelete: "restrict" }),
//   counselor_user_id: uuid("counselor_user_id").notNull().references(() => users.user_id, { onDelete: "restrict" }),
//   selected_method_id: bigint("selected_method_id", { mode: "bigint" }).notNull().references(() => counselorAvailableMethods.available_method_id, { onDelete: "restrict" }),
//   applied_price_per_hour: integer("applied_price_per_hour").notNull(),
//   age_group: ageGroupRangeEnum("age_group"),
//   gender: genderTypeEnum("gender"),
//   additional_details: text("additional_details"),
//   status: applicationStatusEnum("status").notNull().default("pending_approval"),
//   created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
//   updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
// }, (table) => [
//   sql`CREATE INDEX idx_counseling_applications_client_id ON counseling_applications(client_user_id)`,
//   sql`CREATE INDEX idx_counseling_applications_counselor_id ON counseling_applications(counselor_user_id)`,
//   sql`CREATE INDEX idx_counseling_applications_status ON counseling_applications(status)`
// ]);

// export const applicationPreferredDates = pgTable("application_preferred_dates", {
//   preferred_date_id: bigint("preferred_date_id", { mode: "bigint" }).primaryKey(),
//   application_id: bigint("application_id", { mode: "bigint" }).notNull().references(() => counselingApplications.application_id, { onDelete: "cascade" }),
//   preferred_date: timestamp("preferred_date").notNull(),
// }, (table) => [
//   sql`CREATE UNIQUE INDEX idx_application_preferred_dates_application_id_date ON application_preferred_dates(application_id, preferred_date)`,
//   sql`CREATE INDEX idx_application_preferred_dates_application_id ON application_preferred_dates(application_id)`
// ]);

// export const applicationPreferredTimes = pgTable("application_preferred_times", {
//   preferred_time_id: bigint("preferred_time_id", { mode: "bigint" }).primaryKey(),
//   application_id: bigint("application_id", { mode: "bigint" }).notNull().references(() => counselingApplications.application_id, { onDelete: "cascade" }),
//   preferred_time: timestamp("preferred_time").notNull(),
// }, (table) => [
//   sql`CREATE UNIQUE INDEX idx_application_preferred_times_application_id_time ON application_preferred_times(application_id, preferred_time)`,
//   sql`CREATE INDEX idx_application_preferred_times_application_id ON application_preferred_times(application_id)`
// ]);

// export const applicationPlaces = pgTable("application_places", {
//   application_id: bigint("application_id", { mode: "bigint" }).notNull().references(() => counselingApplications.application_id, { onDelete: "cascade" }),
//   place_category_id: integer("place_category_id").notNull().references(() => placeCategories.place_category_id, { onDelete: "restrict" }),
// }, (table) => [
//   primaryKey({ columns: [table.application_id, table.place_category_id] }),
// ]);

// export const applicationSituations = pgTable("application_situations", {
//   application_id: bigint("application_id", { mode: "bigint" }).notNull().references(() => counselingApplications.application_id, { onDelete: "cascade" }),
//   situation_category_id: integer("situation_category_id").notNull().references(() => situationCategories.situation_category_id, { onDelete: "restrict" }),
// }, (table) => [
//   primaryKey({ columns: [table.application_id, table.situation_category_id] }),
// ]);

// export const applicationSymptoms = pgTable("application_symptoms", {
//   application_id: bigint("application_id", { mode: "bigint" }).notNull().references(() => counselingApplications.application_id, { onDelete: "cascade" }),
//   symptom_category_id: integer("symptom_category_id").notNull().references(() => symptomCategories.symptom_category_id, { onDelete: "restrict" }),
// }, (table) => [
//   primaryKey({ columns: [table.application_id, table.symptom_category_id] }),
// ]);

// export const sessionStatusEnum = pgEnum("session_status", [
//   "scheduled",
//   "in_progress",
//   "completed",
//   "canceled_by_client",
//   "canceled_by_counselor",
//   "no_show_client",
//   "no_show_counselor"
// ]);

// export const counselingSessions = pgTable("counseling_sessions", {
//   session_id: bigint("session_id", { mode: "bigint" }).primaryKey(),
//   application_id: bigint("application_id", { mode: "bigint" }).notNull().unique().references(() => counselingApplications.application_id, { onDelete: "restrict" }),
//   client_user_id: uuid("client_user_id").notNull().references(() => users.user_id, { onDelete: "cascade" }),
//   counselor_user_id: uuid("counselor_user_id").notNull().references(() => users.user_id, { onDelete: "cascade" }),
//   confirmed_datetime: timestamp("confirmed_datetime", { withTimezone: true }).notNull(),
//   counseling_method: counselingMethodEnum("counseling_method").notNull(),
//   price_at_confirmation: integer("price_at_confirmation").notNull(),
//   duration_minutes: integer("duration_minutes").notNull().default(60),
//   status: sessionStatusEnum("status").notNull().default("scheduled"),
//   created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
//   updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
// }, (table) => [
//   sql`CREATE INDEX idx_counseling_sessions_client_id ON counseling_sessions(client_user_id)`,
//   sql`CREATE INDEX idx_counseling_sessions_counselor_id ON counseling_sessions(counselor_user_id)`,
//   sql`CREATE INDEX idx_counseling_sessions_status ON counseling_sessions(status)`,
//   sql`CREATE INDEX idx_counseling_sessions_confirmed_datetime ON counseling_sessions(confirmed_datetime)`,
//   sql`ALTER TABLE counseling_sessions ADD CONSTRAINT check_price_at_confirmation CHECK (price_at_confirmation >= 0)`,
//   sql`ALTER TABLE counseling_sessions ADD CONSTRAINT check_duration_minutes CHECK (duration_minutes > 0)`,
// ]);