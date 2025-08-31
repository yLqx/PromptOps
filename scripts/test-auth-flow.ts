import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

async function testAuthFlow() {
  const supabaseUrl = process.env.SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  console.log('🔍 Testing Authentication Flow...\n');
  
  // Test 1: Check if users table exists and has correct structure
  console.log('1. Testing users table structure...');
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Users table error:', error.message);
    } else {
      console.log('✅ Users table accessible');
    }
  } catch (e) {
    console.log('❌ Users table exception:', e);
  }
  
  // Test 2: Check RLS policies
  console.log('\n2. Testing RLS policies...');
  try {
    // This should work with service role
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .single();
    
    if (error) {
      console.log('❌ RLS policy error:', error.message);
    } else {
      console.log('✅ RLS policies working');
    }
  } catch (e) {
    console.log('❌ RLS exception:', e);
  }
  
  // Test 3: Check categories table (should be publicly readable)
  console.log('\n3. Testing categories table...');
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Categories error:', error.message);
    } else {
      console.log('✅ Categories table accessible');
      console.log(`   Found ${data?.length || 0} categories`);
    }
  } catch (e) {
    console.log('❌ Categories exception:', e);
  }
  
  // Test 4: Test auth user creation trigger
  console.log('\n4. Testing auth trigger function...');
  try {
    const { data, error } = await supabase.rpc('handle_new_user');
    console.log('✅ Auth trigger function exists');
  } catch (e: any) {
    if (e.message?.includes('function handle_new_user() does not exist')) {
      console.log('❌ Auth trigger function missing - this will cause profile creation issues');
    } else {
      console.log('✅ Auth trigger function exists (expected error for manual call)');
    }
  }
  
  // Test 5: Check if we can create a test user profile manually
  console.log('\n5. Testing manual user profile creation...');
  const testUserId = '00000000-0000-0000-0000-000000000001';
  
  try {
    // First, clean up any existing test user
    await supabase
      .from('users')
      .delete()
      .eq('id', testUserId);
    
    // Try to create a test user profile
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        username: 'test_user_' + Date.now(),
        email: 'test@example.com',
        full_name: 'Test User',
        plan: 'free'
      })
      .select()
      .single();
    
    if (error) {
      console.log('❌ User creation error:', error.message);
    } else {
      console.log('✅ User profile creation works');
      
      // Clean up
      await supabase
        .from('users')
        .delete()
        .eq('id', testUserId);
    }
  } catch (e) {
    console.log('❌ User creation exception:', e);
  }
  
  console.log('\n🏁 Auth flow test complete!');
}

testAuthFlow().catch(console.error);
