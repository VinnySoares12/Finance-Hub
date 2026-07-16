// Espelha supabase/migrations/20260715120000_finance_hub_init.sql.
// Ao alterar o schema, atualize este arquivo (ou gere com
// `supabase gen types typescript --project-id wtwhxpufdeslqlwdatgb`).
//
// O campo `Relationships` é exigido pelo tipo GenericTable do postgrest-js;
// sem ele o client resolve todas as tabelas como `never`. Fica vazio porque o
// app nunca usa joins embutidos (`select('*, outra_tabela(*)')`).

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          language?: string;
        };
        Update: {
          display_name?: string | null;
          language?: string;
        };
        Relationships: [];
      };
      finance_settings: {
        Row: {
          user_id: string;
          salary: number;
          savings_percent: number;
          goal_name: string;
          goal_amount: number;
          initial_saved: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          salary?: number;
          savings_percent?: number;
          goal_name?: string;
          goal_amount?: number;
          initial_saved?: number;
        };
        Update: {
          salary?: number;
          savings_percent?: number;
          goal_name?: string;
          goal_amount?: number;
          initial_saved?: number;
        };
        Relationships: [];
      };
      monthly_savings: {
        Row: {
          user_id: string;
          month_key: string;
          amount: number;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          month_key: string;
          amount: number;
        };
        Update: {
          amount?: number;
        };
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          subcategory: string;
          payment_method: string;
          installments: number | null;
          installment_group_id: string | null;
          due_date: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          amount: number;
          category: string;
          subcategory: string;
          payment_method: string;
          installments?: number | null;
          installment_group_id?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          amount?: number;
          category?: string;
          subcategory?: string;
          payment_method?: string;
          installments?: number | null;
          installment_group_id?: string | null;
          due_date?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
