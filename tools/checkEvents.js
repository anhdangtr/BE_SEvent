// tools/checkEvents.js
// Quick script to report counts in the events collection using the same .env
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Event = require('../src/models/Event');

async function main() {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('MONGODB_URI not set in BE/.env');
      process.exit(1);
    }
  await mongoose.connect(uri);
    console.log('Connected to MongoDB for check');

    const total = await Event.countDocuments({});
    console.log('Total events in collection:', total);

    const sample = await Event.findOne({}).lean();
    console.log('Sample document:', sample);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error checking events:', err && err.message);
    process.exit(1);
  }
}

main();
