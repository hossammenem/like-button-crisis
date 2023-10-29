const { Client } = require('pg');

const args = process.argv.slice(2);

const rows = +args[args.indexOf('-c')+1];
const table = args.indexOf('-t') != -1 ? args[args.indexOf('-t')+1] : 'liked_posts';

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: args.indexOf('-db') != -1 ? args[args.indexOf('-db')+1] : 'indexing-is-really-hard',
  password: process.env.DB_PASSWORD,
  port: 5432
});

(async ()=> {
await client.connect();

await client.query(`INSERT INTO ${table} SELECT uuid_generate_v4(), uuid_generate_v4(), CURRENT_DATE FROM generate_series(1,$1);`, [rows]);

client.end();

console.log('DONE!');
})();
