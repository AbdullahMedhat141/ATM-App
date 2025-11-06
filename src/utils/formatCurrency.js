/**
 * Formats a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: 'ILS')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'ILS') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

