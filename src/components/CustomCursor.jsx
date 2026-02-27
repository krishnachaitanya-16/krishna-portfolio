import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const dotRef = useRef(null);
  const innerRingRef = useRef(null);
  const outerRingRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    // Hide on touch devices — no mouse, no cursor
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    document.body.style.cursor = "none";

    // ✅ Initialize to center of screen — prevents stuck top-left bug
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let innerX = mouseX;
    let innerY = mouseY;
    let outerX = mouseX;
    let outerY = mouseY;

    // ✅ Set all elements to center immediately so nothing starts at (0,0)
    gsap.set(dotRef.current, { x: mouseX, y: mouseY });
    gsap.set(glowRef.current, { x: mouseX, y: mouseY });
    gsap.set(innerRingRef.current, { x: mouseX, y: mouseY });
    gsap.set(outerRingRef.current, { x: mouseX, y: mouseY });

    // Continuously rotate outer ring clockwise
    gsap.to(outerRingRef.current, {
      rotate: 360,
      duration: 3,
      ease: "none",
      repeat: -1,
    });

    // Counter-rotate inner ring
    gsap.to(innerRingRef.current, {
      rotate: -360,
      duration: 2,
      ease: "none",
      repeat: -1,
    });

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(dotRef.current, { x: mouseX, y: mouseY });
      gsap.set(glowRef.current, { x: mouseX, y: mouseY });
    };

    // Smooth follow for rings with different lag
    let rafId;
    const animate = () => {
      innerX += (mouseX - innerX) * 0.18;
      innerY += (mouseY - innerY) * 0.18;
      outerX += (mouseX - outerX) * 0.1;
      outerY += (mouseY - outerY) * 0.1;
      gsap.set(innerRingRef.current, { x: innerX, y: innerY });
      gsap.set(outerRingRef.current, { x: outerX, y: outerY });
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleEnter = () => {
      gsap.to(innerRingRef.current, { width: 50, height: 50, borderColor: "#E879F9", duration: 0.3, ease: "back.out(2)" });
      gsap.to(outerRingRef.current, { width: 70, height: 70, opacity: 1, duration: 0.3, ease: "back.out(2)" });
      gsap.to(dotRef.current, { scale: 1.8, backgroundColor: "#E879F9", duration: 0.2 });
      gsap.to(glowRef.current, { width: 80, height: 80, opacity: 0.5, duration: 0.3 });
    };

    const handleLeave = () => {
      gsap.to(innerRingRef.current, { width: 30, height: 30, borderColor: "#C084FC", duration: 0.3 });
      gsap.to(outerRingRef.current, { width: 50, height: 50, opacity: 0.6, duration: 0.3 });
      gsap.to(dotRef.current, { scale: 1, backgroundColor: "#C084FC", duration: 0.2 });
      gsap.to(glowRef.current, { width: 50, height: 50, opacity: 0.2, duration: 0.3 });
    };

    const handleClick = () => {
      gsap.to([innerRingRef.current, outerRingRef.current], {
        scale: 2.5, opacity: 0, duration: 0.4, ease: "power2.out",
        onComplete: () => {
          gsap.set([innerRingRef.current, outerRingRef.current], { scale: 1, opacity: 1 });
          gsap.set(outerRingRef.current, { opacity: 0.6 });
        },
      });
      gsap.to(dotRef.current, {
        scale: 3, opacity: 0, duration: 0.3,
        onComplete: () => gsap.set(dotRef.current, { scale: 1, opacity: 1 }),
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("click", handleClick);

    const attachHovers = () => {
      document.querySelectorAll("a, button, [data-cursor]").forEach((el) => {
        el.style.cursor = "none";
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
        el.addEventListener("mouseenter", handleEnter);
        el.addEventListener("mouseleave", handleLeave);
      });
    };
    attachHovers();

    const observer = new MutationObserver(attachHovers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("click", handleClick);
      document.body.style.cursor = "auto";
      observer.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={glowRef} style={{
        position: "fixed", top: 0, left: 0, width: "50px", height: "50px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(192,132,252,0.3) 0%, transparent 70%)",
        transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 99995, opacity: 0.2,
      }} />
      <div ref={outerRingRef} style={{
        position: "fixed", top: 0, left: 0, width: "50px", height: "50px",
        borderRadius: "50%", border: "1.5px dashed rgba(123,47,190,0.8)",
        transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 99997, opacity: 0.6,
        boxShadow: "0 0 8px rgba(123,47,190,0.4), inset 0 0 8px rgba(123,47,190,0.1)",
      }} />
      <div ref={innerRingRef} style={{
        position: "fixed", top: 0, left: 0, width: "30px", height: "30px",
        borderRadius: "50%", border: "1.5px solid #C084FC",
        transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 99998,
        boxShadow: "0 0 12px #C084FC, 0 0 24px rgba(192,132,252,0.4)",
      }} />
      <div ref={dotRef} style={{
        position: "fixed", top: 0, left: 0, width: "6px", height: "6px",
        borderRadius: "50%", backgroundColor: "#C084FC",
        transform: "translate(-50%, -50%)", pointerEvents: "none", zIndex: 99999,
        boxShadow: "0 0 8px #C084FC, 0 0 16px #7B2FBE, 0 0 32px #7B2FBE",
      }} />
    </>
  );
};

export default CustomCursor;