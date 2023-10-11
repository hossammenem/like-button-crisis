const { Client } = require('pg');
const queryPref = require('./src/QueryPref');
const IXSizes = require('./src/IXSizePercentage');

require('dotenv').config();

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'indexing-is-really-hard',
  password: process.env.DB_PASSWORD,
  port: 5432 // default port for postgres
});

(async ()=> {
  try {
    await client.connect();

     // hash index is smaller than btree by 8% 
     // await IXSizes(client, 'tabluno');
     // await IXSizes(client, 'tabluno2');
    
     await queryPref(client);

  } catch(err) {
    console.log('we got this error: \n', err);
    throw err;

  } finally {
    client.end();
  }
})();
