// Password-only check for the admin dashboard.
// Intentionally NOT persisted anywhere (no localStorage/sessionStorage) —
// the password must be entered every time the dashboard is opened.

export const ADMIN_PASSWORD = "admin123";

export function checkAdminPassword(password) {
  if (password !== ADMIN_PASSWORD) {
    return { success: false, message: "Incorrect password." };
  }
  return { success: true };
}
