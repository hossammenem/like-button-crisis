async function queryPref(client) {
  const queries = [
    {
      'queryStr': 'SELECT * FROM tabluno where id = $1',
      'options': [10093],
    },
    {
      'queryStr': 'SELECT * FROM tabluno',
      'options': [],
    },
    {
      'queryStr': 'SELECT * FROM tabluno where user_fav_food = $1',
      'options': ['PASTA BITCH'],
    },
  ]

  for(const query of queries) {
    console.time(query.queryStr);
    (await client.query(query.queryStr, query.options)).rows;
    console.timeEnd(query.queryStr);
  }
}

module.exports = queryPref;
