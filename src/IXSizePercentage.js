async function IXSizes(client, tableName) {
  // get pretty table size to log it
  const tableSizePretty = getSize(await client.query('SELECT pg_size_pretty(pg_table_size($1))', [tableName]), true);
  console.log(tableName , '->', tableSizePretty);

  const totalIXSizePretty = getSize(await client.query('SELECT pg_size_pretty(pg_indexes_size($1))', [tableName]), true);
  console.log('total IXs size of table', tableName, 'is', totalIXSizePretty);

  divider();


  // get all the indexes of that table
  const IXs = (await client.query('SELECT indexname, indexdef from pg_indexes where tablename = $1', [tableName])).rows;

  // iterate over all of them to return a list that contains each index's size, def and name
  const IXsSizes = await Promise.all(
    IXs.map(async (row)=> {
      // pretty size to log it
      let sizePretty = getSize(await client.query('SELECT pg_size_pretty(pg_table_size($1))', [row.indexname]), true);
      console.log(row.indexdef, '||', row.indexname , '->', sizePretty);

      // store the IX size in bytes ( so it's easier when it comes to comparisons )
      let size = getSize(await client.query('SELECT pg_table_size($1)', [row.indexname]), false);

      return { indexname: row.indexname, indexdef: row.indexdef, size };
    })
  );

  const totalIXSize = getSize(await client.query('SELECT pg_indexes_size($1)', [tableName]), false, true);
  const tableSize = getSize(await client.query('SELECT pg_table_size($1)', [tableName]), false);


  IXsSizes.map((IX)=> console.log(IX.indexdef, "||", IX.indexname, "->", getPercentage(IX.size, tableSize)));

  console.log('total: ', getPercentage(totalIXSize, tableSize));

  divider();
}

const getSize = (query, pretty, idx) => pretty ? query.rows[0].pg_size_pretty : idx ? query.rows[0].pg_indexes_size : query.rows[0].pg_table_size;

const getPercentage = (nume, denom)=> (parseInt(nume) / parseInt(denom)).toFixed(2)*100 + '%';

const divider = ()=> console.log('\n','--------------------------------------------', '\n');

module.exports = IXSizes;


