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
          id: number;
          url: string;
          created_at: string;
          uid: string;
        };
        Insert: {
          id?: number;
          url: string;
          uid: string;
        };
        Update: {
          id?: number;
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
