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
