// this shit needs some refactoring.
async function IXSizes(client, tableName) {
  const IXs = (await client.query('SELECT indexname, indexdef from pg_indexes where tablename = $1', [tableName])).rows;

  const IXsSizes = await Promise.all(
    IXs.map(async (row)=> {
      let size = (await client.query('SELECT pg_size_pretty(pg_table_size($1))', [row.indexname])).rows[0].pg_size_pretty;
      return { indexname: row.indexname, indexdef: row.indexdef, size };
    })
  );

  const totalIXSize = (await client.query('SELECT pg_size_pretty(pg_indexes_size($1))', [tableName])).rows[0].pg_size_pretty;

  const tableSize = (await client.query('SELECT pg_size_pretty(pg_table_size($1))', [tableName])).rows[0].pg_size_pretty;

  IXsSizes.map((IX)=> {
    let precentage = (parseInt(IX.size) / parseInt(tableSize)).toFixed(2)*100 + '%';
    console.log(IX.indexdef, " || ", IX.indexname, " || ", precentage);
  });

  let totalIXSizePercentage = (parseInt(totalIXSize) / parseInt(tableSize)).toFixed(2)*100 + '%';
  console.log('total: ', totalIXSizePercentage);
}

module.exports = IXSizes;
