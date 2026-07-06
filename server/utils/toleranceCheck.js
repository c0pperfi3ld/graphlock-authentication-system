/**
 * Calculate Euclidean distance between two points (percentage coordinates 0-100).
 */
function euclideanDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Verify submitted click points against stored click points.
 * @param {Array<{x: number, y: number}>} submitted - Submitted click points (percentage 0-100)
 * @param {Array<{x: number, y: number}>} stored - Stored click points (percentage 0-100)
 * @param {number} toleranceRadius - Tolerance radius in pixel units (e.g., 18px on a 1000px image)
 *   Internally converted to percentage scale: toleranceRadius * (100/1000) = 1.8 for default 18
 * @returns {{ match: boolean, avgPrecision: number }}
 */
export function verifyClickPoints(submitted, stored, toleranceRadius) {
  // Both arrays must have the same length
  if (!submitted || !stored || submitted.length !== stored.length) {
    return { match: false, avgPrecision: Infinity };
  }

  // Convert pixel-based tolerance to percentage scale (0-100)
  const toleranceOnPercentScale = toleranceRadius;

  let totalDistance = 0;
  let allMatch = true;

  for (let i = 0; i < submitted.length; i++) {
    const distance = euclideanDistance(submitted[i], stored[i]);
    totalDistance += distance;

    if (distance > toleranceOnPercentScale) {
      allMatch = false;
    }
  }

  const avgPrecision = totalDistance / submitted.length;

  return { match: allMatch, avgPrecision };
}

/**
 * Calculate the average precision (Euclidean distance) across all point pairs.
 * @param {Array<{x: number, y: number}>} submitted
 * @param {Array<{x: number, y: number}>} stored
 * @returns {number} Average Euclidean distance
 */
export function calculatePrecision(submitted, stored) {
  if (!submitted || !stored || submitted.length !== stored.length || submitted.length === 0) {
    return Infinity;
  }

  let totalDistance = 0;
  for (let i = 0; i < submitted.length; i++) {
    totalDistance += euclideanDistance(submitted[i], stored[i]);
  }

  return totalDistance / submitted.length;
}
