// Supabase Database Types
// Auto-generated from database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          email: string
          phone: string | null
          company: string | null
          address: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          email: string
          phone?: string | null
          company?: string | null
          address?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          email?: string
          phone?: string | null
          company?: string | null
          address?: string | null
          notes?: string | null
        }
      }
      proposals: {
        Row: {
          id: string
          created_at: string
          user_id: string
          client_id: string
          title: string
          description: string | null
          status: 'draft' | 'sent' | 'accepted' | 'rejected'
          total_amount: number
          valid_until: string | null
          sent_at: string | null
          accepted_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          client_id: string
          title: string
          description?: string | null
          status?: 'draft' | 'sent' | 'accepted' | 'rejected'
          total_amount: number
          valid_until?: string | null
          sent_at?: string | null
          accepted_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          client_id?: string
          title?: string
          description?: string | null
          status?: 'draft' | 'sent' | 'accepted' | 'rejected'
          total_amount?: number
          valid_until?: string | null
          sent_at?: string | null
          accepted_at?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          user_id: string
          client_id: string
          proposal_id: string | null
          name: string
          description: string | null
          status: 'active' | 'completed' | 'on_hold' | 'cancelled'
          start_date: string | null
          end_date: string | null
          budget: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          client_id: string
          proposal_id?: string | null
          name: string
          description?: string | null
          status?: 'active' | 'completed' | 'on_hold' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          client_id?: string
          proposal_id?: string | null
          name?: string
          description?: string | null
          status?: 'active' | 'completed' | 'on_hold' | 'cancelled'
          start_date?: string | null
          end_date?: string | null
          budget?: number | null
        }
      }
      payment_milestones: {
        Row: {
          id: string
          created_at: string
          project_id: string
          title: string
          description: string | null
          amount: number
          due_date: string | null
          status: 'pending' | 'paid' | 'overdue'
          paid_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          title: string
          description?: string | null
          amount: number
          due_date?: string | null
          status?: 'pending' | 'paid' | 'overdue'
          paid_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          title?: string
          description?: string | null
          amount?: number
          due_date?: string | null
          status?: 'pending' | 'paid' | 'overdue'
          paid_at?: string | null
        }
      }
      time_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string
          project_id: string
          description: string
          duration_minutes: number
          logged_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          project_id: string
          description: string
          duration_minutes: number
          logged_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          project_id?: string
          description?: string
          duration_minutes?: number
          logged_at?: string
        }
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
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Specific table types for convenience
export type Client = Tables<'clients'>
export type Proposal = Tables<'proposals'>
export type Project = Tables<'projects'>
export type PaymentMilestone = Tables<'payment_milestones'>
export type TimeLog = Tables<'time_logs'>
