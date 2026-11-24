export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAdminUser(user = getStoredUser()) {
  return user?.role === 'admin';
}

export function formatEventDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString();
}

/**
 * True once the event's date+time has passed (local time).
 * `time` is usually "HH:MM" from the create form; if missing, uses end of that day.
 */
export function isEventClosed(date, time) {
  if (!date) return false;
  const startsAt = new Date(date);
  if (Number.isNaN(startsAt.getTime())) return false;

  const match = String(time || '')
    .trim()
    .match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/);

  if (match) {
    startsAt.setHours(
      Number(match[1]),
      Number(match[2]),
      Number(match[3] || 0),
      0
    );
  } else {
    startsAt.setHours(23, 59, 59, 999);
  }

  return Date.now() > startsAt.getTime();
}
