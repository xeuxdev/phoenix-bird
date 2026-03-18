import { useMemo } from "react";

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  dur: number;
  delay: number;
  minOp: number;
  maxOp: number;
}

export function Stars() {
  const stars = useMemo<StarData[]>(() => {
    return Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      dur: Math.random() * 3 + 2,
      delay: Math.random() * 4,
      minOp: Math.random() * 0.2 + 0.1,
      maxOp: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  return (
    <div className="stars-container">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
            "--min-op": s.minOp,
            "--max-op": s.maxOp,
          } as React.CSSProperties}
        />
      ))}
      {/* Nebula clouds */}
      <div style={{
        position: "absolute",
        width: "500px", height: "300px",
        background: "radial-gradient(ellipse, rgba(0,100,160,0.12) 0%, transparent 70%)",
        top: "10%", left: "5%",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute",
        width: "400px", height: "250px",
        background: "radial-gradient(ellipse, rgba(120,0,80,0.08) 0%, transparent 70%)",
        top: "50%", right: "8%",
        borderRadius: "50%",
      }} />
      <div style={{
        position: "absolute",
        width: "600px", height: "200px",
        background: "radial-gradient(ellipse, rgba(0,60,120,0.1) 0%, transparent 70%)",
        bottom: "15%", left: "30%",
        borderRadius: "50%",
      }} />
    </div>
  );
}
