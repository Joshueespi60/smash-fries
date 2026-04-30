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
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          category_id: string | null;
          name: string;
          slug: string;
          description: string;
          ingredients: string | null;
          price: number;
          image_url: string | null;
          is_available: boolean;
          is_featured: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          category_id?: string | null;
          name: string;
          slug: string;
          description: string;
          ingredients?: string | null;
          price: number;
          image_url?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category_id?: string | null;
          name?: string;
          slug?: string;
          description?: string;
          ingredients?: string | null;
          price?: number;
          image_url?: string | null;
          is_available?: boolean;
          is_featured?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      addons: {
        Row: {
          id: string;
          name: string;
          price: number;
          icon: string | null;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          icon?: string | null;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          price?: number;
          icon?: string | null;
          is_available?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      product_addons: {
        Row: {
          product_id: string;
          addon_id: string;
        };
        Insert: {
          product_id: string;
          addon_id: string;
        };
        Update: {
          product_id?: string;
          addon_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_addons_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_addons_addon_id_fkey";
            columns: ["addon_id"];
            isOneToOne: false;
            referencedRelation: "addons";
            referencedColumns: ["id"];
          },
        ];
      };
      promotions: {
        Row: {
          id: string;
          title: string;
          description: string;
          price: number | null;
          image_url: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          price?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          price?: number | null;
          image_url?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          customer_name: string;
          rating: number;
          comment: string;
          is_approved: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          rating: number;
          comment: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          rating?: number;
          comment?: string;
          is_approved?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      business_settings: {
        Row: {
          id: string;
          business_name: string | null;
          slogan: string | null;
          whatsapp_number: string;
          address: string | null;
          city: string | null;
          opening_time: string | null;
          closing_time: string | null;
          delivery_fee: number | null;
          instagram_url: string | null;
          facebook_url: string | null;
          tiktok_url: string | null;
          map_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_name?: string | null;
          slogan?: string | null;
          whatsapp_number: string;
          address?: string | null;
          city?: string | null;
          opening_time?: string | null;
          closing_time?: string | null;
          delivery_fee?: number | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          tiktok_url?: string | null;
          map_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_name?: string | null;
          slogan?: string | null;
          whatsapp_number?: string;
          address?: string | null;
          city?: string | null;
          opening_time?: string | null;
          closing_time?: string | null;
          delivery_fee?: number | null;
          instagram_url?: string | null;
          facebook_url?: string | null;
          tiktok_url?: string | null;
          map_url?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      demo_orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string | null;
          delivery_address: string | null;
          order_summary: string;
          total: number;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone?: string | null;
          delivery_address?: string | null;
          order_summary: string;
          total: number;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          customer_phone?: string | null;
          delivery_address?: string | null;
          order_summary?: string;
          total?: number;
          status?: string | null;
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
