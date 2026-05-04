const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function runSeed() {
  // Use DATABASE_URL if available, otherwise construct from env vars
  const connectionString = process.env.DATABASE_URL || 
    `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  const pool = new Pool({
    connectionString: connectionString,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    // Read and execute schema.sql
    console.log('Reading schema.sql...');
    const schemaSQL = fs.readFileSync(path.join(__dirname, 'models', 'schema.sql'), 'utf8');
    console.log('Executing schema.sql...');
    await client.query(schemaSQL);
    console.log('✓ Schema created successfully');
    
    // Read and execute seed.sql
    console.log('Reading seed.sql...');
    const seedSQL = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8');
    console.log('Executing seed.sql...');
    await client.query(seedSQL);
    console.log('✓ Seed data inserted successfully');
    
    client.release();
    await pool.end();
    console.log('Database initialization completed!');
  } catch (error) {
    console.error('Error:', error.message);
    await pool.end();
    process.exit(1);
  }
}

runSeed();
