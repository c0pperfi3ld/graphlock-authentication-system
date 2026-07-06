/**
 * Calculate Euclidean distance between two points on 0-100 percentage scale.
 */
function euclideanDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

/**
 * Analyze hotspots in user click points against all historical click data.
 * @param {Array<{x: number, y: number}>} userClickPoints - User's chosen click points
 * @param {Array<{x: number, y: number}>} allClickData - All historical click points from all users
 * @returns {{ isWeak: boolean, hotspots: Array<{x: number, y: number, density: number}>, warnings: string[] }}
 */
export function analyzeHotspots(userClickPoints, allClickData) {
  const HOTSPOT_RADIUS = 5; // on 0-100 scale
  const DENSITY_THRESHOLD = 10;
  const hotspots = [];
  const warnings = [];
  let isWeak = false;

  for (const point of userClickPoints) {
    let density = 0;

    for (const dataPoint of allClickData) {
      const distance = euclideanDistance(point, dataPoint);
      if (distance <= HOTSPOT_RADIUS) {
        density++;
      }
    }

    if (density > DENSITY_THRESHOLD) {
      hotspots.push({ x: point.x, y: point.y, density });
      warnings.push(
        `Point (${point.x.toFixed(1)}, ${point.y.toFixed(1)}) is in a hotspot area with ${density} nearby clicks`
      );
      isWeak = true;
    }
  }

  return { isWeak, hotspots, warnings };
}

/**
 * Calculate the strength of a graphical password based on click point distribution.
 * @param {Array<{x: number, y: number}>} clickPoints - User's click points (percentage 0-100)
 * @returns {{ score: number, label: 'Weak' | 'Medium' | 'Strong', details: string[] }}
 */
export function calculatePasswordStrength(clickPoints) {
  if (!clickPoints || clickPoints.length < 2) {
    return { score: 0, label: 'Weak', details: ['Too few click points'] };
  }

  const details = [];
  let score = 0;

  // 1. Average distance between consecutive points (max 40 points)
  let totalConsecutiveDistance = 0;
  for (let i = 1; i < clickPoints.length; i++) {
    totalConsecutiveDistance += euclideanDistance(clickPoints[i - 1], clickPoints[i]);
  }
  const avgConsecutiveDistance = totalConsecutiveDistance / (clickPoints.length - 1);
  // Max possible distance on 0-100 scale is ~141.4 (diagonal)
  const distanceScore = Math.min(40, (avgConsecutiveDistance / 50) * 40);
  score += distanceScore;
  details.push(`Average consecutive distance: ${avgConsecutiveDistance.toFixed(1)} (score: ${distanceScore.toFixed(0)}/40)`);

  // 2. Spread - standard deviation of x and y coordinates (max 35 points)
  const xCoords = clickPoints.map((p) => p.x);
  const yCoords = clickPoints.map((p) => p.y);

  const stdDev = (arr) => {
    const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
    const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length;
    return Math.sqrt(variance);
  };

  const xStdDev = stdDev(xCoords);
  const yStdDev = stdDev(yCoords);
  const avgSpread = (xStdDev + yStdDev) / 2;
  // Max stddev on 0-100 scale is 50
  const spreadScore = Math.min(35, (avgSpread / 25) * 35);
  score += spreadScore;
  details.push(`Spread (stddev): X=${xStdDev.toFixed(1)}, Y=${yStdDev.toFixed(1)} (score: ${spreadScore.toFixed(0)}/35)`);

  // 3. Edge proximity - points near edges are better (max 25 points)
  let edgeProximityTotal = 0;
  for (const point of clickPoints) {
    // Distance to nearest edge (0=at edge, 50=center)
    const distToEdge = Math.min(point.x, 100 - point.x, point.y, 100 - point.y);
    // Closer to edge = more variety = higher score
    edgeProximityTotal += (50 - distToEdge) / 50;
  }
  const avgEdgeProximity = edgeProximityTotal / clickPoints.length;
  const edgeScore = Math.min(25, avgEdgeProximity * 25);
  score += edgeScore;
  details.push(`Edge utilization: ${(avgEdgeProximity * 100).toFixed(0)}% (score: ${edgeScore.toFixed(0)}/25)`);

  // Clamp final score
  score = Math.max(0, Math.min(100, Math.round(score)));

  let label;
  if (score < 30) {
    label = 'Weak';
  } else if (score <= 70) {
    label = 'Medium';
  } else {
    label = 'Strong';
  }

  return { score, label, details };
}
