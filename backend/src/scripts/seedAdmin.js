require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || 'admin';

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.');
    process.exit(1);
  }

  if (!process.env.MONGODB_URI) {
    console.error('Set MONGODB_URI in .env before seeding.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    let user = await User.findOne({ email });
    if (user) {
      user.username = username;
      user.password = password;
      user.role = 'admin';
      await user.save();
      console.log(`Updated existing user to admin: ${email}`);
    } else {
      user = await User.create({
        username,
        email,
        password,
        role: 'admin',
      });
      console.log(`Created admin user: ${email}`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
