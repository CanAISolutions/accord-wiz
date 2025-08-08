export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: number
          new_data: Json | null
          old_data: Json | null
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      comparisons: {
        Row: {
          canai_output: string
          created_at: string | null
          deliverable_metadata: Json | null
          emotional_resonance: Json | null
          file_exports: Json | null
          generation_time_ms: number | null
          generic_output: string
          id: string
          model_versions: Json | null
          preference_indicators: Json | null
          preference_recorded_at: string | null
          prompt_log_id: string | null
          revision_count: number | null
          status: string | null
          trust_delta: number | null
          updated_at: string | null
          user_id: string | null
          user_preference: string | null
        }
        Insert: {
          canai_output: string
          created_at?: string | null
          deliverable_metadata?: Json | null
          emotional_resonance?: Json | null
          file_exports?: Json | null
          generation_time_ms?: number | null
          generic_output: string
          id?: string
          model_versions?: Json | null
          preference_indicators?: Json | null
          preference_recorded_at?: string | null
          prompt_log_id?: string | null
          revision_count?: number | null
          status?: string | null
          trust_delta?: number | null
          updated_at?: string | null
          user_id?: string | null
          user_preference?: string | null
        }
        Update: {
          canai_output?: string
          created_at?: string | null
          deliverable_metadata?: Json | null
          emotional_resonance?: Json | null
          file_exports?: Json | null
          generation_time_ms?: number | null
          generic_output?: string
          id?: string
          model_versions?: Json | null
          preference_indicators?: Json | null
          preference_recorded_at?: string | null
          prompt_log_id?: string | null
          revision_count?: number | null
          status?: string | null
          trust_delta?: number | null
          updated_at?: string | null
          user_id?: string | null
          user_preference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comparisons_prompt_log_id_fkey"
            columns: ["prompt_log_id"]
            isOneToOne: false
            referencedRelation: "prompt_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      error_logs: {
        Row: {
          action: string | null
          created_at: string | null
          endpoint: string | null
          error_message: string
          error_type: string
          feedback_id: string | null
          id: string
          ip_address: unknown | null
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          retry_count: number | null
          session_id: string | null
          stack_trace: string | null
          support_request: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          endpoint?: string | null
          error_message: string
          error_type: string
          feedback_id?: string | null
          id?: string
          ip_address?: unknown | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          retry_count?: number | null
          session_id?: string | null
          stack_trace?: string | null
          support_request?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          endpoint?: string | null
          error_message?: string
          error_type?: string
          feedback_id?: string | null
          id?: string
          ip_address?: unknown | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          retry_count?: number | null
          session_id?: string | null
          stack_trace?: string | null
          support_request?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "error_logs_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback_logs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_error_logs_session_id"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "session_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_logs: {
        Row: {
          comment: string
          created_at: string | null
          feedback_type: string | null
          id: string
          prompt_id: string | null
          rating: number
          sentiment: string | null
          shared_platforms: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          prompt_id?: string | null
          rating: number
          sentiment?: string | null
          shared_platforms?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          feedback_type?: string | null
          id?: string
          prompt_id?: string | null
          rating?: number
          sentiment?: string | null
          shared_platforms?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_logs_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_logs: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_method: string
          status: string
          stripe_payment_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency: string
          id?: string
          payment_method: string
          status: string
          stripe_payment_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_method?: string
          status?: string
          stripe_payment_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pricing: {
        Row: {
          active: boolean
          created_at: string
          currency: string
          features: Json
          id: string
          plan_name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          plan_name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          currency?: string
          features?: Json
          id?: string
          plan_name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      prompt_logs: {
        Row: {
          auto_save_count: number | null
          business_description: string | null
          competitors: string | null
          completion_percentage: number | null
          context_analysis: Json | null
          created_at: string | null
          emotional_drivers: Json | null
          funding_goal: number | null
          growth_strategy: string | null
          id: string
          location: string | null
          market_research: string | null
          revenue_model: string | null
          risk_mitigation: string | null
          spark_log_id: string | null
          target_market: string | null
          team_experience: string | null
          template_version: string | null
          timeline: string | null
          total_time_spent_seconds: number | null
          unique_value_proposition: string | null
          updated_at: string | null
          user_id: string | null
          validation_status: string | null
        }
        Insert: {
          auto_save_count?: number | null
          business_description?: string | null
          competitors?: string | null
          completion_percentage?: number | null
          context_analysis?: Json | null
          created_at?: string | null
          emotional_drivers?: Json | null
          funding_goal?: number | null
          growth_strategy?: string | null
          id?: string
          location?: string | null
          market_research?: string | null
          revenue_model?: string | null
          risk_mitigation?: string | null
          spark_log_id?: string | null
          target_market?: string | null
          team_experience?: string | null
          template_version?: string | null
          timeline?: string | null
          total_time_spent_seconds?: number | null
          unique_value_proposition?: string | null
          updated_at?: string | null
          user_id?: string | null
          validation_status?: string | null
        }
        Update: {
          auto_save_count?: number | null
          business_description?: string | null
          competitors?: string | null
          completion_percentage?: number | null
          context_analysis?: Json | null
          created_at?: string | null
          emotional_drivers?: Json | null
          funding_goal?: number | null
          growth_strategy?: string | null
          id?: string
          location?: string | null
          market_research?: string | null
          revenue_model?: string | null
          risk_mitigation?: string | null
          spark_log_id?: string | null
          target_market?: string | null
          team_experience?: string | null
          template_version?: string | null
          timeline?: string | null
          total_time_spent_seconds?: number | null
          unique_value_proposition?: string | null
          updated_at?: string | null
          user_id?: string | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_prompt_logs_spark_log_id"
            columns: ["spark_log_id"]
            isOneToOne: false
            referencedRelation: "spark_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      prompt_templates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          template_type: string | null
          version: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          template_type?: string | null
          version: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          template_type?: string | null
          version?: string
        }
        Relationships: []
      }
      session_logs: {
        Row: {
          actions_count: number | null
          api_calls_count: number | null
          api_response_time_ms: number | null
          browser: string | null
          created_at: string | null
          device_type: string | null
          id: string
          interaction_details: Json | null
          interaction_type: string | null
          ip_address: unknown | null
          page_load_time_ms: number | null
          page_views_count: number | null
          referral_code: string | null
          referral_email: string | null
          referral_link: string | null
          session_duration_seconds: number | null
          session_end: string | null
          session_start: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          actions_count?: number | null
          api_calls_count?: number | null
          api_response_time_ms?: number | null
          browser?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          interaction_details?: Json | null
          interaction_type?: string | null
          ip_address?: unknown | null
          page_load_time_ms?: number | null
          page_views_count?: number | null
          referral_code?: string | null
          referral_email?: string | null
          referral_link?: string | null
          session_duration_seconds?: number | null
          session_end?: string | null
          session_start?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          actions_count?: number | null
          api_calls_count?: number | null
          api_response_time_ms?: number | null
          browser?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          interaction_details?: Json | null
          interaction_type?: string | null
          ip_address?: unknown | null
          page_load_time_ms?: number | null
          page_views_count?: number | null
          referral_code?: string | null
          referral_email?: string | null
          referral_link?: string | null
          session_duration_seconds?: number | null
          session_end?: string | null
          session_start?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      share_logs: {
        Row: {
          created_at: string | null
          id: string
          platform: string
          prompt_id: string | null
          recipient_email: string | null
          share_type: string | null
          shared_content_type: string | null
          success: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          platform: string
          prompt_id?: string | null
          recipient_email?: string | null
          share_type?: string | null
          shared_content_type?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          platform?: string
          prompt_id?: string | null
          recipient_email?: string | null
          share_type?: string | null
          shared_content_type?: string | null
          success?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "share_logs_prompt_id_fkey"
            columns: ["prompt_id"]
            isOneToOne: false
            referencedRelation: "prompt_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      spark_logs: {
        Row: {
          attempt_count: number | null
          created_at: string | null
          emotional_resonance: Json | null
          expires_at: string | null
          feedback: string | null
          generated_sparks: Json
          generation_metadata: Json | null
          id: string
          initial_prompt_id: string | null
          product_track: string | null
          selected_spark: Json | null
          selection_time_ms: number | null
          status: string | null
          trust_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          attempt_count?: number | null
          created_at?: string | null
          emotional_resonance?: Json | null
          expires_at?: string | null
          feedback?: string | null
          generated_sparks?: Json
          generation_metadata?: Json | null
          id?: string
          initial_prompt_id?: string | null
          product_track?: string | null
          selected_spark?: Json | null
          selection_time_ms?: number | null
          status?: string | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          attempt_count?: number | null
          created_at?: string | null
          emotional_resonance?: Json | null
          expires_at?: string | null
          feedback?: string | null
          generated_sparks?: Json
          generation_metadata?: Json | null
          id?: string
          initial_prompt_id?: string | null
          product_track?: string | null
          selected_spark?: Json | null
          selection_time_ms?: number | null
          status?: string | null
          trust_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      support_requests: {
        Row: {
          assigned_to: string | null
          created_at: string
          description: string
          id: string
          priority: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          description: string
          id?: string
          priority?: string | null
          status: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          description?: string
          id?: string
          priority?: string | null
          status?: string
          subject?: string
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
      cleanup_old_logs: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_secret: {
        Args: { secret_name: string }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
