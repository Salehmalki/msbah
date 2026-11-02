/**
 * Format numbers with optional Arabic-Indic numerals (٠، ١، ٢...)
 */
export function formatNumber(num: number, useArabic: boolean = true): string {
  if (!useArabic) {
    return num.toLocaleString('en-US');
  }

  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toLocaleString('en-US')
    .replace(/\d/g, (d) => arabicDigits[parseInt(d, 10)]);
}

/**
 * Get current date string in YYYY-MM-DD
 */
export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display in Arabic
 */
export function formatArabicDate(dateStr: string): string {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return new Intl.DateTimeFormat('ar-SA', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateStr;
  }
}
