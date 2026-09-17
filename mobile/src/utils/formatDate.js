export function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function isExpired(dateString) {
  if (!dateString) return false;
  const deadline = new Date(dateString);
  if (isNaN(deadline.getTime())) return false;
  deadline.setHours(23, 59, 59, 999);
  return deadline.getTime() < Date.now();
}

export function daysRemaining(dateString) {
  if (!dateString) return 0;
  const target = new Date(dateString);
  if (isNaN(target.getTime())) return 0;
  target.setHours(23, 59, 59, 999);
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
}
