import 'dotenv/config';
import { Pool } from 'pg';

console.log('Connecting to DB via', process.env.DATABASE_URL);
const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL 
});

await pool.query(`
  CREATE TABLE IF NOT EXISTS webhooks (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    event_type TEXT NOT NULL
  );
`);

export async function addWebhook(url, eventType) {
  const res = await pool.query(
    'INSERT INTO webhooks (url, event_type) VALUES ($1, $2) RETURNING id',
    [url, eventType]
  );
  return res.rows[0].id;
}

export async function removeWebhook(id) {
  const res = await pool.query('DELETE FROM webhooks WHERE id = $1', [id]);
  return res.rowCount;
}

export async function listWebhooksByEvent(eventType) {
  const res = await pool.query(
    'SELECT id, url FROM webhooks WHERE event_type = $1',
    [eventType]
  );
  return res.rows;
}