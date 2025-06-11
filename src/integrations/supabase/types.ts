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
      admin_users: {
        Row: {
          admin_role: Database["public"]["Enums"]["admin_role"]
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          user_id: string | null
        }
        Insert: {
          admin_role: Database["public"]["Enums"]["admin_role"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Update: {
          admin_role?: Database["public"]["Enums"]["admin_role"]
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      consultations: {
        Row: {
          ai_response: string | null
          confidence_score: number | null
          consultation_duration: unknown | null
          consultation_type: string | null
          created_at: string | null
          documents_uploaded: string[] | null
          id: string
          query_text: string | null
          user_feedback: number | null
          user_id: string | null
        }
        Insert: {
          ai_response?: string | null
          confidence_score?: number | null
          consultation_duration?: unknown | null
          consultation_type?: string | null
          created_at?: string | null
          documents_uploaded?: string[] | null
          id?: string
          query_text?: string | null
          user_feedback?: number | null
          user_id?: string | null
        }
        Update: {
          ai_response?: string | null
          confidence_score?: number | null
          consultation_duration?: unknown | null
          consultation_type?: string | null
          created_at?: string | null
          documents_uploaded?: string[] | null
          id?: string
          query_text?: string | null
          user_feedback?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      law_articles: {
        Row: {
          article_number: string
          chapter: string | null
          content: string
          created_at: string | null
          id: string
          law_id: string | null
          section: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          article_number: string
          chapter?: string | null
          content: string
          created_at?: string | null
          id?: string
          law_id?: string | null
          section?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          article_number?: string
          chapter?: string | null
          content?: string
          created_at?: string | null
          id?: string
          law_id?: string | null
          section?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "law_articles_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
        ]
      }
      law_updates: {
        Row: {
          article_id: string | null
          effective_date: string | null
          id: string
          law_id: string | null
          new_content: string
          old_content: string | null
          review_comments: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          submitted_at: string | null
          submitted_by: string
          update_reason: string
          update_type: string
        }
        Insert: {
          article_id?: string | null
          effective_date?: string | null
          id?: string
          law_id?: string | null
          new_content: string
          old_content?: string | null
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by: string
          update_reason: string
          update_type: string
        }
        Update: {
          article_id?: string | null
          effective_date?: string | null
          id?: string
          law_id?: string | null
          new_content?: string
          old_content?: string | null
          review_comments?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          submitted_at?: string | null
          submitted_by?: string
          update_reason?: string
          update_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "law_updates_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "law_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "law_updates_law_id_fkey"
            columns: ["law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
        ]
      }
      laws: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          name: string
          number: string
          status: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          number: string
          status?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          number?: string
          status?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
      legal_interpretations: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          interpretation_type: string | null
          reference_source: string | null
          related_article_id: string | null
          related_law_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          interpretation_type?: string | null
          reference_source?: string | null
          related_article_id?: string | null
          related_law_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          interpretation_type?: string | null
          reference_source?: string | null
          related_article_id?: string | null
          related_law_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "legal_interpretations_related_article_id_fkey"
            columns: ["related_article_id"]
            isOneToOne: false
            referencedRelation: "law_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "legal_interpretations_related_law_id_fkey"
            columns: ["related_law_id"]
            isOneToOne: false
            referencedRelation: "laws"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          last_login: string | null
          role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          last_login?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_login?: string | null
          role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          description: string | null
          id: string
          setting_key: string
          setting_value: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          setting_key: string
          setting_value: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          status: string | null
          stripe_payment_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          status?: string | null
          stripe_payment_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_balances: {
        Row: {
          balance: number | null
          created_at: string
          currency: string | null
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_user_balance: {
        Args: { p_user_id: string; p_amount: number; p_description: string }
        Returns: undefined
      }
      create_admin_user: {
        Args: { p_user_id: string; p_admin_role: string }
        Returns: undefined
      }
      get_user_balance: {
        Args: { p_user_id: string }
        Returns: {
          balance: number
          currency: string
        }[]
      }
      get_user_transactions: {
        Args: { p_user_id: string; p_limit?: number }
        Returns: {
          id: string
          user_id: string
          amount: number
          type: string
          description: string
          stripe_payment_id: string
          status: string
          created_at: string
        }[]
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "content_editor" | "user_manager" | "reviewer"
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
      admin_role: ["super_admin", "content_editor", "user_manager", "reviewer"],
    },
  },
} as const
