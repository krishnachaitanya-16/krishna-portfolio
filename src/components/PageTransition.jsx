import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * PageTransition — renders a purple curtain that wipes over the screen
 * whenever a nav link is clicked for smooth section-to-section feel.
 * Drop this once inside App.jsx and it works globally.
 */
const PageTransition = () => {
  const curtainRef = useRef(null);

  useEffect(() => {
    const curtain = curtainRef.current;

    const triggerTransition = (callback) => {
      const tl = gsap.timeline();
      tl.set(curtain, { scaleY: 0, transformOrigin: "bottom center", display: "block" })
        .to(curtain, { scaleY: 1, duration: 0.45, ease: "power4.inOut" })
        .add(() => callback?.())
        .to(curtain, {
          scaleY: 0,
          transformOrigin: "top center",
          duration: 0.45,
          ease: "power4.inOut",
          delay: 0.05,
        })
        .set(curtain, { display: "none" });
    };

    // Intercept all internal anchor clicks
    const handleClick = (e) => {
      const anchor = e.target.closest("a[href^='#']");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const id = href?.replace("#", "");
      if (!id) return;

      // Let the Navbar's smoothScrollTo handle positioning,
      // just layer the curtain on top
      e.preventDefault();

      const target = document.getElementById(id);
      if (!target) return;

      triggerTransition(() => {
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "instant" });
      });
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return (
    <div
      ref={curtainRef}
      style={{
        position: "fixed", inset: 0, zIndex: 9998,
        background: "linear-gradient(135deg, #0a0010 0%, #1a0035 50%, #0a0010 100%)",
        display: "none", pointerEvents: "none",
        transformOrigin: "bottom center",
      }}
    >
      {/* Glow in center of curtain */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: "400px", height: "400px",
        background: "radial-gradient(circle, rgba(123,47,190,0.5) 0%, transparent 65%)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      {/* Logo flash */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "48px", fontWeight: "900",
        color: "#ffffff", letterSpacing: "-0.02em",
        opacity: 0.15,
      }}>
        KK<span style={{ color: "#7B2FBE" }}>.</span>
      </div>
    </div>
  );
};

export default PageTransition;