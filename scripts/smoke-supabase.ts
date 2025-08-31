import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function main() {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  const results: Record<string, any> = { ok: true, checks: [] };

  function addCheck(name: string, ok: boolean, info?: any) {
    results.checks.push({ name, ok, info });
    if (!ok) results.ok = false;
  }

  // Basic env presence
  addCheck('env:SUPABASE_URL set', !!url);
  addCheck('env:SUPABASE_ANON_KEY set', !!anon);
  addCheck('env:SUPABASE_SERVICE_ROLE_KEY set', !!service);

  if (!url || !anon || !service) {
    console.log(JSON.stringify(results, null, 2));
    process.exit(results.ok ? 0 : 1);
  }

  // Create clients
  const supabaseAnon = createClient(url, anon);
  const supabaseAdmin = createClient(url, service);

  try {
    // Safe no-op: get API version by calling a lightweight select via service role
    const { data: users, error: usersErr } = await supabaseAdmin.from('users').select('*').limit(1);
    addCheck('service-role:select users', !usersErr, usersErr ? usersErr.message : (users?.length ?? 0));
  } catch (e: any) {
    addCheck('service-role:select users exception', false, e?.message || e);
  }

  try {
    // Test anon key reachability with a table that should be public if policies allow; fall back to error reporting
    const { data: cats, error: catsErr } = await supabaseAnon.from('categories').select('*').limit(1);
    addCheck('anon:select categories', !catsErr, catsErr ? catsErr.message : (cats?.length ?? 0));
  } catch (e: any) {
    addCheck('anon:select categories exception', false, e?.message || e);
  }

  console.log(JSON.stringify(results, null, 2));
  process.exit(results.ok ? 0 : 1);
}

main().catch((e) => {
  console.error('Unexpected smoke error', e);
  process.exit(1);
});

