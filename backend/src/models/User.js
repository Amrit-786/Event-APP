const bcrypt = require('bcryptjs');
const { getSupabase } = require('../db/supabase');

function mapUser(row) {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    username: row.username,
    email: row.email,
    password: row.password,
    googleId: row.google_id,
    role: row.role,
    passwordResetToken: row.password_reset_token,
    passwordResetExpires: row.password_reset_expires
      ? new Date(row.password_reset_expires)
      : null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function hashPassword(password) {
  if (!password) return null;
  return bcrypt.hash(password, 12);
}

async function findById(id) {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return mapUser(data);
}

async function findByEmail(email) {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();
  if (error) throw error;
  return mapUser(data);
}

async function findByGoogleId(googleId) {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('google_id', googleId)
    .maybeSingle();
  if (error) throw error;
  return mapUser(data);
}

async function findByGoogleIdOrEmail(googleId, email) {
  const byGoogle = googleId ? await findByGoogleId(googleId) : null;
  if (byGoogle) return byGoogle;
  return findByEmail(email);
}

async function findByResetToken(hashedToken) {
  const { data, error } = await getSupabase()
    .from('users')
    .select('*')
    .eq('password_reset_token', hashedToken)
    .gt('password_reset_expires', new Date().toISOString())
    .maybeSingle();
  if (error) throw error;
  return mapUser(data);
}

async function createUser({ username, email, password, googleId, role = 'user' }) {
  const hashed = await hashPassword(password);
  const { data, error } = await getSupabase()
    .from('users')
    .insert({
      username,
      email,
      password: hashed,
      google_id: googleId || null,
      role,
    })
    .select('*')
    .single();
  if (error) throw error;
  return mapUser(data);
}

async function updateUser(id, updates) {
  const payload = {};
  if (updates.username !== undefined) payload.username = updates.username;
  if (updates.email !== undefined) payload.email = updates.email;
  if (updates.role !== undefined) payload.role = updates.role;
  if (updates.googleId !== undefined) payload.google_id = updates.googleId;
  if (updates.passwordResetToken !== undefined) {
    payload.password_reset_token = updates.passwordResetToken;
  }
  if (updates.passwordResetExpires !== undefined) {
    payload.password_reset_expires = updates.passwordResetExpires
      ? new Date(updates.passwordResetExpires).toISOString()
      : null;
  }
  if (updates.password !== undefined) {
    payload.password = updates.password
      ? await hashPassword(updates.password)
      : null;
  }

  const { data, error } = await getSupabase()
    .from('users')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw error;
  return mapUser(data);
}

async function matchPassword(user, enteredPassword) {
  if (!user?.password) return false;
  return bcrypt.compare(enteredPassword, user.password);
}

module.exports = {
  findById,
  findByEmail,
  findByGoogleId,
  findByGoogleIdOrEmail,
  findByResetToken,
  createUser,
  updateUser,
  matchPassword,
};
