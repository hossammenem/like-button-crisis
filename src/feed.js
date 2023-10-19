const { Client } = require('pg');

const args = process.argv.slice(2);

const rows = +args[args.indexOf('-c')+1];
const table = args.indexOf('-t') != -1 ? args[args.indexOf('-t')+1] : 'tabluno';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: args.indexOf('-db') != -1 ? args[args.indexOf('-db')+1] : 'indexing-is-really-hard',
  password: process.env.DB_PASSWORD,
  port: 5432
});

(async ()=> {
await client.connect();

await client.query(`
INSERT INTO ${table}(user_name, user_fav_food, user_bd)
SELECT 
  md5(random()::text || clock_timestamp()::text)::varchar,

  CASE
    WHEN random() < 0.3 THEN 'KAtsudon'
    WHEN random() < 0.6 THEN 'meatBALLLZZ'
    ELSE 'PASTA BITCH'
  END,

  '1980-01-01'::date + (random() * ('1999-04-18'::date - '1980-01-01'::date))::integer

FROM generate_series(1,$1);
`, [rows]);

client.end();
})();
