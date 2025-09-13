export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      colleges: {
        Row: {
          accreditation: string | null
          affiliation: string | null
          city: string
          college_type: string | null
          courses_offered: string[] | null
          created_at: string
          email: string | null
          establishment_year: number | null
          facilities: string[] | null
          fees_range: string | null
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          name: string
          nirf_ranking: number | null
          phone: string | null
          ranking: number | null
          state: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          accreditation?: string | null
          affiliation?: string | null
          city: string
          college_type?: string | null
          courses_offered?: string[] | null
          created_at?: string
          email?: string | null
          establishment_year?: number | null
          facilities?: string[] | null
          fees_range?: string | null
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          name: string
          nirf_ranking?: number | null
          phone?: string | null
          ranking?: number | null
          state: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          accreditation?: string | null
          affiliation?: string | null
          city?: string
          college_type?: string | null
          courses_offered?: string[] | null
          created_at?: string
          email?: string | null
          establishment_year?: number | null
          facilities?: string[] | null
          fees_range?: string | null
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          name?: string
          nirf_ranking?: number | null
          phone?: string | null
          ranking?: number | null
          state?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          academic_interests: string[] | null
          age: number | null
          career_goals: string[] | null
          class_level: string | null
          created_at: string
          full_name: string | null
          gender: string | null
          id: string
          learning_style: string | null
          location: string | null
          phone: string | null
          preferred_subjects: string[] | null
          role: Database["public"]["Enums"]["user_role"]
          stream: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          academic_interests?: string[] | null
          age?: number | null
          career_goals?: string[] | null
          class_level?: string | null
          created_at?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          learning_style?: string | null
          location?: string | null
          phone?: string | null
          preferred_subjects?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          stream?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          academic_interests?: string[] | null
          age?: number | null
          career_goals?: string[] | null
          class_level?: string | null
          created_at?: string
          full_name?: string | null
          gender?: string | null
          id?: string
          learning_style?: string | null
          location?: string | null
          phone?: string | null
          preferred_subjects?: string[] | null
          role?: Database["public"]["Enums"]["user_role"]
          stream?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          completed_at: string
          id: string
          responses: Json
          user_id: string
        }
        Insert: {
          completed_at?: string
          id?: string
          responses: Json
          user_id: string
        }
        Update: {
          completed_at?: string
          id?: string
          responses?: Json
          user_id?: string
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          career_recommendations: Json
          college_recommendations: string[] | null
          course_recommendations: Json
          generated_at: string
          id: string
          quiz_response_id: string | null
          scholarship_matches: string[] | null
          user_id: string
        }
        Insert: {
          career_recommendations: Json
          college_recommendations?: string[] | null
          course_recommendations: Json
          generated_at?: string
          id?: string
          quiz_response_id?: string | null
          scholarship_matches?: string[] | null
          user_id: string
        }
        Update: {
          career_recommendations?: Json
          college_recommendations?: string[] | null
          course_recommendations?: Json
          generated_at?: string
          id?: string
          quiz_response_id?: string | null
          scholarship_matches?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_quiz_response_id_fkey"
            columns: ["quiz_response_id"]
            isOneToOne: false
            referencedRelation: "quiz_responses"
            referencedColumns: ["id"]
          },
        ]
      }
      scholarships: {
        Row: {
          amount: number | null
          application_deadline: string | null
          caste_category: string[] | null
          category: string | null
          created_at: string
          description: string | null
          documents_required: string[] | null
          education_level: string | null
          eligibility_criteria: string[] | null
          gender_specific: string | null
          id: string
          income_limit: number | null
          is_active: boolean | null
          name: string
          provider: string
          state_specific: string | null
          updated_at: string
        }
        Insert: {
          amount?: number | null
          application_deadline?: string | null
          caste_category?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          documents_required?: string[] | null
          education_level?: string | null
          eligibility_criteria?: string[] | null
          gender_specific?: string | null
          id?: string
          income_limit?: number | null
          is_active?: boolean | null
          name: string
          provider: string
          state_specific?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number | null
          application_deadline?: string | null
          caste_category?: string[] | null
          category?: string | null
          created_at?: string
          description?: string | null
          documents_required?: string[] | null
          education_level?: string | null
          eligibility_criteria?: string[] | null
          gender_specific?: string | null
          id?: string
          income_limit?: number | null
          is_active?: boolean | null
          name?: string
          provider?: string
          state_specific?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_timeline_subscriptions: {
        Row: {
          created_at: string
          event_id: string
          id: string
          notification_preferences: Json
          status: string
          subscribed_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          notification_preferences?: Json
          status?: string
          subscribed_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          notification_preferences?: Json
          status?: string
          subscribed_at?: string
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
      get_personalized_recommendations: {
        Args: { input_user_id: string }
        Returns: {
          recommendation_data: Json
          recommendation_type: string
        }[]
      }
    }
    Enums: {
      user_role: "student" | "admin"
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
    Enums: {
      user_role: ["student", "admin"],
    },
  },
} as const
