export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          price: number;
          image_url: string | null;
          category: string;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description: string;
          price: number;
          image_url?: string | null;
          category: string;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string;
          price?: number;
          image_url?: string | null;
          category?: string;
          is_available?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      product_extras: {
        Row: {
          id: string;
          product_id: string;
          name: string;
          price: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          name: string;
          price: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          name?: string;
          price?: number;
        };
        Relationships: [];
      };
      promotions: {
        Row: {
          id: string;
          title: string;
          description: string;
          discount_percentage: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          discount_percentage: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          discount_percentage?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          author: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          author: string;
          rating: number;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          author?: string;
          rating?: number;
          comment?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          customer_name: string | null;
          phone: string | null;
          total: number;
          payload: Json;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name?: string | null;
          phone?: string | null;
          total: number;
          payload: Json;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string | null;
          phone?: string | null;
          total?: number;
          payload?: Json;
          status?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
