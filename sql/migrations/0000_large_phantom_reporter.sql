CREATE TYPE "public"."age_group_range" AS ENUM('10-19', '20-29', '30-39', '40-49', '50-59', '60+');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('pending_approval', 'accepted', 'rejected', 'canceled_by_client', 'awaiting_confirmation');--> statement-breakpoint
CREATE TYPE "public"."gender_type" AS ENUM('male', 'female');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'completed', 'failed', 'refund_processing', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."counseling_method" AS ENUM('chat', 'phone', 'video', 'visit');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('client', 'counselor');--> statement-breakpoint
CREATE TABLE "application_places" (
	"application_id" bigint NOT NULL,
	"place_category_id" integer NOT NULL,
	CONSTRAINT "application_places_application_id_place_category_id_pk" PRIMARY KEY("application_id","place_category_id")
);
--> statement-breakpoint
CREATE TABLE "application_preferred_dates" (
	"preferred_date_id" bigint PRIMARY KEY NOT NULL,
	"application_id" bigint NOT NULL,
	"preferred_date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_preferred_times" (
	"preferred_time_id" bigint PRIMARY KEY NOT NULL,
	"application_id" bigint NOT NULL,
	"preferred_time" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_situations" (
	"application_id" bigint NOT NULL,
	"situation_category_id" integer NOT NULL,
	CONSTRAINT "application_situations_application_id_situation_category_id_pk" PRIMARY KEY("application_id","situation_category_id")
);
--> statement-breakpoint
CREATE TABLE "application_symptoms" (
	"application_id" bigint NOT NULL,
	"symptom_category_id" integer NOT NULL,
	CONSTRAINT "application_symptoms_application_id_symptom_category_id_pk" PRIMARY KEY("application_id","symptom_category_id")
);
--> statement-breakpoint
CREATE TABLE "counseling_applications" (
	"application_id" bigint PRIMARY KEY NOT NULL,
	"client_user_id" uuid NOT NULL,
	"counselor_user_id" uuid NOT NULL,
	"selected_method_id" bigint NOT NULL,
	"applied_price_per_hour" integer NOT NULL,
	"age_group" "age_group_range",
	"gender" "gender_type",
	"additional_details" text,
	"status" "application_status" DEFAULT 'pending_approval' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "place_categories" (
	"place_category_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "place_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "situation_categories" (
	"situation_category_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "situation_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "symptom_categories" (
	"symptom_category_id" integer PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT "symptom_categories_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"payment_key" text NOT NULL,
	"order_id" text NOT NULL,
	"order_name" text NOT NULL,
	"total_amount" bigint NOT NULL,
	"metadata" jsonb NOT NULL,
	"raw_data" jsonb NOT NULL,
	"receipt_url" text NOT NULL,
	"payment_status" "payment_status" DEFAULT 'pending' NOT NULL,
	"user_id" uuid,
	"approved_at" timestamp NOT NULL,
	"requested_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"application_id" bigint NOT NULL,
	"payment_method_detail" varchar(100),
	"pg_transaction_id" varchar(255),
	"completed_at" timestamp with time zone,
	"refund_requested_at" timestamp with time zone,
	"refund_completed_at" timestamp with time zone,
	CONSTRAINT "payments_application_id_unique" UNIQUE("application_id"),
	CONSTRAINT "payments_pg_transaction_id_unique" UNIQUE("pg_transaction_id")
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "clients" (
	"client_user_id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counselor_articles" (
	"article_id" bigint PRIMARY KEY NOT NULL,
	"counselor_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"institution" varchar(255),
	"published_date" timestamp with time zone,
	"article_url" varchar(2048) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counselor_available_methods" (
	"available_method_id" bigint PRIMARY KEY NOT NULL,
	"counselor_id" uuid NOT NULL,
	"method" "counseling_method" NOT NULL,
	"price_per_hour" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counselor_introduction_items" (
	"item_id" bigint PRIMARY KEY NOT NULL,
	"counselor_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"display_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "counselors" (
	"counselor_user_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profile_image_url" varchar(2048),
	"total_counseling_count" integer DEFAULT 0 NOT NULL,
	"years_of_experience" integer DEFAULT 0 NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"short_introduction" varchar(300),
	"center_name" varchar(255),
	"center_address" varchar(500),
	"average_rating" numeric(3, 2) DEFAULT '0.00' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"introduction_greeting" text
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatar_url" text,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"role" "user_role" NOT NULL,
	"email" text NOT NULL,
	"nickname" text,
	"avatar_background_color" text,
	"deleted_at" timestamp with time zone,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_nickname_unique" UNIQUE("nickname")
);
--> statement-breakpoint
ALTER TABLE "application_places" ADD CONSTRAINT "application_places_application_id_counseling_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."counseling_applications"("application_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_places" ADD CONSTRAINT "application_places_place_category_id_place_categories_place_category_id_fk" FOREIGN KEY ("place_category_id") REFERENCES "public"."place_categories"("place_category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_preferred_dates" ADD CONSTRAINT "application_preferred_dates_application_id_counseling_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."counseling_applications"("application_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_preferred_times" ADD CONSTRAINT "application_preferred_times_application_id_counseling_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."counseling_applications"("application_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_situations" ADD CONSTRAINT "application_situations_application_id_counseling_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."counseling_applications"("application_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_situations" ADD CONSTRAINT "application_situations_situation_category_id_situation_categories_situation_category_id_fk" FOREIGN KEY ("situation_category_id") REFERENCES "public"."situation_categories"("situation_category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_symptoms" ADD CONSTRAINT "application_symptoms_application_id_counseling_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."counseling_applications"("application_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_symptoms" ADD CONSTRAINT "application_symptoms_symptom_category_id_symptom_categories_symptom_category_id_fk" FOREIGN KEY ("symptom_category_id") REFERENCES "public"."symptom_categories"("symptom_category_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_applications" ADD CONSTRAINT "counseling_applications_client_user_id_users_user_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_applications" ADD CONSTRAINT "counseling_applications_counselor_user_id_users_user_id_fk" FOREIGN KEY ("counselor_user_id") REFERENCES "public"."users"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_applications" ADD CONSTRAINT "counseling_applications_selected_method_id_counselor_available_methods_available_method_id_fk" FOREIGN KEY ("selected_method_id") REFERENCES "public"."counselor_available_methods"("available_method_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_application_id_counseling_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."counseling_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_client_user_id_users_user_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_articles" ADD CONSTRAINT "counselor_articles_counselor_id_counselors_counselor_user_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("counselor_user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_available_methods" ADD CONSTRAINT "counselor_available_methods_counselor_id_counselors_counselor_user_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("counselor_user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_introduction_items" ADD CONSTRAINT "counselor_introduction_items_counselor_id_counselors_counselor_user_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("counselor_user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselors" ADD CONSTRAINT "counselors_counselor_user_id_users_user_id_fk" FOREIGN KEY ("counselor_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select-payment-policy" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "payments"."user_id");--> statement-breakpoint
CREATE POLICY "edit-profile-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id") WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-profile-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-profile-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");