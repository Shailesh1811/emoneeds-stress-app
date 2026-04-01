import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qebtncgrhpkuidaxea.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlYnRuY2dyaHBrdWlkYXhlYXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTYwNjIsImV4cCI6MjA5MDYzMjA2Mn0.mBEZWZpAcEVo2ud6-AXoGS98E3XZoj8rxdnI1Ils4dk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
