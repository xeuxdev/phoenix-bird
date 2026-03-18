import { useState, useRef, useEffect, useCallback } from "react";
import type { PhoenixViewerHandle } from "./PhoenixCanvas";

const SPEEDS = ["x0.1", "x0.5", "x1", "x2"] as const;
const SPEED_VALUES: Record<string, number> = { "x0.1": 0.1, "x0.5": 0.5, "x1": 1, "x2": 2 };

export interface ControlPanelState {
  staticPose: boolean;
  isPlaying: boolean;
  speed: number;
  currentClip: string;
}

interface ControlPanelProps {
  viewerRef: React.MutableRefObject<PhoenixViewerHandle | null>;
  availableClips: string[];
  clipDuration: number;
  onStateChange?: (state: ControlPanelState) => void;
}

export function ControlPanel({ viewerRef, availableClips, clipDuration, onStateChange }: ControlPanelProps) {
  const [staticPose, setStaticPose] = useState(false);
  const [selectedClip, setSelectedClip] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [speed, setSpeed] = useState<string>("x1");
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [timeStr, setTimeStr] = useState("0:00.0");
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  // When clips arrive, select first one
  useEffect(() => {
    if (availableClips.length > 0 && !selectedClip) {
      setSelectedClip(availableClips[0]);
    }
  }, [availableClips, selectedClip]);

  // Sync state upward
  useEffect(() => {
    onStateChange?.({
      staticPose,
      isPlaying: playing,
      speed: SPEED_VALUES[speed],
      currentClip: selectedClip,
    });
  }, [staticPose, playing, speed, selectedClip, onStateChange]);

  // Progress tracker RAF
  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    if (staticPose || !playing || clipDuration === 0) return;

    const tick = (now: number) => {
      if (!lastRef.current) lastRef.current = now;
      // We drive display from Three.js mixer time via viewer
      const action = (viewerRef.current as unknown as { _currentAction?: { time: number } })?._currentAction;
      const dur = clipDuration || 3.33;
      // Poll mixer time from the model via the handle — we approximate here
      setProgress((p) => {
        const dt = (now - lastRef.current) / 1000;
        lastRef.current = now;
        const speedMult = SPEED_VALUES[speed] ?? 1;
        const next = (p + (dt * speedMult * 100) / dur) % 100;
        const secTotal = (next / 100) * dur;
        const m = Math.floor(secTotal / 60);
        const s = (secTotal % 60).toFixed(1).padStart(4, "0");
        setTimeStr(`${m}:${s}`);
        return next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, staticPose, speed, clipDuration, viewerRef]);

  const handleTimelineClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    setProgress(pct);
    viewerRef.current?.setProgress(pct);
    const secTotal = (pct / 100) * clipDuration;
    const m = Math.floor(secTotal / 60);
    const s = (secTotal % 60).toFixed(1).padStart(4, "0");
    setTimeStr(`${m}:${s}`);
  }, [clipDuration, viewerRef]);

  const handleRewind = useCallback(() => {
    setProgress(0);
    setTimeStr("0:00.0");
    viewerRef.current?.setProgress(0);
  }, [viewerRef]);

  const displayClips = availableClips.length > 0 ? availableClips : ["Loading…"];

  return (
    <div className="control-panel">
      <div className="glass-panel" style={{ borderRadius: "10px" }}>
        {/* Header */}
        <div className="panel-header">
          <div className="dot" />
          ANIMATION CONTROL
          <span style={{ marginLeft: "auto", fontFamily: "Rajdhani", fontSize: "0.6rem", color: "rgba(0, 229, 255,0.4)", letterSpacing: "0.05em", fontWeight: 400 }}>
            GLTF • RIGGED
          </span>
        </div>

        <div className="control-section">
          {/* Static Pose Toggle */}
          <div className="control-title">Pose Mode</div>
          <div className="pose-row">
            <div
              className={`toggle-switch${staticPose ? " active" : ""}`}
              onClick={() => setStaticPose((s) => !s)}
              role="switch"
              aria-checked={staticPose}
              id="static-pose-toggle"
            >
              <div className="toggle-knob" />
            </div>
            <span className="pose-label">Static Pose {staticPose ? "ON" : "OFF"}</span>
          </div>

          {/* Animation Clip Dropdown */}
          <div className="control-title">Animation Clip</div>
          <div
            className="dropdown-control"
            onClick={() => !staticPose && setDropdownOpen((o) => !o)}
            id="animation-dropdown"
            style={{ opacity: staticPose ? 0.4 : 1, position: "relative" }}
          >
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "200px" }}>
              {selectedClip || "—"}
            </span>
            <span className="arrow">{dropdownOpen ? "▲" : "▼"}</span>
          </div>

          {dropdownOpen && !staticPose && (
            <div style={{
              background: "rgba(2, 18, 32, 0.97)",
              border: "1px solid rgba(0, 229, 255,0.25)",
              borderRadius: "6px",
              zIndex: 50,
              overflow: "hidden",
              backdropFilter: "blur(12px)",
              marginBottom: "4px",
              maxHeight: "140px",
              overflowY: "auto",
            }}>
              {displayClips.map((a) => (
                <div
                  key={a}
                  onClick={() => {
                    setSelectedClip(a);
                    setDropdownOpen(false);
                    setProgress(0);
                  }}
                  style={{
                    padding: "7px 12px",
                    fontFamily: "Rajdhani",
                    fontSize: "0.7rem",
                    color: a === selectedClip ? "#00e5ff" : "rgba(0, 229, 255,0.55)",
                    cursor: "pointer",
                    background: a === selectedClip ? "rgba(0, 229, 255,0.08)" : "transparent",
                    borderBottom: "1px solid rgba(0, 229, 255,0.08)",
                    letterSpacing: "0.08em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {a}
                </div>
              ))}
            </div>
          )}

          {/* Timeline */}
          <div className="control-title" style={{ marginTop: "8px" }}>Timeline</div>
          <div
            className="timeline-bar"
            onClick={handleTimelineClick}
            id="timeline-bar"
            style={{ opacity: staticPose ? 0.3 : 1, cursor: "pointer" }}
          >
            <div className="timeline-progress" style={{ width: `${progress}%` }} />
            <div className="timeline-thumb" style={{ left: `${progress}%` }} />
          </div>

          {/* Playback Controls */}
          <div className="playback-controls" style={{ opacity: staticPose ? 0.3 : 1 }}>
            <button className="play-btn" onClick={handleRewind} id="rewind-btn" title="Rewind">⏮</button>
            <button
              className="play-btn main"
              onClick={() => setPlaying((p) => !p)}
              id="play-pause-btn"
              title={playing ? "Pause" : "Play"}
            >
              {playing ? "⏸" : "▶"}
            </button>
            <button className="play-btn" id="step-btn" title="Step">⏭</button>
            <span className="time-display">{timeStr}</span>
          </div>

          {/* Speed Buttons */}
          <div className="control-title">Playback Speed</div>
          <div className="speed-row">
            {SPEEDS.map((s) => (
              <button
                key={s}
                className={`speed-btn${speed === s ? " active" : ""}`}
                onClick={() => setSpeed(s)}
                id={`speed-${s.replace(".", "")}`}
                style={{ opacity: staticPose ? 0.3 : 1 }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
