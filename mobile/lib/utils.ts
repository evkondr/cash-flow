export function formatDate(dateString:Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ru-RU', {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}