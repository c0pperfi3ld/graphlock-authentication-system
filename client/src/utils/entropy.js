export function calculateGraphicalEntropy(imageWidth, imageHeight, numPoints, toleranceRadius) {
  const effectiveArea = imageWidth * imageHeight;
  const clickArea = Math.PI * toleranceRadius * toleranceRadius;
  const possibleRegions = Math.floor(effectiveArea / clickArea);
  const combinations = Math.pow(possibleRegions, numPoints);
  return Math.log2(combinations);
}

export function calculateTextEntropy(length, charsetSize) {
  return length * Math.log2(charsetSize);
}

export function formatEntropy(bits) {
  if (bits >= 128) return `${bits.toFixed(0)} bits (Extremely Strong)`;
  if (bits >= 80) return `${bits.toFixed(0)} bits (Very Strong)`;
  if (bits >= 60) return `${bits.toFixed(0)} bits (Strong)`;
  if (bits >= 40) return `${bits.toFixed(0)} bits (Moderate)`;
  return `${bits.toFixed(0)} bits (Weak)`;
}

export function getComparisonData() {
  return [
    { label: '4-digit PIN', entropy: calculateTextEntropy(4, 10), color: '#f43f5e' },
    { label: '8-char lowercase', entropy: calculateTextEntropy(8, 26), color: '#f59e0b' },
    { label: '8-char mixed case', entropy: calculateTextEntropy(8, 52), color: '#f59e0b' },
    { label: '8-char full (upper+lower+digit+symbol)', entropy: calculateTextEntropy(8, 95), color: '#10b981' },
    { label: 'Graphical 5-point (1024×768)', entropy: calculateGraphicalEntropy(1024, 768, 5, 18), color: '#00d4ff' },
    { label: 'Graphical 5-point Multi-Image (×3)', entropy: calculateGraphicalEntropy(1024, 768, 5, 18) * 3, color: '#7c3aed' },
  ];
}
