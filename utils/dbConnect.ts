import {Pool} from 'pg';

export const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.PORT_NUMBER as string, 10)
})

export default async function dbConnect() {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query('SELECT NOW()');
      console.log(result.rows);
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error executing query', err.stack);
      }
    } finally {
      client.release();
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error acquiring client', err.stack);
    }
  }
}