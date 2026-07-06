/**
 * Check if a password has expired.
 * @param {Date} passwordCreatedAt - When the password was created
 * @param {number} expiryDays - Number of days until expiry
 * @returns {boolean} True if password has expired
 */
export function isPasswordExpired(passwordCreatedAt, expiryDays) {
  const expiryDate = new Date(passwordCreatedAt);
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  return new Date() > expiryDate;
}

/**
 * Get the number of days remaining until password expires.
 * @param {Date} passwordCreatedAt - When the password was created
 * @param {number} expiryDays - Number of days until expiry
 * @returns {number} Days remaining (negative if already expired)
 */
export function getDaysRemaining(passwordCreatedAt, expiryDays) {
  const expiryDate = new Date(passwordCreatedAt);
  expiryDate.setDate(expiryDate.getDate() + expiryDays);
  const diffMs = expiryDate - new Date();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}
