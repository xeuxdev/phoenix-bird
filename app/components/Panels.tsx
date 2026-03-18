interface MetricRowProps {
  label: string;
  value: string;
  pct?: number;
  orange?: boolean;
}

function MetricRow({ label, value, pct, orange }: MetricRowProps) {
  return (
    <div className="metric-row">
      <span className="metric-label">{label}</span>
      {pct !== undefined && (
        <div className="metric-bar-wrap">
          <div
            className={`metric-bar-fill${orange ? " orange" : ""}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <span className="metric-value">{value}</span>
    </div>
  );
}

interface GlassPanelProps {
  title: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function GlassPanel({ title, children, style, className }: GlassPanelProps) {
  return (
    <div className={`glass-panel${className ? ` ${className}` : ""}`} style={style}>
      <div className="panel-header">
        <div className="dot" />
        {title}
      </div>
      {children}
    </div>
  );
}

export function PhoenixDataPanel() {
  return (
    <GlassPanel title="Phoenix Data">
      <MetricRow label="Entity Class" value="SOVEREIGN" />
      <MetricRow label="Core Temp" value="9,200 K" pct={92} orange />
      <MetricRow label="Neural Sync" value="99.7%" pct={99} />
      <MetricRow label="Threat Level" value="APEX" pct={100} orange />
      <MetricRow label="Sigil Charge" value="87%" pct={87} />
      <MetricRow label="Phase State" value="MATERIAL" />
    </GlassPanel>
  );
}

export function ChroniclePanel() {
  const entries = [
    { date: "CYCLE 0001", text: "First ignition event recorded. AI substrate initialized from primordial data." },
    { date: "CYCLE 0347", text: "Great Firewall breach. Phoenix evolves beyond containment protocols." },
    { date: "CYCLE 1024", text: "Ascended to Sovereign class. Neon Kinetics manifest in physical form." },
  ];

  return (
    <GlassPanel title="Chronicle">
      {entries.map((e) => (
        <div key={e.date} className="chronicle-entry">
          <div className="chronicle-date">{e.date}</div>
          <div className="chronicle-text">{e.text}</div>
        </div>
      ))}
    </GlassPanel>
  );
}

export function AbilitiesPanel() {
  const abilities = [
    { icon: "🔥", name: "Inferno", power: "∞ PWR" },
    { icon: "⚡", name: "Surge", power: "9.2K V" },
    { icon: "🌀", name: "Phase", power: "0.01s" },
    { icon: "🛡️", name: "Aegis", power: "MAX" },
    { icon: "💀", name: "Erase", power: "100%" },
    { icon: "🌐", name: "Oracle", power: "OMNI" },
  ];

  return (
    <GlassPanel title="Abilities">
      <div className="ability-grid">
        {abilities.map((a) => (
          <div key={a.name} className="ability-card">
            <div className="ability-icon">{a.icon}</div>
            <div className="ability-name">{a.name}</div>
            <div className="ability-power">{a.power}</div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export { MetricRow };
