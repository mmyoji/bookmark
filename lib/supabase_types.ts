export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      items: {
        Row: {
          id: string;
          url: string;
          created_at: string;
          uid: string;
        };
        Insert: {
          id?: string;
          url: string;
          uid: string;
        };
        Update: {
          id?: string;
          url: string;
          uid: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
