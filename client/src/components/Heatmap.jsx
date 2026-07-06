import { useRef, useEffect, useState } from 'react';

export default function Heatmap({ clickData, imageSrc }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    if (!showHeatmap || !clickData?.length || !canvasRef.current || !imgRef.current) return;
    const canvas = canvasRef.current;
    const img = imgRef.current;
    canvas.width = img.clientWidth;
    canvas.height = img.clientHeight;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw heat points
    clickData.forEach(({ x, y }) => {
      const px = (x / 100) * canvas.width;
      const py = (y / 100) * canvas.height;
      const gradient = ctx.createRadialGradient(px, py, 0, px, py, 30);
      gradient.addColorStop(0, 'rgba(255, 0, 0, 0.35)');
      gradient.addColorStop(0.4, 'rgba(255, 165, 0, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(px, py, 30, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [clickData, showHeatmap]);

  if (!imageSrc) return null;

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <button className="btn btn-secondary btn-sm" onClick={() => setShowHeatmap(!showHeatmap)}>
          {showHeatmap ? '🔥 Hide Heatmap' : '🔥 Show Heatmap'}
        </button>
        <span style={{ marginLeft: 12, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {clickData?.length || 0} click points recorded
        </span>
      </div>
      <div className="heatmap-container">
        <img ref={imgRef} src={imageSrc} alt="Heatmap" draggable={false} onLoad={() => setShowHeatmap(true)} />
        {showHeatmap && <canvas ref={canvasRef} className="heatmap-canvas" />}
      </div>
    </div>
  );
}
