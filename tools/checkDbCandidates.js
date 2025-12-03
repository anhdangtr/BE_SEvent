// tools/checkDbCandidates.js
// Try several database names appended to the current MONGODB_URI host to find where events live.
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

const baseUri = process.env.MONGODB_URI;
if (!baseUri) {
  console.error('MONGODB_URI not set in BE/.env');
  process.exit(1);
}

// Remove trailing slash and any database name/query
const uriWithoutDb = baseUri.split('/').slice(0, 3).join('/');
// Collect candidates (add any you want to try)
const candidates = ['sevent', 'sevent-c', 'test', 'admin'];

async function testDb(dbName) {
  const uri = `${uriWithoutDb}/${dbName}?retryWrites=true&w=majority`;
  try {
    const conn = await mongoose.createConnection(uri).asPromise();
    const count = await conn.db.collection('events').countDocuments();
    await conn.close();
    return { dbName, count };
  } catch (err) {
    return { dbName, error: err.message };
  }
}

(async () => {
  for (const d of candidates) {
    const res = await testDb(d);
    if (res.error) console.log(`${res.dbName}: ERROR -> ${res.error}`);
    else console.log(`${res.dbName}: count=${res.count}`);
  }
  process.exit(0);
})();
