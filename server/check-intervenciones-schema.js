const db = require('./config/db');

async function checkTable() {
  try {
    // Check intervenciones table structure
    const result = await db.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'intervenciones'
      ORDER BY ordinal_position
    `);
    
    console.log('Intervenciones table columns:');
    result.rows.forEach(row => {
      console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
}

checkTable();
