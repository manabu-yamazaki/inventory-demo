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
      user_profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          role: 'admin' | 'manager' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          role: 'admin' | 'manager' | 'user'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          role?: 'admin' | 'manager' | 'user'
          created_at?: string
          updated_at?: string
        }
      }
      permissions: {
        Row: {
          id: string
          resource: string
          action: 'create' | 'read' | 'update' | 'delete'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          resource: string
          action: 'create' | 'read' | 'update' | 'delete'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          resource?: string
          action?: 'create' | 'read' | 'update' | 'delete'
          created_at?: string
          updated_at?: string
        }
      }
      role_permissions: {
        Row: {
          role: 'admin' | 'manager' | 'user'
          permission_id: string
          created_at: string
        }
        Insert: {
          role: 'admin' | 'manager' | 'user'
          permission_id: string
          created_at?: string
        }
        Update: {
          role?: 'admin' | 'manager' | 'user'
          permission_id?: string
          created_at?: string
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