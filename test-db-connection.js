import pkg from 'pg';
const { Pool } = pkg;
import 'dotenv/config';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const testConnection = async () => {
  try {
    console.log('🔍 Testing database connection...');
    const client = await pool.connect();
    
    console.log('✅ Connected to database successfully!');
    
    // Test if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'prompts', 'prompt_runs', 'support_tickets')
      ORDER BY table_name;
    `);
    
    console.log('📋 Existing tables:', tablesResult.rows.map(row => row.table_name));
    
    if (tablesResult.rows.length === 0) {
      console.log('❌ No tables found! You need to run the SQL setup script in Supabase dashboard.');
      console.log('📖 Check QUICK_DATABASE_SETUP.md for instructions.');
    } else if (tablesResult.rows.length < 4) {
      console.log('⚠️  Some tables are missing. Expected: users, prompts, prompt_runs, support_tickets');
      console.log('📖 Please run the complete SQL setup script in Supabase dashboard.');
    } else {
      console.log('✅ All required tables exist!');
      
      // Test a simple query
      const userCount = await client.query('SELECT COUNT(*) FROM users');
      console.log(`👥 Current users in database: ${userCount.rows[0].count}`);
    }
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    if (error.message.includes('ENOTFOUND')) {
      console.log('🌐 Network issue: Cannot reach Supabase server');
      console.log('💡 Check your internet connection and Supabase URL');
    } else if (error.message.includes('authentication')) {
      console.log('🔐 Authentication issue: Check your database password');
    } else if (error.message.includes('does not exist')) {
      console.log('🗄️ Table missing: Run the SQL setup script first');
    }
    
    process.exit(1);
  }
};

testConnection();
