function toMinutes(timeValue: string): number {
  const [hoursRaw, minutesRaw] = timeValue.split(":");
  const hours = Number.parseInt(hoursRaw ?? "0", 10);
  const minutes = Number.parseInt(minutesRaw ?? "0", 10);
  return hours * 60 + minutes;
}

export function isBusinessOpen(opening_time: string, closing_time: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const openMinutes = toMinutes(opening_time);
  const closeMinutes = toMinutes(closing_time);

  if (closeMinutes > openMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
}

export function getBusinessStatusLabel(
  opening_time: string,
  closing_time: string
): string {
  return isBusinessOpen(opening_time, closing_time)
    ? `Abierto ahora (cierra ${closing_time})`
    : `Cerrado ahora (abre ${opening_time})`;
}
