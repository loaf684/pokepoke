import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://genmldraktjpwgipzcse.supabase.co'
const supabaseKey = 'sb_publishable_WIRXyQjEkCfbeWiRpJRS9A_-iceoSvG'

export const supabase = createClient(supabaseUrl, supabaseKey)
