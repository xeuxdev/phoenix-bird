// Radial arc menu elements surrounding the phoenix
import { useMemo } from "react";

interface ArcItem {
  label: string;
  angle: number;   // degrees
  radius: number;
  tickCount: number;
  color: string;
}

const arcs: ArcItem[] = [
  { label: "LORE", angle: -60, radius: 290, tickCount: 12, color: "#00e5ff" },
  { label: "ABILITIES", angle: 130, radius: 260, tickCount: 10, color: "#ff9500" },
  { label: "SIGILS", angle: 200, radius: 310, tickCount: 8, color: "#00e5ff" },
];

function polarToCart(angle: number, radius: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return {
    x: Math.cos(rad) * radius,
    y: Math.sin(rad) * radius,
  };
}

export function RadialMenus() {
  const cx = 50; // percent
  const cy = 50;

  // Build SVG arc paths for partial arcs (60 degrees each)
  const arcPaths = useMemo(() =>
    arcs.map((a) => {
      const span = 55; // arc span in degrees
      const startAngle = a.angle - span / 2;
      const endAngle = a.angle + span / 2;
      const r = a.radius;

      const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
      const x1 = 500 + Math.cos(toRad(startAngle)) * r;
      const y1 = 300 + Math.sin(toRad(startAngle)) * r;
      const x2 = 500 + Math.cos(toRad(endAngle)) * r;
      const y2 = 300 + Math.sin(toRad(endAngle)) * r;

      // Tick positions
      const ticks = Array.from({ length: a.tickCount }, (_, i) => {
        const t = startAngle + (span / (a.tickCount - 1)) * i;
        const tr = toRad(t);
        const outer = r;
        const inner = r - (i % 3 === 0 ? 12 : 6);
        return {
          x1: 500 + Math.cos(tr) * inner,
          y1: 300 + Math.sin(tr) * inner,
          x2: 500 + Math.cos(tr) * outer,
          y2: 300 + Math.sin(tr) * outer,
        };
      });

      // Label pos (mid of arc, slightly outside)
      const midRad = toRad(a.angle);
      const labelR = r + 22;
      const lx = 500 + Math.cos(midRad) * labelR;
      const ly = 300 + Math.sin(midRad) * labelR;

      return { ...a, x1, y1, x2, y2, r, ticks, lx, ly, startAngle, endAngle, toRad };
    }),
  []);

  return (
    <svg
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: "1000px",
        height: "600px",
        pointerEvents: "none",
        zIndex: 8,
        overflow: "visible",
      }}
      viewBox="0 0 1000 600"
    >
      {arcPaths.map((a) => {
        const toRad = (deg: number) => (deg - 90) * (Math.PI / 180);
        const large = 0; // always < 180 span
        return (
          <g key={a.label}>
            {/* Main arc */}
            <path
              d={`M ${a.x1} ${a.y1} A ${a.r} ${a.r} 0 ${large} 1 ${a.x2} ${a.y2}`}
              fill="none"
              stroke={a.color}
              strokeWidth={1.5}
              opacity={0.5}
              strokeDasharray="6 4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="-100"
                dur="8s"
                repeatCount="indefinite"
              />
            </path>

            {/* Ticks */}
            {a.ticks.map((t, i) => (
              <line
                key={i}
                x1={t.x1} y1={t.y1}
                x2={t.x2} y2={t.y2}
                stroke={a.color}
                strokeWidth={i % 3 === 0 ? 1.5 : 0.8}
                opacity={i % 3 === 0 ? 0.8 : 0.4}
              />
            ))}

            {/* Label */}
            <text
              x={a.lx}
              y={a.ly}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={a.color}
              fontSize={10}
              fontFamily="Orbitron, monospace"
              letterSpacing={3}
              opacity={0.85}
              style={{ textShadow: `0 0 8px ${a.color}` }}
            >
              {a.label}
            </text>

            {/* End dots */}
            <circle cx={a.x1} cy={a.y1} r={3} fill={a.color} opacity={0.7} />
            <circle cx={a.x2} cy={a.y2} r={3} fill={a.color} opacity={0.7} />
          </g>
        );
      })}

      {/* Outer scanning ring */}
      <circle
        cx={500} cy={300}
        r={240}
        fill="none"
        stroke="rgba(0, 229, 255,0.08)"
        strokeWidth={1}
        strokeDasharray="2 8"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 500 300"
          to="360 500 300"
          dur="40s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Inner orbit ring */}
      <circle
        cx={500} cy={300}
        r={195}
        fill="none"
        stroke="rgba(255, 109, 0,0.07)"
        strokeWidth={0.8}
        strokeDasharray="4 10"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 500 300"
          to="0 500 300"
          dur="25s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
