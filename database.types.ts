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
      clients: {
        Row: {
          avatar_background_color: string
          client_id: string
          created_at: string
          nickname: string
          updated_at: string
        }
        Insert: {
          avatar_background_color: string
          client_id: string
          created_at?: string
          nickname: string
          updated_at?: string
        }
        Update: {
          avatar_background_color?: string
          client_id?: string
          created_at?: string
          nickname?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_client_id_profiles_profile_id_fk"
            columns: ["client_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
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
          updated_at: string
        }
        Insert: {
          article_id?: number
          article_url: string
          counselor_id: string
          created_at?: string
          institution?: string | null
          published_date?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          article_id?: number
          article_url?: string
          counselor_id?: string
          created_at?: string
          institution?: string | null
          published_date?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselor_articles_counselor_id_counselors_counselor_id_fk"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["counselor_id"]
          },
        ]
      }
      counselor_available_methods: {
        Row: {
          counselor_id: string
          created_at: string
          is_active: boolean
          method: Database["public"]["Enums"]["counseling_method"]
          price_per_hour: number
          updated_at: string
        }
        Insert: {
          counselor_id: string
          created_at?: string
          is_active?: boolean
          method: Database["public"]["Enums"]["counseling_method"]
          price_per_hour: number
          updated_at?: string
        }
        Update: {
          counselor_id?: string
          created_at?: string
          is_active?: boolean
          method?: Database["public"]["Enums"]["counseling_method"]
          price_per_hour?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselor_available_methods_counselor_id_counselors_counselor_i"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["counselor_id"]
          },
        ]
      }
      counselor_introduction_items: {
        Row: {
          counselor_id: string
          created_at: string
          description: string
          display_order: number
          item_id: number
          title: string
          updated_at: string
        }
        Insert: {
          counselor_id: string
          created_at?: string
          description: string
          display_order: number
          item_id?: number
          title: string
          updated_at?: string
        }
        Update: {
          counselor_id?: string
          created_at?: string
          description?: string
          display_order?: number
          item_id?: number
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "counselor_introduction_items_counselor_id_counselors_counselor_"
            columns: ["counselor_id"]
            isOneToOne: false
            referencedRelation: "counselors"
            referencedColumns: ["counselor_id"]
          },
        ]
      }
      counselors: {
        Row: {
          average_rating: number
          center_address: string | null
          center_name: string | null
          counselor_id: string
          created_at: string
          introduction_greeting: string | null
          is_verified: boolean
          review_count: number
          short_introduction: string | null
          total_counseling_count: number
          updated_at: string
          years_of_experience: number
        }
        Insert: {
          average_rating?: number
          center_address?: string | null
          center_name?: string | null
          counselor_id: string
          created_at?: string
          introduction_greeting?: string | null
          is_verified?: boolean
          review_count?: number
          short_introduction?: string | null
          total_counseling_count?: number
          updated_at?: string
          years_of_experience?: number
        }
        Update: {
          average_rating?: number
          center_address?: string | null
          center_name?: string | null
          counselor_id?: string
          created_at?: string
          introduction_greeting?: string | null
          is_verified?: boolean
          review_count?: number
          short_introduction?: string | null
          total_counseling_count?: number
          updated_at?: string
          years_of_experience?: number
        }
        Relationships: [
          {
            foreignKeyName: "counselors_counselor_id_profiles_profile_id_fk"
            columns: ["counselor_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["profile_id"]
          },
        ]
      }
      payments: {
        Row: {
          approved_at: string
          created_at: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id: number
          payment_key: string
          raw_data: Json
          receipt_url: string
          requested_at: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          approved_at: string
          created_at?: string
          metadata: Json
          order_id: string
          order_name: string
          payment_id?: never
          payment_key: string
          raw_data: Json
          receipt_url: string
          requested_at: string
          status: string
          total_amount: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          approved_at?: string
          created_at?: string
          metadata?: Json
          order_id?: string
          order_name?: string
          payment_id?: never
          payment_key?: string
          raw_data?: Json
          receipt_url?: string
          requested_at?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          deleted_at: string | null
          marketing_consent: boolean
          name: string
          profile_id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          marketing_consent?: boolean
          name: string
          profile_id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          deleted_at?: string | null
          marketing_consent?: boolean
          name?: string
          profile_id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
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
      counseling_method: "chat" | "phone" | "video"
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
      counseling_method: ["chat", "phone", "video"],
      user_role: ["client", "counselor"],
    },
  },
} as const
