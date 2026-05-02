import { normalizeSearchText } from "@/lib/utils";
import type { Product, Promotion } from "@/types";

const WEEK_DAYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const WEEK_DAY_LABELS: Record<(typeof WEEK_DAYS)[number], string> = {
  sunday: "domingo",
  monday: "lunes",
  tuesday: "martes",
  wednesday: "miércoles",
  thursday: "jueves",
  friday: "viernes",
  saturday: "sábado",
};

function getCurrentWeekDay(now: Date): (typeof WEEK_DAYS)[number] {
  return WEEK_DAYS[now.getDay()] ?? "monday";
}

function parseTimeToMinutes(value?: string | null): number | null {
  if (!value) {
    return null;
  }

  const match = value.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!match) {
    return null;
  }

  const hours = Number.parseInt(match[1] ?? "", 10);
  const minutes = Number.parseInt(match[2] ?? "", 10);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return null;
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

function hasSchedule(promotion: Promotion): boolean {
  const hasDays = Boolean(promotion.active_days && promotion.active_days.length > 0);
  return hasDays || Boolean(promotion.start_time) || Boolean(promotion.end_time);
}

function isInTimeRange(current: number, start: number, end: number): boolean {
  if (start === end) {
    return true;
  }

  if (start < end) {
    return current >= start && current <= end;
  }

  return current >= start || current <= end;
}

function normalizeDays(days?: string[] | null): Set<string> {
  if (!days || days.length === 0) {
    return new Set<string>();
  }

  return new Set(days.map((day) => day.trim().toLowerCase()).filter(Boolean));
}

function normalizeKey(text: string): string {
  return normalizeSearchText(text).replace(/\s+/g, " ").trim();
}

export function isPromotionAvailableNow(promotion: Promotion, now = new Date()): boolean {
  if (!promotion.is_active) {
    return false;
  }

  const daySet = normalizeDays(promotion.active_days);
  if (daySet.size > 0) {
    const currentDay = getCurrentWeekDay(now);
    if (!daySet.has(currentDay)) {
      return false;
    }
  }

  const start = parseTimeToMinutes(promotion.start_time);
  const end = parseTimeToMinutes(promotion.end_time);
  if (start === null && end === null) {
    return true;
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  if (start !== null && end !== null) {
    return isInTimeRange(currentMinutes, start, end);
  }

  if (start !== null) {
    return currentMinutes >= start;
  }

  return currentMinutes <= (end ?? currentMinutes);
}

export function getHomePromotions(promotions: Promotion[], now = new Date()): Promotion[] {
  const active = promotions.filter((promotion) => promotion.is_active);

  if (active.length === 0) {
    return [];
  }

  const current = active.filter((promotion) => isPromotionAvailableNow(promotion, now));
  if (current.length > 0) {
    return current;
  }

  const general = active.filter((promotion) => !hasSchedule(promotion));
  if (general.length > 0) {
    return general;
  }

  return active;
}

export function getPromotionTargetProduct(
  promotion: Promotion,
  products: Product[]
): Product | null {
  if (products.length === 0) {
    return null;
  }

  if (promotion.product_slug) {
    const bySlug = products.find((product) => product.slug === promotion.product_slug);
    if (bySlug) {
      return bySlug;
    }
  }

  if (promotion.product_id) {
    const byId = products.find((product) => product.id === promotion.product_id);
    if (byId) {
      return byId;
    }
  }

  const normalizedTitle = normalizeKey(promotion.title);
  const byTitle = products.find((product) =>
    normalizedTitle.includes(normalizeKey(product.name))
  );
  if (byTitle) {
    return byTitle;
  }

  if (promotion.image_url) {
    const byImage = products.find((product) => product.image_url === promotion.image_url);
    if (byImage) {
      return byImage;
    }
  }

  if (normalizedTitle.includes("martes smash")) {
    const classicSmash = products.find((product) => product.slug === "la-clasica-smash");
    if (classicSmash) {
      return classicSmash;
    }
  }

  if (normalizedTitle.includes("combo")) {
    const combo = products.find((product) => product.slug === "combo-smash-classic");
    if (combo) {
      return combo;
    }
  }

  return null;
}

export function getPromotionScheduleLabel(promotion: Promotion, now = new Date()): string {
  const daySet = normalizeDays(promotion.active_days);
  const start = promotion.start_time?.trim();
  const end = promotion.end_time?.trim();

  if (daySet.size === 0 && !start && !end) {
    return "Disponible hoy";
  }

  if (daySet.size > 0) {
    const currentDay = getCurrentWeekDay(now);
    if (daySet.has(currentDay)) {
      if (start && end) {
        return `Hoy ${start} - ${end}`;
      }
      return "Disponible hoy";
    }

    if (daySet.size === 1) {
      const [singleDay] = Array.from(daySet);
      const label = WEEK_DAY_LABELS[singleDay as keyof typeof WEEK_DAY_LABELS];
      if (label && start && end) {
        return `${label} ${start} - ${end}`;
      }
      if (label) {
        return `Solo ${label}`;
      }
    }

    return "Promoción por días";
  }

  if (start && end) {
    return `Disponible ${start} - ${end}`;
  }

  return "Disponible hoy";
}
