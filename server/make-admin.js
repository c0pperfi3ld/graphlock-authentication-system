import mongoose from 'mongoose';
import 'dotenv/config';
import User from './models/User.js';

const username = process.argv[2];

if (!username) {
  console.log('❌ Please provide a username. Example: node make-admin.js test32');
  process.exit(1);
}

async function promote() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ username: username.toLowerCase() });
    
    if (!user) {
      console.log(`❌ User "${username}" not found.`);
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    console.log(`✅ Success! User "${user.username}" is now an Admin.`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

promote();
