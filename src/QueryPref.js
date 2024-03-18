const queries = [
  {
    queryStr: "SELECT * FROM tabluno where user_name = $1",
    options: ["08544f75d007ae439925bb21fe48c64c"],
  },
  {
    queryStr: "SELECT * FROM tabluno2 where user_name = $1",
    options: ["f67a10e60fde706bb6c5948374b385e5"],
  },
];
const maxIters = 5000;
const progressInterval = Math.floor(maxIters / 10);

async function queryPref(client) {
  for (const query of queries) {
    console.log("\n" + query.queryStr);
    console.log("-----------------------------------------");
    let avg = 0;
    for (let i = 1; i <= maxIters; i++) {
      const start = performance.now();
      await client.query(query.queryStr, query.options);
      const end = performance.now();
      avg += end - start;

      if (i > 0 && i % progressInterval == 0) {
        const progress = (i / maxIters) * 100;
        avg /= i;
        console.log(`${progress}%: ${avg.toFixed(3)}ms`);
        avg = 0;
      }
    }
  }
}

module.exports = queryPref;
