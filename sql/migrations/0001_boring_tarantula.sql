CREATE TYPE "public"."session_status" AS ENUM('scheduled', 'in_progress', 'completed', 'canceled_by_client', 'canceled_by_counselor', 'no_show_client', 'no_show_counselor');--> statement-breakpoint
CREATE TABLE "counseling_sessions" (
	"session_id" bigint PRIMARY KEY NOT NULL,
	"application_id" bigint NOT NULL,
	"client_user_id" uuid NOT NULL,
	"counselor_user_id" uuid NOT NULL,
	"confirmed_datetime" timestamp with time zone NOT NULL,
	"counseling_method" "counseling_method" NOT NULL,
	"price_at_confirmation" integer NOT NULL,
	"duration_minutes" integer DEFAULT 60 NOT NULL,
	"status" "session_status" DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "counseling_sessions_application_id_unique" UNIQUE("application_id")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"message_id" bigint PRIMARY KEY NOT NULL,
	"chat_room_id" bigint,
	"session_id" bigint,
	"sender_user_id" uuid NOT NULL,
	"message_content" text NOT NULL,
	"sent_at" timestamp with time zone DEFAULT now() NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_rooms" (
	"chat_room_id" bigint PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"review_id" bigint PRIMARY KEY NOT NULL,
	"session_id" bigint NOT NULL,
	"client_user_id" uuid NOT NULL,
	"counselor_user_id" uuid NOT NULL,
	"rating_professionalism" numeric(2, 1) NOT NULL,
	"rating_effectiveness" numeric(2, 1) NOT NULL,
	"rating_kindness" numeric(2, 1) NOT NULL,
	"overall_rating" numeric(3, 2) NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "reviews_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
ALTER TABLE "counseling_sessions" ADD CONSTRAINT "counseling_sessions_application_id_counseling_applications_application_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."counseling_applications"("application_id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_sessions" ADD CONSTRAINT "counseling_sessions_client_user_id_users_user_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "counseling_sessions" ADD CONSTRAINT "counseling_sessions_counselor_user_id_users_user_id_fk" FOREIGN KEY ("counselor_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_chat_room_id_chat_rooms_chat_room_id_fk" FOREIGN KEY ("chat_room_id") REFERENCES "public"."chat_rooms"("chat_room_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_session_id_counseling_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."counseling_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_user_id_users_user_id_fk" FOREIGN KEY ("sender_user_id") REFERENCES "public"."users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_session_id_counseling_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."counseling_sessions"("session_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_client_user_id_users_user_id_fk" FOREIGN KEY ("client_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_counselor_user_id_users_user_id_fk" FOREIGN KEY ("counselor_user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;