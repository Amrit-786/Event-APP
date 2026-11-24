const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const User = require('../models/User');

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || 'admin';

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.');
    process.exit(1);
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env before seeding.');
    process.exit(1);
  }

  try {
    let user = await User.findByEmail(email);
    if (user) {
      await User.updateUser(user._id, {
        username,
        password,
        role: 'admin',
      });
      console.log(`Updated existing user to admin: ${email}`);
    } else {
      await User.createUser({
        username,
        email,
        password,
        role: 'admin',
      });
      console.log(`Created admin user: ${email}`);
    }
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed admin:', error.message);
    process.exit(1);
  }
}

seedAdmin();
