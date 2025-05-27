export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      application_places: {
        Row: {
          application_id: number
          place_category_id: number
        }
        Insert: {
          application_id: number
          place_category_id: number
        }
        Update: {
          application_id?: number
          place_category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "application_places_application_id_counseling_applications_appli"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "counseling_applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_places_place_category_id_place_categories_place_cat"
            columns: ["place_category_id"]
            isOneToOne: false
            referencedRelation: "place_categories"
            referencedColumns: ["place_category_id"]
          },
        ]
      }
      application_preferred_dates: {
        Row: {
          application_id: number
          preferred_date: string
          preferred_date_id: number
        }
        Insert: {
          application_id: number
          preferred_date: string
          preferred_date_id: number
        }
        Update: {
          application_id?: number
          preferred_date?: string
          preferred_date_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "application_preferred_dates_application_id_counseling_applicati"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "counseling_applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      application_preferred_times: {
        Row: {
          application_id: number
          preferred_time: string
          preferred_time_id: number
        }
        Insert: {
          application_id: number
          preferred_time: string
          preferred_time_id: number
        }
        Update: {
          application_id?: number
          preferred_time?: string
          preferred_time_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "application_preferred_times_application_id_counseling_applicati"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "counseling_applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      application_situations: {
        Row: {
          application_id: number
          situation_category_id: number
        }
        Insert: {
          application_id: number
          situation_category_id: number
        }
        Update: {
          application_id?: number
          situation_category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "application_situations_application_id_counseling_applications_a"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "counseling_applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_situations_situation_category_id_situation_categori"
            columns: ["situation_category_id"]
            isOneToOne: false
            referencedRelation: "situation_categories"
            referencedColumns: ["situation_category_id"]
          },
        ]
      }
      application_symptoms: {
        Row: {
          application_id: number
          symptom_category_id: number
        }
        Insert: {
          application_id: number
          symptom_category_id: number
        }
        Update: {
          application_id?: number
          symptom_category_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "application_symptoms_application_id_counseling_applications_app"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "counseling_applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "application_symptoms_symptom_category_id_symptom_categories_sym"
            columns: ["symptom_category_id"]
            isOneToOne: false
            referencedRelation: "symptom_categories"
            referencedColumns: ["symptom_category_id"]
          },
        ]
      }
      clients: {
        Row: {
          client_user_id: string
        }
        Insert: {
          client_user_id: string
        }
        Update: {
          client_user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_client_user_id_users_user_id_fk"
            columns: ["client_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      counseling_applications: {
        Row: {
          additional_details: string | null
          age_group: Database["public"]["Enums"]["age_group_range"] | null
          application_id: number
          applied_price_per_hour: number
          client_user_id: string
          counselor_user_id: string
          created_at: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          selected_method_id: number
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string
        }
        Insert: {
          additional_details?: string | null
          age_group?: Database["public"]["Enums"]["age_group_range"] | null
          application_id: number
          applied_price_per_hour: number
          client_user_id: string
          counselor_user_id: string
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          selected_method_id: number
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Update: {
          additional_details?: string | null
          age_group?: Database["public"]["Enums"]["age_group_range"] | null
          application_id?: number
          applied_price_per_hour?: number
          client_user_id?: string
          counselor_user_id?: string
          created_at?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          selected_method_id?: number
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "counseling_applications_client_user_id_users_user_id_fk"
            columns: ["client_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "counseling_applications_counselor_user_id_users_user_id_fk"
            columns: ["counselor_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "counseling_applications_selected_method_id_counselor_available_"
            columns: ["selected_method_id"]
            isOneToOne: false
            referencedRelation: "counselor_available_methods"
            referencedColumns: ["available_method_id"]
          },
        ]
      }
      counselor_articles: {
        Row: {
          article_id: number
          article_url: string
          counselor_id: string
          created_at: string
          institution: string | null
          published_date: string | null
          title: string
        }
        Insert: {
          article_id: number
          article_url: string
          counselor_id: string
          created_at?: string
          institution?: string | null
          published_date?: string | null
          title: string
        }
        Update: {
          article_id?: number
          article_url?: string
          counselor_id?: string
          created_at?: string
          institution?: string | null
          published_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselor_articles_counselor_id_counselors_counselor_user_id_fk"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["counselor_user_id"]
          },
        ]
      }
      counselor_available_methods: {
        Row: {
          available_method_id: number
          counselor_id: string
          is_active: boolean
          method: Database["public"]["Enums"]["counseling_method"]
          price_per_hour: number
        }
        Insert: {
          available_method_id: number
          counselor_id: string
          is_active?: boolean
          method: Database["public"]["Enums"]["counseling_method"]
          price_per_hour: number
        }
        Update: {
          available_method_id?: number
          counselor_id?: string
          is_active?: boolean
          method?: Database["public"]["Enums"]["counseling_method"]
          price_per_hour?: number
        }
        Relationships: [
          {
            foreignKeyName: "counselor_available_methods_counselor_id_counselors_counselor_u"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["counselor_user_id"]
          },
        ]
      }
      counselor_introduction_items: {
        Row: {
          counselor_id: string
          description: string
          display_order: number
          item_id: number
          title: string
        }
        Insert: {
          counselor_id: string
          description: string
          display_order: number
          item_id: number
          title: string
        }
        Update: {
          counselor_id?: string
          description?: string
          display_order?: number
          item_id?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselor_introduction_items_counselor_id_counselors_counselor_"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["counselor_user_id"]
          },
        ]
      }
      counselors: {
        Row: {
          average_rating: number
          center_address: string | null
          center_name: string | null
          counselor_user_id: string
          introduction_greeting: string | null
          is_verified: boolean
          name: string
          profile_image_url: string | null
          review_count: number
          short_introduction: string | null
          total_counseling_count: number
          years_of_experience: number
        }
        Insert: {
          average_rating?: number
          center_address?: string | null
          center_name?: string | null
          counselor_user_id: string
          introduction_greeting?: string | null
          is_verified?: boolean
          name: string
          profile_image_url?: string | null
          review_count?: number
          short_introduction?: string | null
          total_counseling_count?: number
          years_of_experience?: number
        }
        Update: {
          average_rating?: number
          center_address?: string | null
          center_name?: string | null
          counselor_user_id?: string
          introduction_greeting?: string | null
          is_verified?: boolean
          name?: string
          profile_image_url?: string | null
          review_count?: number
          short_introduction?: string | null
          total_counseling_count?: number
          years_of_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "counselors_counselor_user_id_users_user_id_fk"
            columns: ["counselor_user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      payments: {
        Row: {
          application_id: number
          approved_at: string
          completed_at: string | null
          created_at: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id: number
          payment_key: string
          payment_method_detail: string | null
          payment_status: Database["public"]["Enums"]["payment_status"]
          pg_transaction_id: string | null
          raw_data: Json
          receipt_url: string
          refund_completed_at: string | null
          refund_requested_at: string | null
          requested_at: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          application_id: number
          approved_at: string
          completed_at?: string | null
          created_at?: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id?: never
          payment_key: string
          payment_method_detail?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          pg_transaction_id?: string | null
          raw_data: Json
          receipt_url: string
          refund_completed_at?: string | null
          refund_requested_at?: string | null
          requested_at?: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          application_id?: number
          approved_at?: string
          completed_at?: string | null
          created_at?: string
          metadata?: Json
          order_id?: string
          order_name?: string
          payment_id?: never
          payment_key?: string
          payment_method_detail?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"]
          pg_transaction_id?: string | null
          raw_data?: Json
          receipt_url?: string
          refund_completed_at?: string | null
          refund_requested_at?: string | null
          requested_at?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_counseling_applications_application_id_"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "counseling_applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "payments_user_id_users_user_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      place_categories: {
        Row: {
          name: string
          place_category_id: number
        }
        Insert: {
          name: string
          place_category_id: number
        }
        Update: {
          name?: string
          place_category_id?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          marketing_consent: boolean
          name: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          marketing_consent?: boolean
          name: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          marketing_consent?: boolean
          name?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      situation_categories: {
        Row: {
          name: string
          situation_category_id: number
        }
        Insert: {
          name: string
          situation_category_id: number
        }
        Update: {
          name?: string
          situation_category_id?: number
        }
        Relationships: []
      }
      symptom_categories: {
        Row: {
          name: string
          symptom_category_id: number
        }
        Insert: {
          name: string
          symptom_category_id: number
        }
        Update: {
          name?: string
          symptom_category_id?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_background_color: string | null
          created_at: string
          deleted_at: string | null
          email: string
          nickname: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_background_color?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          nickname?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_background_color?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          nickname?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      age_group_range: "10-19" | "20-29" | "30-39" | "40-49" | "50-59" | "60+"
      application_status:
        | "pending_approval"
        | "accepted"
        | "rejected"
        | "canceled_by_client"
        | "awaiting_confirmation"
      counseling_method: "chat" | "phone" | "video" | "visit"
      gender_type: "male" | "female"
      payment_status:
        | "pending"
        | "completed"
        | "failed"
        | "refund_processing"
        | "refunded"
      user_role: "client" | "counselor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      age_group_range: ["10-19", "20-29", "30-39", "40-49", "50-59", "60+"],
      application_status: [
        "pending_approval",
        "accepted",
        "rejected",
        "canceled_by_client",
        "awaiting_confirmation",
      ],
      counseling_method: ["chat", "phone", "video", "visit"],
      gender_type: ["male", "female"],
      payment_status: [
        "pending",
        "completed",
        "failed",
        "refund_processing",
        "refunded",
      ],
      user_role: ["client", "counselor"],
    },
  },
} as const
