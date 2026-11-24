const { getSupabase } = require('../db/supabase');

function mapParticipant(row) {
  if (!row) return null;
  if (row.users) {
    return {
      _id: row.users.id,
      id: row.users.id,
      username: row.users.username,
      email: row.users.email,
    };
  }
  return { _id: row.user_id, id: row.user_id };
}

function mapEvent(row) {
  if (!row) return null;

  const participants = Array.isArray(row.event_participants)
    ? row.event_participants.map(mapParticipant).filter(Boolean)
    : [];

  const organizer = row.organizer
    ? {
        _id: row.organizer.id,
        id: row.organizer.id,
        username: row.organizer.username,
      }
    : row.organizer_id
      ? { _id: row.organizer_id, id: row.organizer_id }
      : null;

  return {
    _id: row.id,
    id: row.id,
    name: row.name,
    description: row.description,
    date: row.date,
    time: row.time,
    location: row.location,
    organizer,
    organizerId: row.organizer_id,
    participants,
    maxParticipants: row.max_participants,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const EVENT_SELECT = `
  *,
  organizer:users!organizer_id ( id, username ),
  event_participants (
    user_id,
    users ( id, username, email )
  )
`;

async function createEvent(payload) {
  const { data, error } = await getSupabase()
    .from('events')
    .insert({
      name: payload.name,
      description: payload.description,
      date: payload.date,
      time: payload.time,
      location: payload.location,
      organizer_id: payload.organizerId,
      max_participants: payload.maxParticipants,
      category: payload.category,
      status: payload.status || 'upcoming',
    })
    .select(EVENT_SELECT)
    .single();
  if (error) throw error;
  return mapEvent(data);
}

async function findAll() {
  const { data, error } = await getSupabase()
    .from('events')
    .select(EVENT_SELECT)
    .order('date', { ascending: true });
  if (error) throw error;
  return (data || []).map(mapEvent);
}

async function findById(id) {
  const { data, error } = await getSupabase()
    .from('events')
    .select(EVENT_SELECT)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return mapEvent(data);
}

async function updateEvent(id, updates) {
  const payload = {};
  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.date !== undefined) payload.date = updates.date;
  if (updates.time !== undefined) payload.time = updates.time;
  if (updates.location !== undefined) payload.location = updates.location;
  if (updates.maxParticipants !== undefined) {
    payload.max_participants = updates.maxParticipants;
  }
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.status !== undefined) payload.status = updates.status;

  const { data, error } = await getSupabase()
    .from('events')
    .update(payload)
    .eq('id', id)
    .select(EVENT_SELECT)
    .single();
  if (error) throw error;
  return mapEvent(data);
}

async function deleteEvent(id) {
  const { error } = await getSupabase().from('events').delete().eq('id', id);
  if (error) throw error;
}

async function addParticipant(eventId, userId) {
  const { error } = await getSupabase().from('event_participants').insert({
    event_id: eventId,
    user_id: userId,
  });
  if (error) throw error;
}

async function removeParticipant(eventId, userId) {
  const { data, error } = await getSupabase()
    .from('event_participants')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .select('user_id');
  if (error) throw error;
  return (data || []).length > 0;
}

async function searchEvents({
  name,
  category,
  startDate,
  endDate,
  page = 1,
  limit = 10,
  sortBy = 'date',
  sortOrder = 'asc',
}) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const allowedSort = new Set(['date', 'name', 'created_at', 'category']);
  const column = allowedSort.has(sortBy) ? sortBy : 'date';

  let query = getSupabase()
    .from('events')
    .select(EVENT_SELECT, { count: 'exact' });

  if (name) query = query.ilike('name', `%${name}%`);
  if (category) query = query.eq('category', category);
  if (startDate) query = query.gte('date', startDate);
  if (endDate) query = query.lte('date', endDate);

  query = query
    .order(column, { ascending: sortOrder !== 'desc' })
    .range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const totalEvents = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalEvents / limit) || 1);

  return {
    events: (data || []).map(mapEvent),
    currentPage: page,
    totalPages,
    totalEvents,
  };
}

module.exports = {
  createEvent,
  findAll,
  findById,
  updateEvent,
  deleteEvent,
  addParticipant,
  removeParticipant,
  searchEvents,
};
