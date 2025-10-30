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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          document_type: string
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          supply_id: string
          uploaded_at: string
          uploaded_by: string | null
        }
        Insert: {
          document_type: string
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          supply_id: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Update: {
          document_type?: string
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          supply_id?: string
          uploaded_at?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          district: string | null
          full_name: string
          id: string
          organization_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          district?: string | null
          full_name: string
          id: string
          organization_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          district?: string | null
          full_name?: string
          id?: string
          organization_name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      schools: {
        Row: {
          block: string | null
          board: Database["public"]["Enums"]["education_board"]
          contact_person: string | null
          created_at: string
          district: string
          id: string
          name: string
          phone: string | null
          pincode: string | null
          state: string
          student_count: number | null
        }
        Insert: {
          block?: string | null
          board: Database["public"]["Enums"]["education_board"]
          contact_person?: string | null
          created_at?: string
          district: string
          id?: string
          name: string
          phone?: string | null
          pincode?: string | null
          state: string
          student_count?: number | null
        }
        Update: {
          block?: string | null
          board?: Database["public"]["Enums"]["education_board"]
          contact_person?: string | null
          created_at?: string
          district?: string
          id?: string
          name?: string
          phone?: string | null
          pincode?: string | null
          state?: string
          student_count?: number | null
        }
        Relationships: []
      }
      supplies: {
        Row: {
          actual_delivery_date: string | null
          batch_id: string
          blockchain_hash: string | null
          category: string
          created_at: string
          current_status: Database["public"]["Enums"]["supply_status"]
          description: string | null
          destination_district: string
          destination_school_id: string | null
          destination_state: string
          education_board: Database["public"]["Enums"]["education_board"] | null
          expected_delivery_date: string | null
          government_scheme: string | null
          id: string
          item_type: string
          manufacture_date: string
          qr_code: string | null
          quantity: number
          supplier_id: string | null
          total_value: number | null
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          actual_delivery_date?: string | null
          batch_id: string
          blockchain_hash?: string | null
          category: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["supply_status"]
          description?: string | null
          destination_district: string
          destination_school_id?: string | null
          destination_state: string
          education_board?:
            | Database["public"]["Enums"]["education_board"]
            | null
          expected_delivery_date?: string | null
          government_scheme?: string | null
          id?: string
          item_type: string
          manufacture_date?: string
          qr_code?: string | null
          quantity: number
          supplier_id?: string | null
          total_value?: number | null
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          actual_delivery_date?: string | null
          batch_id?: string
          blockchain_hash?: string | null
          category?: string
          created_at?: string
          current_status?: Database["public"]["Enums"]["supply_status"]
          description?: string | null
          destination_district?: string
          destination_school_id?: string | null
          destination_state?: string
          education_board?:
            | Database["public"]["Enums"]["education_board"]
            | null
          expected_delivery_date?: string | null
          government_scheme?: string | null
          id?: string
          item_type?: string
          manufacture_date?: string
          qr_code?: string | null
          quantity?: number
          supplier_id?: string | null
          total_value?: number | null
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplies_destination_school_id_fkey"
            columns: ["destination_school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supplies_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          block_hash: string
          from_location: string
          from_party: string | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          previous_hash: string | null
          status: Database["public"]["Enums"]["supply_status"]
          supply_id: string
          timestamp: string
          to_location: string
          to_party: string | null
          transaction_type: string
          verified_by: string | null
        }
        Insert: {
          block_hash: string
          from_location: string
          from_party?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          previous_hash?: string | null
          status: Database["public"]["Enums"]["supply_status"]
          supply_id: string
          timestamp?: string
          to_location: string
          to_party?: string | null
          transaction_type: string
          verified_by?: string | null
        }
        Update: {
          block_hash?: string
          from_location?: string
          from_party?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          previous_hash?: string | null
          status?: Database["public"]["Enums"]["supply_status"]
          supply_id?: string
          timestamp?: string
          to_location?: string
          to_party?: string | null
          transaction_type?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_supply_id_fkey"
            columns: ["supply_id"]
            isOneToOne: false
            referencedRelation: "supplies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_block_hash: {
        Args: { supply_uuid: string; tx_type: string }
        Returns: string
      }
    }
    Enums: {
      education_board: "CBSE" | "ICSE" | "State Board" | "Other"
      supply_status:
        | "manufactured"
        | "quality_checked"
        | "in_warehouse"
        | "in_transit"
        | "delivered"
        | "verified"
      user_role:
        | "admin"
        | "supplier"
        | "distributor"
        | "school"
        | "government_official"
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
      education_board: ["CBSE", "ICSE", "State Board", "Other"],
      supply_status: [
        "manufactured",
        "quality_checked",
        "in_warehouse",
        "in_transit",
        "delivered",
        "verified",
      ],
      user_role: [
        "admin",
        "supplier",
        "distributor",
        "school",
        "government_official",
      ],
    },
  },
} as const
