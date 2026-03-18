// Body annotation labels that appear over the phoenix image with connector lines
interface BodyLabel {
  id: string;
  title: string;
  sub: string;
  // Percentage positions relative to the phoenix container (500x500 inner space)
  labelX: number;  // left offset in px from container left
  labelY: number;  // top offset in px from container top
  dotX: number;    // dot on bird body (%) of container
  dotY: number;
}

const labels: BodyLabel[] = [
  {
    id: "head",
    title: "CYBERNETIC CHRONICLE",
    sub: "ANCIENT AI",
    labelX: 60,
    labelY: 30,
    dotX: 250,
    dotY: 100,
  },
  {
    id: "wings",
    title: "PHYSIQUE",
    sub: "NEON KINETICS",
    labelX: 340,
    labelY: 120,
    dotX: 360,
    dotY: 200,
  },
  {
    id: "tail",
    title: "ESSENCE",
    sub: "ALCHEMICAL FIRE",
    labelX: 120,
    labelY: 340,
    dotX: 240,
    dotY: 380,
  },
];

const W = 460;
const H = 460;

export function BodyLabels() {
  return (
    <div
      style={{
        position: "absolute",
        width: `${W}px`,
        height: `${H}px`,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 12,
      }}
    >
      <svg
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
      >
        {labels.map((l) => {
          // Label box center
          const lbx = l.labelX + 60; // approx box half-width
          const lby = l.labelY + 16; // approx box half-height
          return (
            <g key={l.id}>
              {/* Connector line */}
              <line
                x1={lbx}
                y1={lby}
                x2={l.dotX}
                y2={l.dotY}
                stroke="#00e5ff"
                strokeWidth={1}
                strokeDasharray="5 3"
                opacity={0.6}
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="-28"
                  dur="2.5s"
                  repeatCount="indefinite"
                />
              </line>
              {/* Dot on body */}
              <circle cx={l.dotX} cy={l.dotY} r={3} fill="#00e5ff" opacity={0.9}>
                <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />
              </circle>
              {/* Outer ring pulse */}
              <circle cx={l.dotX} cy={l.dotY} r={8} fill="none" stroke="#00e5ff" strokeWidth={0.8} opacity={0.3}>
                <animate attributeName="r" values="6;14;6" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}
      </svg>

      {/* HTML Label Boxes */}
      {labels.map((l) => (
        <div
          key={l.id}
          className="body-label-box"
          style={{ left: l.labelX, top: l.labelY }}
        >
          <div className="body-label-title">{l.title}</div>
          <div className="body-label-sub">{l.sub}</div>
        </div>
      ))}
    </div>
  );
}
