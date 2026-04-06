import {Pool} from 'pg';
(async () => {
  try {
    const pool = new Pool({ connectionString: "your_postgres_url" });
    await pool.query("SELECT 1");
  } catch (e) {
    console.error("Error:", e.message);
  }
})();
