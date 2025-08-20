// test-connection.js
const { Pool } = require("pg");
require("dotenv").config();

async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase PostgreSQL connection...\n");

  // Check if environment variables are loaded
  console.log("Environment Variables:");
  console.log(
    "DATABASE_URL:",
    process.env.DATABASE_URL ? "✅ Loaded" : "❌ Missing"
  );
  console.log(
    "BETTER_AUTH_SECRET:",
    process.env.BETTER_AUTH_SECRET ? "✅ Loaded" : "❌ Missing"
  );

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing in .env.local file");
    return;
  }

  // Test database connection
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("\n🔌 Attempting to connect to database...");
    const client = await pool.connect();
    console.log("✅ Successfully connected to Supabase PostgreSQL!");

    // Test a simple query
    const result = await client.query(
      "SELECT version(), current_database(), current_user"
    );
    console.log("✅ Database query successful!");
    console.log("Database:", result.rows[0].current_database);
    console.log("User:", result.rows[0].current_user);

    client.release();
    await pool.end();

    console.log(
      "\n🎉 Connection test passed! You can now run Better Auth CLI."
    );
  } catch (error) {
    console.error("\n❌ Connection failed!");
    console.error("Error message:", error.message);

    if (error.message.includes("password authentication failed")) {
      console.error("\n💡 Fix: Your password is incorrect. Please:");
      console.error("1. Go to Supabase Dashboard → Settings → Database");
      console.error("2. Reset your database password");
      console.error("3. Update the DATABASE_URL in your .env.local file");
    } else if (error.message.includes("ENOTFOUND")) {
      console.error("\n💡 Fix: Check your connection string format");
    } else {
      console.error("\n💡 Full error details:", error);
    }
  }
}

testSupabaseConnection();
