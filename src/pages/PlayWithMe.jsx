import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Chess from "./Chess";

const PlayWithMe = () => {
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000" }}>
      {/* Nav strip */}
      <div ref={headerRef} style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(123,47,190,0.15)", backdropFilter: "blur(20px)", background: "rgba(0,0,0,0.8)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
          <span style={{ fontSize: "20px", fontWeight: "900", color: "#fff", letterSpacing: "-0.02em" }}>KC <span style={{ color: "#7B2FBE" }}>🔥</span></span>
        </a>
        <a href="/" style={{ fontSize: "11px", color: "#7B2FBE", letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(123,47,190,0.3)", padding: "6px 16px", borderRadius: "999px", transition: "all 0.2s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(123,47,190,0.15)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          ← Portfolio
        </a>
      </div>

      {/* Chess */}
      <div style={{ paddingTop: "70px" }}>
        <Chess />
      </div>
    </div>
  );
};

export default PlayWithMe;