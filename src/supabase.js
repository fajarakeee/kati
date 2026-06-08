import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kgjcydepppxujcylescj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnamN5ZGVwcHB4dWpjeWxlc2NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2NDI1MDEsImV4cCI6MjA5NjIxODUwMX0.llfFo5qZBy5Tpx2p_IOPC2ZJDwLrxx5HHPRpiI-LNKM'

export const supabase = createClient(supabaseUrl, supabaseKey)