// tools/printSampleSeventC.js
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');

async function main() {
  try {
    // connect to the 'sevent-c' db explicitly
    const base = process.env.MONGODB_URI.split('/').slice(0,3).join('/');
    const uri = `${base}/sevent-c?retryWrites=true&w=majority`;
    const conn = await mongoose.createConnection(uri).asPromise();
    const doc = await conn.db.collection('events').findOne({});
    console.log('Sample from sevent-c.events ->', doc);
    await conn.close();
  } catch (err) {
    console.error('Error:', err && err.message);
    process.exit(1);
  }
}

main();
