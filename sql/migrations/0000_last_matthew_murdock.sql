CREATE TYPE "public"."counseling_method" AS ENUM('chat', 'phone', 'video');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('client', 'counselor');--> statement-breakpoint
CREATE TABLE "payments" (
	"payment_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "payments_payment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"payment_key" text NOT NULL,
	"order_id" text NOT NULL,
	"order_name" text NOT NULL,
	"total_amount" double precision NOT NULL,
	"metadata" jsonb NOT NULL,
	"raw_data" jsonb NOT NULL,
	"receipt_url" text NOT NULL,
	"status" text NOT NULL,
	"user_id" uuid,
	"approved_at" timestamp NOT NULL,
	"requested_at" timestamp NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "clients" (
	"client_id" uuid PRIMARY KEY NOT NULL,
	"nickname" text NOT NULL,
	"avatar_background_color" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_nickname_unique" UNIQUE("nickname")
);
--> statement-breakpoint
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "counselor_articles" (
	"article_id" serial PRIMARY KEY NOT NULL,
	"counselor_id" uuid NOT NULL,
	"title" text NOT NULL,
	"institution" text,
	"published_date" timestamp with time zone,
	"article_url" text NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "counselor_articles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "counselor_available_methods" (
	"counselor_id" uuid NOT NULL,
	"method" "counseling_method" NOT NULL,
	"price_per_hour" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "counselor_available_methods_counselor_id_method_pk" PRIMARY KEY("counselor_id","method")
);
--> statement-breakpoint
ALTER TABLE "counselor_available_methods" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "counselor_introduction_items" (
	"item_id" serial PRIMARY KEY NOT NULL,
	"counselor_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"display_order" integer NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "counselor_introduction_items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "counselors" (
	"counselor_id" uuid PRIMARY KEY NOT NULL,
	"total_counseling_count" integer DEFAULT 0 NOT NULL,
	"years_of_experience" integer DEFAULT 0 NOT NULL,
	"is_verified" boolean DEFAULT false NOT NULL,
	"short_introduction" text,
	"center_name" text,
	"center_address" text,
	"average_rating" numeric(3, 2) DEFAULT '0.00' NOT NULL,
	"review_count" integer DEFAULT 0 NOT NULL,
	"introduction_greeting" text,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "counselors" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"profile_id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" "user_role" DEFAULT 'client' NOT NULL,
	"avatar_url" text,
	"marketing_consent" boolean DEFAULT false NOT NULL,
	"deleted_at" timestamp with time zone,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_client_id_profiles_profile_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_articles" ADD CONSTRAINT "counselor_articles_counselor_id_counselors_counselor_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("counselor_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_available_methods" ADD CONSTRAINT "counselor_available_methods_counselor_id_counselors_counselor_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("counselor_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselor_introduction_items" ADD CONSTRAINT "counselor_introduction_items_counselor_id_counselors_counselor_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."counselors"("counselor_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counselors" ADD CONSTRAINT "counselors_counselor_id_profiles_profile_id_fk" FOREIGN KEY ("counselor_id") REFERENCES "public"."profiles"("profile_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_profile_id_users_id_fk" FOREIGN KEY ("profile_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "select-payment-policy" ON "payments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "payments"."user_id");--> statement-breakpoint
CREATE POLICY "edit-client-policy" ON "clients" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "clients"."client_id") WITH CHECK ((select auth.uid()) = "clients"."client_id");--> statement-breakpoint
CREATE POLICY "delete-client-policy" ON "clients" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "clients"."client_id");--> statement-breakpoint
CREATE POLICY "select-client-policy" ON "clients" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "clients"."client_id");--> statement-breakpoint
CREATE POLICY "edit-counselor-article-policy" ON "counselor_articles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "counselor_articles"."counselor_id") WITH CHECK ((select auth.uid()) = "counselor_articles"."counselor_id");--> statement-breakpoint
CREATE POLICY "delete-counselor-article-policy" ON "counselor_articles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "counselor_articles"."counselor_id");--> statement-breakpoint
CREATE POLICY "select-counselor-article-policy" ON "counselor_articles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "counselor_articles"."counselor_id");--> statement-breakpoint
CREATE POLICY "edit-counselor-method-policy" ON "counselor_available_methods" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "counselor_available_methods"."counselor_id") WITH CHECK ((select auth.uid()) = "counselor_available_methods"."counselor_id");--> statement-breakpoint
CREATE POLICY "delete-counselor-method-policy" ON "counselor_available_methods" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "counselor_available_methods"."counselor_id");--> statement-breakpoint
CREATE POLICY "select-counselor-method-policy" ON "counselor_available_methods" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "counselor_available_methods"."counselor_id");--> statement-breakpoint
CREATE POLICY "edit-counselor-item-policy" ON "counselor_introduction_items" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "counselor_introduction_items"."counselor_id") WITH CHECK ((select auth.uid()) = "counselor_introduction_items"."counselor_id");--> statement-breakpoint
CREATE POLICY "delete-counselor-item-policy" ON "counselor_introduction_items" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "counselor_introduction_items"."counselor_id");--> statement-breakpoint
CREATE POLICY "select-counselor-item-policy" ON "counselor_introduction_items" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "counselor_introduction_items"."counselor_id");--> statement-breakpoint
CREATE POLICY "edit-counselorcounselor-policy" ON "counselors" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "counselors"."counselor_id") WITH CHECK ((select auth.uid()) = "counselors"."counselor_id");--> statement-breakpoint
CREATE POLICY "delete-counselor-policy" ON "counselors" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "counselors"."counselor_id");--> statement-breakpoint
CREATE POLICY "select-counselor-policy" ON "counselors" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "counselors"."counselor_id");--> statement-breakpoint
CREATE POLICY "edit-profile-policy" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id") WITH CHECK ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "delete-profile-policy" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");--> statement-breakpoint
CREATE POLICY "select-profile-policy" ON "profiles" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.uid()) = "profiles"."profile_id");