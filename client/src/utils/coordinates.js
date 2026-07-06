export function getRelativeCoordinates(event, imageElement) {
  const rect = imageElement.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  return { x: Math.round(x * 100) / 100, y: Math.round(y * 100) / 100 };
}

export function euclideanDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function calculateSpread(points) {
  if (points.length < 2) return 0;
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const avgX = xs.reduce((a, b) => a + b, 0) / xs.length;
  const avgY = ys.reduce((a, b) => a + b, 0) / ys.length;
  const stdX = Math.sqrt(xs.reduce((s, x) => s + Math.pow(x - avgX, 2), 0) / xs.length);
  const stdY = Math.sqrt(ys.reduce((s, y) => s + Math.pow(y - avgY, 2), 0) / ys.length);
  return (stdX + stdY) / 2;
}

export function calculateStrengthScore(points) {
  if (points.length < 3) return { score: 0, label: 'Too Few Points', details: [] };
  const details = [];
  let score = 50;

  // Spread bonus
  const spread = calculateSpread(points);
  if (spread > 25) { score += 20; details.push('Great spatial distribution'); }
  else if (spread > 15) { score += 10; details.push('Moderate spread'); }
  else { score -= 15; details.push('Points are too clustered — spread them out'); }

  // Distance between consecutive points
  let totalDist = 0;
  for (let i = 1; i < points.length; i++) {
    totalDist += euclideanDistance(points[i - 1], points[i]);
  }
  const avgDist = totalDist / (points.length - 1);
  if (avgDist > 20) { score += 15; details.push('Good spacing between points'); }
  else if (avgDist < 10) { score -= 10; details.push('Consecutive points are too close'); }

  // Edge penalty
  const edgePoints = points.filter(p => p.x < 8 || p.x > 92 || p.y < 8 || p.y > 92);
  if (edgePoints.length > 1) { score -= 10; details.push('Avoid placing points near edges'); }

  // Number of points bonus
  if (points.length >= 5) { score += 10; details.push(`${points.length} click-points add strong security`); }

  score = Math.max(0, Math.min(100, score));
  const label = score >= 70 ? 'Strong' : score >= 40 ? 'Medium' : 'Weak';
  return { score, label, details };
}
