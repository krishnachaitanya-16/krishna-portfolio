import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function ScrollRocket({ sectionRef }) {
  const dotRef = useRef(null);
  const trailRef = useRef(null);
  const glowRef = useRef(null);
  const fireParticlesRef = useRef([]);

  useEffect(() => {
    const section = sectionRef?.current;
    const dot = dotRef.current;
    const trail = trailRef.current;
    const glow = glowRef.current;
    if (!section || !dot || !trail || !glow) return;

    // Pulse animation on dot
    gsap.to(dot, {
      scale: 1.4,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Fire particles
    fireParticlesRef.current.forEach((p, i) => {
      if (!p) return;
      gsap.set(p, { x: (Math.random() - 0.5) * 16, y: 0, opacity: 0, scale: Math.random() * 0.6 + 0.4 });
      gsap.to(p, {
        y: -(20 + Math.random() * 30),
        x: (Math.random() - 0.5) * 20,
        opacity: 0, scale: 0,
        duration: 0.6 + Math.random() * 0.5,
        repeat: -1, delay: i * 0.1, ease: "power2.out",
        onRepeat: () => {
          gsap.set(p, {
            x: (Math.random() - 0.5) * 16, y: 0,
            opacity: Math.random() * 0.8 + 0.2,
            scale: Math.random() * 0.6 + 0.4,
          });
        },
      });
    });

    // Scroll handler — moves dot + trail based on scroll progress through section
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const viewH = window.innerHeight;

      // progress: 0 when section top hits viewport top, 1 when section bottom leaves
      const scrolled = -rect.top;
      const total = sectionH - viewH;
      const progress = Math.min(Math.max(scrolled / total, 0), 1);

      const pct = progress * 100;

      // Move dot and glow
      dot.style.top = `${pct}%`;
      glow.style.top = `${pct}%`;

      // Grow trail
      trail.style.height = `${pct}%`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount

    return () => window.removeEventListener("scroll", onScroll);
  }, [sectionRef]);

  const particleColors = ["#fff", "#C084FC", "#A855F7", "#7C3AED", "#E879F9", "#F0ABFC", "#fff", "#C084FC"];

  return (
    <div style={{
      position: "absolute", top: 0, left: "50%",
      transform: "translateX(-50%)",
      height: "100%", width: "2px",
      zIndex: 3, pointerEvents: "none",
    }}>
      {/* Static background line */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "1px", height: "100%",
        background: "linear-gradient(180deg, transparent 0%, rgba(123,47,190,0.5) 10%, rgba(192,132,252,0.4) 50%, rgba(123,47,190,0.5) 90%, transparent 100%)",
      }} />

      {/* Scrolling trail — grows from top */}
      <div ref={trailRef} style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "2px", height: "0%",
        background: "linear-gradient(180deg, rgba(192,132,252,0.2) 0%, rgba(168,85,247,0.8) 70%, #C084FC 100%)",
        boxShadow: "0 0 6px #C084FC",
      }} />

      {/* Glow blob follows dot */}
      <div ref={glowRef} style={{
        position: "absolute", top: "0%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "60px", height: "60px", borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,132,252,0.35) 0%, rgba(124,58,237,0.15) 50%, transparent 70%)",
        filter: "blur(8px)",
      }} />

      {/* Moving dot */}
      <div ref={dotRef} style={{
        position: "absolute", top: "0%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "12px", height: "12px", borderRadius: "50%",
        background: "#C084FC",
        boxShadow: "0 0 10px #C084FC, 0 0 20px #A855F7, 0 0 40px rgba(168,85,247,0.5)",
        zIndex: 10,
      }}>
        {particleColors.map((color, i) => (
          <div
            key={i}
            ref={el => (fireParticlesRef.current[i] = el)}
            style={{
              position: "absolute", bottom: "100%", left: "50%",
              transform: "translateX(-50%)",
              width: i % 2 === 0 ? "4px" : "3px",
              height: i % 2 === 0 ? "4px" : "3px",
              borderRadius: "50%", backgroundColor: color,
              boxShadow: `0 0 6px ${color}`, opacity: 0, pointerEvents: "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}