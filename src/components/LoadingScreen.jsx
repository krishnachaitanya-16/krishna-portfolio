import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const LoadingScreen = ({ onComplete }) => {
  const overlayRef = useRef(null);
  const cityFarRef = useRef(null);
  const cityNearRef = useRef(null);
  const groundRef = useRef(null);
  const runnerRef = useRef(null);
  const barRef = useRef(null);
  const logoRef = useRef(null);
  const [count, setCount] = useState(0);
  const [legFrame, setLegFrame] = useState(0);
  const [done, setDone] = useState(false);

  // Runner legs cycling
  const runnerFrames = ["🏃‍♂️", "🏃"];

  // Buildings data
  const farBuildings = [
    { w: 60, h: 120, x: 50 }, { w: 40, h: 90, x: 130 }, { w: 80, h: 160, x: 190 },
    { w: 50, h: 100, x: 300 }, { w: 70, h: 140, x: 380 }, { w: 45, h: 85, x: 470 },
    { w: 90, h: 180, x: 540 }, { w: 60, h: 130, x: 660 }, { w: 55, h: 110, x: 750 },
    { w: 75, h: 150, x: 830 }, { w: 50, h: 95, x: 930 }, { w: 85, h: 165, x: 1000 },
    { w: 60, h: 120, x: 1110 }, { w: 70, h: 145, x: 1200 }, { w: 45, h: 88, x: 1300 },
  ];
  const nearBuildings = [
    { w: 80, h: 200, x: 0 }, { w: 100, h: 260, x: 110 }, { w: 70, h: 180, x: 240 },
    { w: 120, h: 300, x: 340 }, { w: 90, h: 230, x: 490 }, { w: 80, h: 200, x: 610 },
    { w: 110, h: 280, x: 720 }, { w: 75, h: 190, x: 870 }, { w: 95, h: 240, x: 980 },
    { w: 80, h: 200, x: 1110 }, { w: 100, h: 260, x: 1220 }, { w: 70, h: 180, x: 1360 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // City scroll — parallax
      gsap.to(cityFarRef.current, { x: "-30%", duration: 8, ease: "none", repeat: -1, modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % -50) } });
      gsap.to(cityNearRef.current, { x: "-50%", duration: 5, ease: "none", repeat: -1, modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % -50) } });
      gsap.to(groundRef.current, { backgroundPositionX: "-200px", duration: 1, ease: "none", repeat: -1 });

      // Logo entrance
      gsap.fromTo(logoRef.current,
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.3 }
      );

      // Runner bob
      gsap.to(runnerRef.current, { y: -8, duration: 0.15, repeat: -1, yoyo: true, ease: "power1.inOut" });

      // Leg cycle
      const legInterval = setInterval(() => setLegFrame(f => (f + 1) % 2), 120);

      const obj = { val: 0 };
      gsap.to(obj, {
        val: 100, duration: 3.5, ease: "power1.inOut", delay: 0.5,
        onUpdate: () => {
          const v = Math.round(obj.val);
          setCount(v);
          if (barRef.current) barRef.current.style.width = `${v}%`;
        },
        onComplete: () => {
          clearInterval(legInterval);

          // Flash and slide up exit
          const exit = gsap.timeline({
            onComplete: () => {
              if (overlayRef.current) { overlayRef.current.style.visibility = "hidden"; overlayRef.current.style.pointerEvents = "none"; }
              setDone(true);
              setTimeout(() => onComplete?.(), 50);
            }
          });

          exit
            .to(runnerRef.current, { x: 200, opacity: 0, duration: 0.4, ease: "power3.in" })
            .to(overlayRef.current, { y: "-100%", duration: 0.8, ease: "power4.inOut" }, "-=0.1");
        }
      });
    });

    return () => ctx.revert();
  }, []);

  if (done) return null;

  const groundH = 100; // px from bottom

  return (
    <div ref={overlayRef} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#050510", overflow: "hidden" }}>
      <style>{`
        @keyframes windowBlink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes neonPulse { 0%,100%{filter:drop-shadow(0 0 4px #C084FC)} 50%{filter:drop-shadow(0 0 12px #7B2FBE)} }
      `}</style>

      {/* Stars */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", width: Math.random() * 2 + 1 + "px", height: Math.random() * 2 + 1 + "px", borderRadius: "50%", background: "#fff", left: Math.random() * 100 + "%", top: Math.random() * 60 + "%", opacity: Math.random() * 0.6 + 0.2, animation: `windowBlink ${1 + Math.random() * 3}s infinite` }} />
      ))}

      {/* Sky gradient */}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #050510 0%, #0d0520 40%, #1a0535 70%, #2d0a4e 100%)", zIndex: 0 }} />

      {/* Moon */}
      <div style={{ position: "absolute", top: "8%", right: "12%", width: "70px", height: "70px", borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #f0e0ff, #c084fc)", boxShadow: "0 0 30px rgba(192,132,252,0.6), 0 0 60px rgba(123,47,190,0.3)", zIndex: 1 }} />

      {/* FAR buildings */}
      <div ref={cityFarRef} style={{ position: "absolute", bottom: `${groundH}px`, left: 0, display: "flex", zIndex: 2, width: "200%" }}>
        {[...farBuildings, ...farBuildings].map((b, i) => (
          <div key={i} style={{ position: "absolute", left: `${b.x + (i >= farBuildings.length ? 1440 : 0)}px`, bottom: 0, width: `${b.w}px`, height: `${b.h}px`, background: "linear-gradient(180deg, #1a0535, #0d0520)", border: "1px solid rgba(123,47,190,0.3)" }}>
            {/* Windows */}
            {Array.from({ length: Math.floor(b.h / 20) }).map((_, j) => (
              <div key={j} style={{ position: "absolute", top: `${j * 20 + 5}px`, left: "8px", right: "8px", height: "8px", display: "flex", gap: "4px" }}>
                {Array.from({ length: Math.floor((b.w - 16) / 14) }).map((_, k) => (
                  <div key={k} style={{ width: "8px", height: "8px", background: Math.random() > 0.4 ? "#C084FC" : "transparent", opacity: 0.6, animation: `windowBlink ${2 + Math.random() * 4}s infinite` }} />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* NEAR buildings */}
      <div ref={cityNearRef} style={{ position: "absolute", bottom: `${groundH}px`, left: 0, display: "flex", zIndex: 3, width: "200%" }}>
        {[...nearBuildings, ...nearBuildings].map((b, i) => (
          <div key={i} style={{ position: "absolute", left: `${b.x + (i >= nearBuildings.length ? 1440 : 0)}px`, bottom: 0, width: `${b.w}px`, height: `${b.h}px`, background: "linear-gradient(180deg, #0a0218, #050510)", border: "1px solid rgba(123,47,190,0.5)" }}>
            {Array.from({ length: Math.floor(b.h / 22) }).map((_, j) => (
              <div key={j} style={{ position: "absolute", top: `${j * 22 + 6}px`, left: "8px", right: "8px", height: "8px", display: "flex", gap: "4px" }}>
                {Array.from({ length: Math.floor((b.w - 16) / 16) }).map((_, k) => (
                  <div key={k} style={{ width: "10px", height: "10px", background: Math.random() > 0.5 ? "#7B2FBE" : (Math.random() > 0.5 ? "#C084FC" : "transparent"), opacity: 0.7, animation: `windowBlink ${1.5 + Math.random() * 3}s infinite` }} />
                ))}
              </div>
            ))}
            {/* Rooftop antenna */}
            <div style={{ position: "absolute", top: "-20px", left: "50%", transform: "translateX(-50%)", width: "2px", height: "20px", background: "#C084FC", boxShadow: "0 0 6px #C084FC" }} />
            <div style={{ position: "absolute", top: "-24px", left: "50%", transform: "translateX(-50%)", width: "6px", height: "6px", borderRadius: "50%", background: "#ff4444", boxShadow: "0 0 6px #ff4444", animation: "windowBlink 1s infinite" }} />
          </div>
        ))}
      </div>

      {/* Neon ground */}
      <div ref={groundRef} style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${groundH}px`, background: "repeating-linear-gradient(90deg, rgba(123,47,190,0.15) 0px, rgba(123,47,190,0.15) 1px, transparent 1px, transparent 40px), linear-gradient(180deg, #1a0535, #000)", zIndex: 4 }}>
        {/* Ground neon line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #7B2FBE, #C084FC, #7B2FBE, transparent)", boxShadow: "0 0 20px #7B2FBE" }} />
      </div>

      {/* Runner */}
      <div ref={runnerRef} style={{ position: "absolute", bottom: `${groundH}px`, left: "15%", zIndex: 6, fontSize: "44px", filter: "drop-shadow(0 0 12px #C084FC)", animation: "neonPulse 0.6s infinite" }}>
        {runnerFrames[legFrame]}
      </div>

      {/* Logo top */}
      <div ref={logoRef} style={{ position: "absolute", top: "12%", left: "50%", transform: "translateX(-50%)", zIndex: 7, textAlign: "center", opacity: 0 }}>
        <div style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "900", color: "#fff", letterSpacing: "-0.03em", textShadow: "0 0 30px rgba(192,132,252,0.8)" }}>
          KC<span style={{ color: "#C084FC" }}>.</span>
        </div>
        <div style={{ fontSize: "10px", color: "#7B2FBE", letterSpacing: "0.5em", textTransform: "uppercase", marginTop: "8px" }}>
          Full Stack Developer · Creative
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)", width: "300px", zIndex: 7 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "0.3em", textTransform: "uppercase" }}>Loading City</span>
          <span style={{ fontSize: "11px", fontWeight: "900", color: "#C084FC" }}>{count}%</span>
        </div>
        <div style={{ width: "100%", height: "2px", background: "rgba(123,47,190,0.2)" }}>
          <div ref={barRef} style={{ height: "100%", width: "0%", background: "linear-gradient(90deg, #7B2FBE, #C084FC)", boxShadow: "0 0 10px #C084FC" }} />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;