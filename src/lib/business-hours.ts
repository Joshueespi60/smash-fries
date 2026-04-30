import type { BusinessHours, BusinessStatus, DaySchedule } from "@/types";

const dayNames = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

function toMinutes(hourText: string): number {
  const [hours, minutes] = hourText.split(":").map(Number);
  return hours * 60 + minutes;
}

function isScheduleOpen(schedule: DaySchedule, nowMinutes: number): boolean {
  if (schedule.isClosed) {
    return false;
  }
  const open = toMinutes(schedule.open);
  const close = toMinutes(schedule.close);
  return nowMinutes >= open && nowMinutes < close;
}

function findNextOpening(
  hours: BusinessHours,
  currentDay: number,
  nowMinutes: number
): { day: number; time: string } | null {
  for (let offset = 0; offset < 7; offset += 1) {
    const day = (currentDay + offset) % 7;
    const schedule = hours[day];
    if (!schedule || schedule.isClosed) {
      continue;
    }

    const openTime = toMinutes(schedule.open);
    if (offset === 0 && openTime <= nowMinutes) {
      continue;
    }

    return { day, time: schedule.open };
  }

  return null;
}

export function getBusinessStatus(
  hours: BusinessHours,
  currentDate = new Date()
): BusinessStatus {
  const day = currentDate.getDay();
  const schedule = hours[day];
  const nowMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();

  if (!schedule || schedule.isClosed) {
    const nextOpen = findNextOpening(hours, day, nowMinutes);
    if (nextOpen) {
      return {
        isOpen: false,
        label: `Cerrado ahora. Abre el ${dayNames[nextOpen.day]} a las ${nextOpen.time}.`,
      };
    }

    return {
      isOpen: false,
      label: "Cerrado. No hay horarios configurados.",
    };
  }

  if (isScheduleOpen(schedule, nowMinutes)) {
    return {
      isOpen: true,
      label: `Abierto ahora hasta las ${schedule.close}.`,
    };
  }

  const nextOpen = findNextOpening(hours, day, nowMinutes);
  if (nextOpen) {
    return {
      isOpen: false,
      label: `Cerrado ahora. Abre el ${dayNames[nextOpen.day]} a las ${nextOpen.time}.`,
    };
  }

  return {
    isOpen: false,
    label: "Cerrado por el momento.",
  };
}
