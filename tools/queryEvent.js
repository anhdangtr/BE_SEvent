const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env from src/.env like server
dotenv.config({ path: path.join(__dirname, '..', 'src', '.env'), override: true });

const Event = require('../src/models/Event');

const idsToCheck = [
  '69304f32de762330e6f73040',
  '69304f32de762330e6f73042'
];

(async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGODB_URI not set in src/.env');
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const total = await Event.countDocuments();
    console.log('\nTotal events in DB:', total);

    const samples = await Event.find().sort({ createdAt: -1 }).limit(5).select('title _id saveCount interestingCount').lean();
    console.log('\nLatest events (up to 5):');
    samples.forEach((s, idx) => {
      console.log(`  ${idx + 1}. _id=${s._id.toString()} | title=${s.title || '<no title>'} | saveCount=${s.saveCount || 0} | interestingCount=${s.interestingCount || 0}`);
    });

    // Sanity-check: try finding each sample by its own _id using both ObjectId and string
    console.log('\nSanity checks for sample items using findById:');
    for (const s of samples) {
      const sid = s._id;
      const byObj = await Event.findById(sid).lean();
      const byStr = await Event.findById(sid.toString()).lean();
      console.log(`  Sample _id=${sid.toString()} -> byObj:${byObj ? 'FOUND' : 'NOTFOUND'}, byStr:${byStr ? 'FOUND' : 'NOTFOUND'}`);
    }

    // Raw collection inspect: reveal the runtime type of _id
    console.log('\nRaw collection _id types (first sample):');
    const rawDocs = await mongoose.connection.db.collection('events').find().limit(3).toArray();
    rawDocs.forEach((d, i) => {
      console.log(`  raw[${i}]._id -> typeof: ${typeof d._id}, ctor: ${d._id && d._id.constructor ? d._id.constructor.name : 'N/A'}, value: ${d._id}`);
    });

    for (const id of idsToCheck) {
      console.log('\nChecking ID:', id);
      const doc = await Event.findById(id).lean();
      if (!doc) {
        console.log('  -> Not found');
      } else {
        console.log('  -> Found:');
        console.log('     title:', doc.title);
        console.log('     _id:', doc._id.toString());
        console.log('     saveCount:', doc.saveCount);
        console.log('     interestingCount:', doc.interestingCount);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error querying MongoDB:', err);
    process.exit(1);
  }
})();
