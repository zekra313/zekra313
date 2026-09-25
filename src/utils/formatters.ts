/**
 * Formats a number to Iraqi Dinar (IQD) string
 * Example: 15000 -> "15,000 د.ع"
 */
export const formatIQD = (amount: number): string => {
  return `${amount.toLocaleString('ar-IQ')} د.ع`;
};

/**
 * Standard date formatting for Iraq / Arabic locale
 */
export const formatArabicDate = (isoString: string): string => {
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('ar-IQ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
};
