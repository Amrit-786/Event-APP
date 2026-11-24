const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const { getSupabase } = require('./src/db/supabase');

const app = express();

const allowedOrigins = (
  process.env.FRONTEND_URL ||
  'http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000'
)
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

// Always allow common local Vite origins during development
const localDevOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
const originAllowList = new Set([...allowedOrigins, ...localDevOrigins]);

app.use(
  cors({
    origin(origin, callback) {
      const normalized = origin ? origin.replace(/\/$/, '') : '';
      // Non-browser clients (no Origin) and allowlisted frontends
      if (!normalized || originAllowList.has(normalized)) {
        callback(null, true);
        return;
      }
      // Reject without throwing — throwing becomes a 500 and breaks the browser
      console.warn(`CORS blocked origin: ${normalized}`);
      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

try {
  getSupabase();
  console.log('Supabase client ready');
} catch (error) {
  console.error(error.message);
}

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/events', require('./src/routes/events'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
