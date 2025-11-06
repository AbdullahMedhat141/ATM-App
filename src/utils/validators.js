/**
 * Validates if a value is a positive number
 * @param {string|number} value - The value to validate
 * @returns {boolean} True if valid positive number
 */
export function isValidPositiveNumber(value) {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validates if a value is a valid amount (positive number with max 2 decimals)
 * @param {string|number} value - The value to validate
 * @returns {boolean} True if valid amount
 */
export function isValidAmount(value) {
  if (!isValidPositiveNumber(value)) {
    return false;
  }
  const num = parseFloat(value);
  const decimals = value.toString().split('.')[1];
  return decimals ? decimals.length <= 2 : true;
}

/**
 * Validates if withdrawal amount is within available balance
 * @param {number} amount - The withdrawal amount
 * @param {number} balance - The current balance
 * @returns {boolean} True if amount is valid for withdrawal
 */
export function isValidWithdrawal(amount, balance) {
  return isValidPositiveNumber(amount) && parseFloat(amount) <= balance;
}

