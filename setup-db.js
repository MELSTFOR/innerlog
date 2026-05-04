const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const DATABASE_URL = 'postgresql://neondb_owner:npg_CZ2cOtTKo4dU@ep-broad-paper-amaiubk7.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: true
});

async function setupDB() {
  const client = await pool.connect();
  try {
    console.log('🔄 Executing schema.sql...');
    const schema = fs.readFileSync(path.join(__dirname, 'server/models/schema.sql'), 'utf8');
    await client.query(schema);
    console.log('✅ Schema created successfully');

    console.log('🔄 Executing seed.sql...');
    const seed = fs.readFileSync(path.join(__dirname, 'server/seed.sql'), 'utf8');
    await client.query(seed);
    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupDB();
