import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL, // from .env
    // ssl: { rejectUnauthorized: false } // only if using cloud db that requires SSL
  }),
  secret: process.env.BETTER_AUTH_SECRET,
});
