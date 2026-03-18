import { useEffect, useRef, useCallback } from "react";

interface Ember {
  id: number;
  x: number;
  y: number;
  color: string;
  el: HTMLDivElement;
}

export function CursorTrail() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const embersRef = useRef<Ember[]>([]);
  const counterRef = useRef(0);
  const pos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animRef = useRef<number>(0);

  const spawnEmber = useCallback((x: number, y: number) => {
    const el = document.createElement("div");
    el.className = "ember";
    const colors = ["#ff9500", "#ff6d00", "#ff3d00", "#ffcc00", "#00e5ff"];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const spread = (Math.random() - 0.5) * 20;
    el.style.cssText = `
      left: ${x + spread}px;
      top: ${y + spread}px;
      background: ${color};
      box-shadow: 0 0 4px ${color};
      width: ${Math.random() * 3 + 2}px;
      height: ${Math.random() * 3 + 2}px;
    `;
    document.body.appendChild(el);
    const ember: Ember = { id: counterRef.current++, x, y, color, el };
    embersRef.current.push(ember);
    setTimeout(() => {
      el.remove();
      embersRef.current = embersRef.current.filter((e) => e.id !== ember.id);
    }, 600);
  }, []);

  useEffect(() => {
    let lastEmber = 0;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const now = Date.now();
      if (now - lastEmber > 40) {
        spawnEmber(e.clientX, e.clientY);
        lastEmber = now;
      }
    };

    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.left = `${pos.current.x}px`;
        dotRef.current.style.top = `${pos.current.y}px`;
      }
      ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      animRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener("mousemove", onMove);
    animRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animRef.current);
    };
  }, [spawnEmber]);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
