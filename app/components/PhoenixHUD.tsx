import { useState, useRef, useCallback, Suspense } from "react";
import { Stars } from "../components/Stars";
import { CursorTrail } from "../components/CursorTrail";
import {
  PhoenixDataPanel,
  ChroniclePanel,
  AbilitiesPanel,
} from "../components/Panels";
import { BodyLabels } from "../components/BodyLabels";
import { RadialMenus } from "../components/RadialMenus";
import { ControlPanel } from "../components/ControlPanel";
import { PhoenixCanvas } from "./PhoenixCanvas";
import type { PhoenixViewerHandle } from "./PhoenixCanvas";

function LoadingFallback() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "2px solid rgba(0, 229, 255,0.15)",
          borderTop: "2px solid #00e5ff",
          borderRadius: "50%",
          animation: "arc-spin 0.9s linear infinite",
        }}
      />
      <div
        style={{
          fontFamily: "Orbitron, monospace",
          fontSize: "0.55rem",
          letterSpacing: "0.25em",
          color: "rgba(0, 229, 255,0.6)",
          textTransform: "uppercase",
        }}
      >
        Loading Entity…
      </div>
    </div>
  );
}

export function PhoenixHUD() {
  const viewerRef = useRef<PhoenixViewerHandle | null>(null);
  const [availableClips, setAvailableClips] = useState<string[]>([]);
  const [clipDuration, setClipDuration] = useState(3.33);

  // From control panel
  const [staticPose, setStaticPose] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedVal, setSpeedVal] = useState(1);
  const [currentClip, setCurrentClip] = useState("");

  const handleClipsReady = useCallback((names: string[]) => {
    setAvailableClips(names);
    if (names.length > 0) setCurrentClip(names[0]);
  }, []);

  const handleStateChange = useCallback(
    (state: {
      staticPose: boolean;
      isPlaying: boolean;
      speed: number;
      currentClip: string;
    }) => {
      setStaticPose(state.staticPose);
      setIsPlaying(state.isPlaying);
      setSpeedVal(state.speed);
      setCurrentClip(state.currentClip);
    },
    [],
  );

  return (
    <>
      <CursorTrail />

      <div className="hud-viewport">
        {/* Background */}
        <Stars />

        {/* Holographic atmosphere */}
        <div className="holo-flash" />

        {/* Scanlines overlay */}
        <div className="scanlines" />

        {/* Corner brackets */}
        <div className="corner-bracket tl" />
        <div className="corner-bracket tr" />
        <div className="corner-bracket bl" />
        <div className="corner-bracket br" />

        {/* ── Top Status Bar ─────────────────────────────── */}
        <div className="status-bar">
          <span className="status-title glitch">DIGITAL GRIMOIRE</span>
          <div className="status-divider" />
          <span className="status-badge">
            <span className="online" />
            ENTITY ONLINE
          </span>
          <div className="status-divider" />
          <span className="status-badge">SOVEREIGN CLASS</span>
          <div className="status-divider" />
          <span
            className="status-badge"
            style={{
              color: "rgba(255, 149, 0,0.7)",
              fontFamily: "Orbitron, monospace",
              fontSize: "0.55rem",
            }}
          >
            THREAT: APEX
          </span>
        </div>

        {/* ── Left Panels ────────────────────────────────── */}
        <div className="left-panel-group">
          <PhoenixDataPanel />
          <ChroniclePanel />
        </div>

        {/* ── Center — 3D Viewer ─────────────────────────── */}
        <div className="phoenix-container" style={{ width: "800px", height: "800px" }}>
          <RadialMenus />

          {/* Three.js canvas viewport */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "100vw",
              height: "100vh",
              zIndex: 10,
            }}
          >
            <Suspense fallback={<LoadingFallback />}>
              <PhoenixCanvas
                viewerRef={viewerRef}
                onReady={handleClipsReady}
                staticPose={staticPose}
                speed={speedVal}
                isPlaying={isPlaying}
                currentClip={currentClip}
              />
            </Suspense>
          </div>

          {/* Ground glow ring */}
          <div className="phoenix-glow-ring" />

          {/* Body annotation labels */}
          <BodyLabels />
        </div>

        {/* ── Right Panels ───────────────────────────────── */}
        <div className="right-panel-group">
          <AbilitiesPanel />
          {/* Sigil Matrix */}
          <div className="glass-panel">
            <div className="panel-header">
              <div className="dot" />
              SIGIL MATRIX
            </div>
            <div style={{ padding: "10px 14px" }}>
              {["PYROCLASTIC", "VOID WALK", "TEMPORAL", "OMNISCIENT"].map(
                (s, i) => (
                  <div
                    key={s}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "7px",
                    }}
                  >
                    <div
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "4px",
                        background:
                          i % 2 === 0
                            ? "rgba(255, 109, 0,0.15)"
                            : "rgba(0, 229, 255,0.1)",
                        border: `1px solid ${i % 2 === 0 ? "rgba(255, 109, 0,0.4)" : "rgba(0, 229, 255,0.3)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.65rem",
                      }}
                    >
                      {["⬡", "⬢", "◈", "⬟"][i]}
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "Orbitron, monospace",
                          fontSize: "0.5rem",
                          letterSpacing: "0.12em",
                          color: i % 2 === 0 ? "#ff9500" : "#00e5ff",
                        }}
                      >
                        {s}
                      </div>
                      <div
                        style={{
                          fontFamily: "Rajdhani",
                          fontSize: "0.6rem",
                          color: "rgba(0, 229, 255,0.5)",
                        }}
                      >
                        ACTIVE • LEVEL {9 - i}
                      </div>
                    </div>
                    <div
                      style={{
                        marginLeft: "auto",
                        fontFamily: "Orbitron, monospace",
                        fontSize: "0.55rem",
                        color: i % 2 === 0 ? "#ff9500" : "#00e5ff",
                      }}
                    >
                      {["MAX", "87%", "93%", "100%"][i]}
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* ── Control Panel (bottom-left) ─────────────────── */}
        <ControlPanel
          viewerRef={viewerRef}
          availableClips={availableClips}
          clipDuration={clipDuration}
          onStateChange={handleStateChange}
        />

        {/* ── Bottom-right info ───────────────────────────── */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            right: 28,
            zIndex: 20,
            textAlign: "right",
          }}
        >
          <div
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              color: "rgba(0, 229, 255,0.35)",
              marginBottom: "4px",
            }}
          >
            COORD SYS: CELESTIAL
          </div>
          <div
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              color: "rgba(0, 229, 255,0.5)",
            }}
          >
            RA 18h 29m 14.4s
          </div>
          <div
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "0.55rem",
              letterSpacing: "0.1em",
              color: "rgba(0, 229, 255,0.5)",
            }}
          >
            DEC +17° 57' 06"
          </div>
          <div
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              color: "rgba(255, 149, 0,0.4)",
              marginTop: "6px",
            }}
          >
            RENDER: WEBGL 2.0
          </div>
          <div
            style={{
              fontFamily: "Orbitron, monospace",
              fontSize: "0.5rem",
              letterSpacing: "0.2em",
              color: "rgba(255, 149, 0,0.4)",
            }}
          >
            POLY: THREE.JS
          </div>
        </div>

        {/* ── Side data streams ──────────────────────────── */}
        <div
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            opacity: 0.35,
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "0.4rem",
                color: "#00e5ff",
                letterSpacing: "0.05em",
                animation: `star-twinkle ${1 + i * 0.1}s ease-in-out infinite`,
              }}
            >
              {(i * 1337 + 0xabcd).toString(16).slice(-4).toUpperCase()}
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 6,
            display: "flex",
            flexDirection: "column",
            gap: "3px",
            opacity: 0.35,
          }}
        >
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              style={{
                fontFamily: "Orbitron, monospace",
                fontSize: "0.4rem",
                color: "#ff9500",
                letterSpacing: "0.05em",
                animation: `star-twinkle ${1.5 + i * 0.1}s ease-in-out infinite`,
              }}
            >
              {(0xff & (i * 17 + 0xab))
                .toString(16)
                .padStart(2, "0")
                .toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
