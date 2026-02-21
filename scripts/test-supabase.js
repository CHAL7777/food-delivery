const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function parseEnv(file) {
  const content = fs.readFileSync(file, 'utf8')
  const lines = content.split(/\n/) || []
  const env = {}
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx)
    let val = trimmed.slice(idx + 1)
    // remove surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
  return env
}

const envPath = path.resolve(process.cwd(), '.env.local')
const env = fs.existsSync(envPath) ? parseEnv(envPath) : parseEnv(path.resolve(process.cwd(), '.env'))

const url = env.NEXT_PUBLIC_SUPABASE_URL
const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE

if (!url || !key) {
  console.error('Missing SUPABASE url or service role key in .env.local or .env')
  process.exit(2)
}

const supabase = createClient(url, key)

async function test() {
  try {
    const res = await supabase
      .from('foods')
      .select('*')
      .limit(5)

    console.log('result:', JSON.stringify(res, null, 2))
  } catch (err) {
    console.error('caught error:', err)
  }
}

test()
