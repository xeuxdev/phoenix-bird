import type { Route } from "./+types/home";
import { PhoenixHUD } from "../components/PhoenixHUD";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Digital Grimoire — Cyber Phoenix Viewer" },
    { name: "description", content: "Futuristic holographic WebGL 3D asset viewer for the Cyber Phoenix entity. Digital Grimoire HUD interface." },
  ];
}

export default function Home() {
  return <PhoenixHUD />;
}
