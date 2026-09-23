import "dotenv/config";
import bcrypt from "bcryptjs";
import { pool } from "../src/db.js";

const email = process.env.SEED_EMAIL ?? "demo@test.com";
const password = process.env.SEED_PASSWORD ?? "password123";

const passwordHash = await bcrypt.hash(password, 10);

await pool.query(
  `INSERT INTO users (email, password_hash)
   VALUES ($1, $2)
   ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
  [email, passwordHash],
);

console.log(`Seeded user: ${email} / ${password}`);
await pool.end();