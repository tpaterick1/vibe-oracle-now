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
      event_clicks: {
        Row: {
          created_at: string
          event_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_clicks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "external_events"
            referencedColumns: ["id"]
          },
        ]
      }
      external_events: {
        Row: {
          created_at: string
          end_datetime: string | null
          event_description: string | null
          event_title: string
          event_type: string
          id: string
          image_url: string | null
          lat: number | null
          lng: number | null
          scraped_at: string | null
          source_url: string | null
          start_datetime: string
          updated_at: string
          venue_address: string | null
          venue_name: string | null
        }
        Insert: {
          created_at?: string
          end_datetime?: string | null
          event_description?: string | null
          event_title: string
          event_type: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          scraped_at?: string | null
          source_url?: string | null
          start_datetime: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Update: {
          created_at?: string
          end_datetime?: string | null
          event_description?: string | null
          event_title?: string
          event_type?: string
          id?: string
          image_url?: string | null
          lat?: number | null
          lng?: number | null
          scraped_at?: string | null
          source_url?: string | null
          start_datetime?: string
          updated_at?: string
          venue_address?: string | null
          venue_name?: string | null
        }
        Relationships: []
      }
      scraped_venue_pdp_data: {
        Row: {
          address: string | null
          ai_summary: string | null
          categories: string[] | null
          created_at: string | null
          description: string | null
          game_night_info: string | null
          id: string
          images: Json | null
          last_scraped_at: string | null
          music_info: string | null
          name: string
          other_features: string | null
          phone: string | null
          scraped_content_html: string | null
          scraped_content_markdown: string | null
          source_url: string
          specials_info: string | null
          updated_at: string | null
          website_link: string | null
        }
        Insert: {
          address?: string | null
          ai_summary?: string | null
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          game_night_info?: string | null
          id?: string
          images?: Json | null
          last_scraped_at?: string | null
          music_info?: string | null
          name: string
          other_features?: string | null
          phone?: string | null
          scraped_content_html?: string | null
          scraped_content_markdown?: string | null
          source_url: string
          specials_info?: string | null
          updated_at?: string | null
          website_link?: string | null
        }
        Update: {
          address?: string | null
          ai_summary?: string | null
          categories?: string[] | null
          created_at?: string | null
          description?: string | null
          game_night_info?: string | null
          id?: string
          images?: Json | null
          last_scraped_at?: string | null
          music_info?: string | null
          name?: string
          other_features?: string | null
          phone?: string | null
          scraped_content_html?: string | null
          scraped_content_markdown?: string | null
          source_url?: string
          specials_info?: string | null
          updated_at?: string | null
          website_link?: string | null
        }
        Relationships: []
      }
      venues: {
        Row: {
          created_at: string
          id: string
          image: string | null
          lat: number
          lng: number
          name: string
          neon_color_class: string | null
          story: string | null
          text_color_class: string | null
          updated_at: string
          vibe_tags: string[]
        }
        Insert: {
          created_at?: string
          id: string
          image?: string | null
          lat: number
          lng: number
          name: string
          neon_color_class?: string | null
          story?: string | null
          text_color_class?: string | null
          updated_at?: string
          vibe_tags: string[]
        }
        Update: {
          created_at?: string
          id?: string
          image?: string | null
          lat?: number
          lng?: number
          name?: string
          neon_color_class?: string | null
          story?: string | null
          text_color_class?: string | null
          updated_at?: string
          vibe_tags?: string[]
        }
        Relationships: []
      }
      vibe_snapshots: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          location: string
          source: string | null
          vibe: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          source?: string | null
          vibe: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          source?: string | null
          vibe?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
