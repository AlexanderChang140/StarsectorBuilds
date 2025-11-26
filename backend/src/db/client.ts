import dotenv from 'dotenv';
import { types, Pool } from 'pg';

dotenv.config();

types.setTypeParser(types.builtins.NUMERIC, (val: string) => parseFloat(val));
export const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
});
