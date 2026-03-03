import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function LoadingScreen({ onComplete }) {
  const wrapRef   = useRef(null);
  const canvasRef = useRef(null);
  const barRef    = useRef(null);
  const uiRef     = useRef(null);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const cv  = canvasRef.current;
    const ctx = cv.getContext("2d");
    let W = cv.width  = window.innerWidth;
    let H = cv.height = window.innerHeight;

    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight; init(); };
    window.addEventListener("resize", resize);

    const GRID = 40;
    let traces = [];
    let pulses  = [];

    const init = () => {
      traces = [];
      // Generate random circuit traces
      for (let i = 0; i < 60; i++) {
        const startX = Math.floor(Math.random() * (W / GRID)) * GRID;
        const startY = Math.floor(Math.random() * (H / GRID)) * GRID;
        const segs   = 3 + Math.floor(Math.random() * 8);
        const points = [{ x: startX, y: startY }];
        let cx = startX, cy = startY;
        for (let j = 0; j < segs; j++) {
          const dir = Math.random() < 0.5 ? "h" : "v";
          const len = (1 + Math.floor(Math.random() * 5)) * GRID;
          cx = dir === "h" ? cx + (Math.random() < 0.5 ? len : -len) : cx;
          cy = dir === "v" ? cy + (Math.random() < 0.5 ? len : -len) : cy;
          cx = Math.max(0, Math.min(W, cx));
          cy = Math.max(0, Math.min(H, cy));
          points.push({ x: cx, y: cy });
        }
        traces.push({
          points,
          progress: 0,
          speed: 0.004 + Math.random() * 0.008,
          hue: 265 + Math.random() * 50,
          width: Math.random() < 0.3 ? 2 : 1,
          delay: Math.random() * 0.6,
        });
      }
    };
    init();

    let t = 0, raf;

    const drawTrace = (trace) => {
      if (t < trace.delay) return;
      trace.progress = Math.min(1, trace.progress + trace.speed);

      const pts   = trace.points;
      const total = pts.length - 1;
      const drawn = trace.progress * total;
      const seg   = Math.floor(drawn);
      const frac  = drawn - seg;

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);

      for (let i = 1; i <= seg && i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }

      if (seg < total) {
        const p0 = pts[seg], p1 = pts[seg + 1];
        ctx.lineTo(p0.x + (p1.x - p0.x) * frac, p0.y + (p1.y - p0.y) * frac);
      }

      ctx.strokeStyle = `hsla(${trace.hue}, 70%, 55%, 0.55)`;
      ctx.lineWidth   = trace.width;
      ctx.shadowColor = `hsla(${trace.hue}, 70%, 60%, 0.8)`;
      ctx.shadowBlur  = 6;
      ctx.stroke();
      ctx.shadowBlur  = 0;

      // Dot nodes at corners
      pts.slice(0, seg + 1).forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${trace.hue}, 80%, 70%, 0.9)`;
        ctx.shadowColor = `hsla(${trace.hue}, 80%, 70%, 1)`;
        ctx.shadowBlur  = 8;
        ctx.fill();
        ctx.shadowBlur  = 0;
      });

      // Traveling pulse
      if (trace.progress > 0.1 && Math.random() < 0.005) {
        const pt = pts[Math.floor(Math.random() * (seg + 1))];
        pulses.push({ x: pt.x, y: pt.y, life: 1, hue: trace.hue });
      }
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, W, H);

      traces.forEach(tr => drawTrace(tr));

      // Animate pulses
      pulses = pulses.filter(p => {
        p.life -= 0.035;
        const r = (1 - p.life) * 18;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.strokeStyle = `hsla(${p.hue},80%,65%,${p.life * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `hsla(${p.hue},80%,65%,0.8)`;
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
        return p.life > 0;
      });

      t += 0.016;
      raf = requestAnimationFrame(draw);
    };
    draw();

    gsap.fromTo(uiRef.current, { opacity:0, scale:0.95 }, { opacity:1, scale:1, duration:0.8, delay:0.3, ease:"power3.out" });

    const obj = { v: 0 };
    gsap.to(obj, {
      v: 100, duration: 2.8, ease: "power2.inOut", delay: 0.3,
      onUpdate() {
        const v = Math.round(obj.v);
        setPct(v);
        if (barRef.current) barRef.current.style.width = `${v}%`;
      },
      onComplete() {
        cancelAnimationFrame(raf);
        gsap.to(uiRef.current, { opacity:0, scale:1.05, duration:0.3 });
        gsap.to(wrapRef.current, {
          scaleY:0, transformOrigin:"top center", duration:0.6, ease:"power4.inOut", delay:0.2,
          onComplete: () => onComplete?.(),
        });
      },
    });

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, [onComplete]);

  return (
    <div ref={wrapRef} style={{ position:"fixed", inset:0, zIndex:9999, background:"#000", overflow:"hidden" }}>
      <canvas ref={canvasRef} style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}/>

      <div ref={uiRef} style={{
        position:"absolute", inset:0, zIndex:2, opacity:0,
        display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      }}>
        <p style={{ fontSize:"clamp(9px,1.1vw,11px)", color:"rgba(192,132,252,0.4)", letterSpacing:"0.7em", textTransform:"uppercase", fontFamily:"monospace", marginBottom:"clamp(20px,4vh,40px)" }}>
          Loading
        </p>
        <div style={{ width:"clamp(180px,35vw,300px)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
            <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.15)", letterSpacing:"0.3em", fontFamily:"monospace" }}>CIRCUIT</span>
            <span style={{ fontSize:"13px", fontWeight:"900", color:"#C084FC", fontFamily:"monospace", textShadow:"0 0 16px #C084FC" }}>{pct}%</span>
          </div>
          <div style={{ width:"100%", height:"1px", background:"rgba(123,47,190,0.2)", overflow:"hidden" }}>
            <div ref={barRef} style={{ height:"100%", width:"0%", background:"linear-gradient(90deg,#7B2FBE,#C084FC)", boxShadow:"0 0 12px #C084FC", transition:"width 0.04s linear" }}/>
          </div>
        </div>
      </div>
    </div>
  );
}