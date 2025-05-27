/**
 * Payment System Schema
 * 
 * This file defines the database schema for payment records and sets up
 * Supabase Row Level Security (RLS) policies to control data access.
 * The schema is designed to work with payment processors like Toss Payments
 * (as indicated by the imports in package.json).
 */
import { sql } from "drizzle-orm";
import {
  bigint,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { authUid, authUsers, authenticatedRole } from "drizzle-orm/supabase";
import { counselingApplications } from "../counselors/schema";
import { users } from "../users/schema";

import { makeIdentityColumn, timestamps } from "~/core/db/helpers.server";

/**
 * Payment Status Enum
 * 
 * Defines the possible statuses for a payment.
 */
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refund_processing", "refunded"]);

/**
 * Payments Table
 * 
 * Stores payment transaction records with details from the payment processor.
 * Links to Supabase auth.users table via user_id foreign key.
 * 
 * Includes Row Level Security (RLS) policy to ensure users can only
 * view their own payment records.
 */
export const payments = pgTable(
  "payments",
  {
    // Auto-incrementing primary key for payment records
    ...makeIdentityColumn("payment_id"),
    // Payment processor's unique identifier for the transaction
    payment_key: text().notNull(),
    // Unique identifier for the order in your system
    order_id: text().notNull(),
    // Human-readable name for the order
    order_name: text().notNull(),
    // Total amount of the payment transaction
    total_amount: bigint("total_amount", { mode: "bigint" }).notNull(),
    // Custom metadata about the payment (product details, etc.)
    metadata: jsonb().notNull(),
    // Complete raw response from the payment processor
    raw_data: jsonb().notNull(),
    // URL to the payment receipt provided by the processor
    receipt_url: text().notNull(),
    // Current status of the payment (e.g., "approved", "failed")
    status: paymentStatusEnum("payment_status").notNull().default("pending"),
    // Foreign key to the user who made the payment
    user_id: uuid("user_id").references(() => users.user_id, { onDelete: "restrict" }),
    // When the payment was approved by the processor
    approved_at: timestamp().notNull(),
    // When the payment was initially requested
    requested_at: timestamp("requested_at", { withTimezone: true }).notNull().defaultNow(),
    // Adds created_at and updated_at timestamp columns
    ...timestamps,
    // Unique identifier for the application
    application_id: bigint("application_id", { mode: "bigint" }).notNull().unique().references(() => counselingApplications.application_id, { onDelete: "restrict" }),
    // Payment method details
    payment_method_detail: varchar("payment_method_detail", { length: 100 }),
    // Unique identifier for the payment processor transaction
    pg_transaction_id: varchar("pg_transaction_id", { length: 255 }).unique(),
    // When the payment was completed
    completed_at: timestamp("completed_at", { withTimezone: true }),
    // When the refund was requested
    refund_requested_at: timestamp("refund_requested_at", { withTimezone: true }),
    // When the refund was completed
    refund_completed_at: timestamp("refund_completed_at", { withTimezone: true }),
  },
  (table) => [
    // RLS Policy: Users can only view their own payment records
    pgPolicy("select-payment-policy", {
      for: "select",
      to: authenticatedRole,
      as: "permissive",
      using: sql`${authUid} = ${table.user_id}`,
    }),
    sql`CREATE INDEX idx_payments_application_id ON payments(application_id)`,
    sql`CREATE INDEX idx_payments_user_id ON payments(user_id)`,
    sql`CREATE INDEX idx_payments_status ON payments(status)`,
  ],
);
