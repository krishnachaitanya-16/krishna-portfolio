import { useEffect, useRef, Suspense, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

function Robot() {
  const group = useRef();
  const { scene, animations } = useGLTF("/robot.glb");
  const { actions, names } = useAnimations(animations, group);

  useFrame((state) => {
    if (group.current) {
      group.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.8) * 0.12 - 1.5;
    }
  });

  useEffect(() => {
    if (names.length > 0) {
      const action = actions[names[0]];
      if (action) action.reset().fadeIn(0.5).play();
    }
  }, [actions, names]);

  return (
    <group ref={group}>
      <primitive object={scene} scale={1.5} />
    </group>
  );
}

// ✅ Accept `ready` prop from App.jsx — animations only fire after loading screen
const Hero = ({ ready = false }) => {
  const helloRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnRef = useRef(null);
  const socialRef = useRef(null);
  const canvasRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const scrollDotRef = useRef(null);
  const animatedRef = useRef(false); // ✅ prevent double-firing

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth > 768 && window.innerWidth <= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ✅ Only run GSAP when `ready` flips to true (loading screen done)
  useEffect(() => {
    if (!ready || animatedRef.current) return;
    animatedRef.current = true;

    const nameEl = nameRef.current;
    if (!nameEl) return;

    const words = ["K", "KRISHNA", "CHAITANYA"];
    nameEl.innerHTML = words.map((word, i) =>
      `<div style="overflow:hidden; display:${i === 2 ? "block" : "inline-block"}; margin-right:${i < 2 ? "16px" : "0"}">
        <span class="word-inner" style="
          display:inline-block;
          background: linear-gradient(135deg, #ffffff 40%, #C084FC 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transform: translateY(100%);
          opacity: 0;
        ">${word}</span>
      </div>`
    ).join("");

    const wordInners = nameEl.querySelectorAll(".word-inner");
    wordInners.forEach((letter, i) => {
      const fromX = i % 2 === 0 ? -80 : 80;
      const fromY = i < 2 ? -60 : 60;
      gsap.set(letter, { x: fromX, y: fromY, opacity: 0, rotation: i < 2 ? -15 : 15 });
    });

    // ✅ Small delay of 0.3s (not 1.0s) — loading screen already done by now
    const tl = gsap.timeline({ delay: 0.3 });
    tl.fromTo(helloRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
      .to(wordInners, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.4)", stagger: { each: 0.15, from: "start" } }, "-=0.2")
      .fromTo(titleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.2")
      .fromTo(descRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4")
      .fromTo(btnRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4")
      .fromTo(socialRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }, "-=0.3")
      .fromTo(
        canvasRef.current,
        { opacity: 0, x: isMobile ? 0 : 80, y: isMobile ? 40 : 0 },
        { opacity: 1, x: 0, y: 0, duration: 1.4, ease: "power3.out" },
        "-=1.0"
      );

    // ✅ Scroll indicator — only animate if ref exists
    if (scrollIndicatorRef.current) {
      tl.fromTo(scrollIndicatorRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
    }

    const handleEnter = () => {
      gsap.to(wordInners, {
        x: (i) => i % 2 === 0 ? -20 : 20,
        y: (i) => i < 2 ? -15 : 15,
        opacity: 0.4, rotation: (i) => i < 2 ? -8 : 8,
        duration: 0.25, ease: "power2.out", stagger: 0.05,
        onComplete: () => {
          gsap.to(wordInners, { x: 0, y: 0, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(1.4)", stagger: 0.08 });
        },
      });
    };
    nameEl.addEventListener("mouseenter", handleEnter);

    // ✅ Guard scrollDotRef before animating
    if (scrollDotRef.current) {
      gsap.to(scrollDotRef.current, {
        y: 54, opacity: 0, duration: 1.4, ease: "power1.in",
        repeat: -1, repeatDelay: 0.3,
        onRepeat: () => gsap.set(scrollDotRef.current, { y: 0, opacity: 1 }),
      });
    }

    if (scrollIndicatorRef.current) {
      gsap.to(scrollIndicatorRef.current, {
        opacity: 0, y: 16,
        scrollTrigger: { trigger: "body", start: "top top", end: "150px top", scrub: true },
      });
    }

    return () => {
      nameEl.removeEventListener("mouseenter", handleEnter);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [ready]); // ✅ depends on `ready` — fires exactly once when loading screen finishes

  const isSmall = isMobile || isTablet;

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: isSmall ? "column" : "row",
        alignItems: "center",
        overflow: "hidden",
        backgroundColor: "#000000",
        paddingTop: isSmall ? "80px" : "0",
      }}
    >
      {/* Purple glow */}
      <div style={{
        position: "absolute",
        top: isSmall ? "30%" : "50%",
        right: isSmall ? "50%" : "25%",
        width: isSmall ? "300px" : "500px",
        height: isSmall ? "300px" : "500px",
        background: "radial-gradient(circle, rgba(123,47,190,0.35) 0%, transparent 70%)",
        transform: isSmall ? "translate(50%, -50%)" : "translate(50%, -50%)",
        filter: "blur(80px)",
        pointerEvents: "none",
      }} />

      {/* LEFT — Text */}
      <div style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingLeft: isMobile ? "24px" : isTablet ? "48px" : "100px",
        paddingRight: isMobile ? "24px" : isTablet ? "48px" : "40px",
        paddingTop: isMobile ? "20px" : isTablet ? "40px" : "100px",
        paddingBottom: isSmall ? "20px" : "0",
        width: isSmall ? "100%" : "50%",
        gap: "20px",
        textAlign: isMobile ? "center" : "left",
      }}>
        <p ref={helloRef} style={{
          fontSize: "13px", color: "#9ca3af",
          letterSpacing: "0.4em", textTransform: "uppercase",
          opacity: 0, // start hidden — GSAP reveals
        }}>
          Hello, I&apos;m
        </p>

        <h1
          ref={nameRef}
          style={{
            fontSize: isMobile ? "clamp(36px, 10vw, 52px)" : isTablet ? "clamp(44px, 7vw, 64px)" : "clamp(50px, 6vw, 80px)",
            fontWeight: "800",
            letterSpacing: "-0.02em",
            lineHeight: "1.1",
            cursor: "default",
            userSelect: "none",
          }}
        >
          K KRISHNA CHAITANYA
        </h1>

        <div ref={titleRef} style={{
          display: "flex", alignItems: "center", gap: "16px",
          justifyContent: isMobile ? "center" : "flex-start",
          opacity: 0, // start hidden
        }}>
          <div style={{ width: "40px", height: "1px", backgroundColor: "#7B2FBE" }} />
          <p style={{ fontSize: "11px", color: "#7B2FBE", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "500" }}>
            Full Stack Developer &amp; Creative Technologist
          </p>
        </div>

        <p ref={descRef} style={{
          color: "#9ca3af", fontSize: "14px",
          maxWidth: isMobile ? "100%" : "380px",
          lineHeight: "1.8",
          margin: isMobile ? "0 auto" : "0",
          opacity: 0, // start hidden
        }}>
          I build modern, scalable, and user-friendly web applications.
          Exploring AI automations, interactive UI/UX, and clean backend systems.
        </p>

        <div ref={btnRef} style={{
          display: "flex", gap: "16px", flexWrap: "wrap",
          justifyContent: isMobile ? "center" : "flex-start",
          opacity: 0, // start hidden
        }}>
          <a href="#projects" style={{
            padding: "12px 28px", fontSize: "11px", letterSpacing: "0.2em",
            textTransform: "uppercase", fontWeight: "600", color: "#ffffff",
            background: "linear-gradient(135deg, #7B2FBE, #C084FC)",
            borderRadius: "4px", textDecoration: "none", transition: "opacity 0.3s",
          }}
            onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.target.style.opacity = "1")}
          >View Projects</a>
          <a href="#contact" style={{
            padding: "12px 28px", fontSize: "11px", letterSpacing: "0.2em",
            textTransform: "uppercase", fontWeight: "600", color: "#7B2FBE",
            border: "1px solid #7B2FBE", borderRadius: "4px",
            textDecoration: "none", transition: "all 0.3s",
          }}
            onMouseEnter={(e) => { e.target.style.background = "#7B2FBE"; e.target.style.color = "#ffffff"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#7B2FBE"; }}
          >Contact Me</a>
        </div>

        <div ref={socialRef} style={{
          display: "flex", gap: "32px", marginTop: "4px",
          justifyContent: isMobile ? "center" : "flex-start",
          opacity: 0, // start hidden
        }}>
          <a href="https://github.com/krishnachaitanya-16" target="_blank" rel="noreferrer"
            style={{ color: "#6b7280", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.target.style.color = "#7B2FBE")}
            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
          >GitHub</a>
          <a href="https://www.linkedin.com/in/kanakavalli-krishna-chaitanya-2b3114325" target="_blank" rel="noreferrer"
            style={{ color: "#6b7280", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.3s" }}
            onMouseEnter={(e) => (e.target.style.color = "#7B2FBE")}
            onMouseLeave={(e) => (e.target.style.color = "#6b7280")}
          >LinkedIn</a>
        </div>
      </div>

      {/* RIGHT — 3D Robot */}
      <div
        ref={canvasRef}
        style={{
          width: isSmall ? "100%" : "50%",
          height: isMobile ? "50vh" : isTablet ? "55vh" : "100vh",
          opacity: 0, // start hidden — GSAP reveals
          flexShrink: 0,
        }}
      >
        <Canvas camera={{ position: [0, -0.5, 6], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={1} />
            <directionalLight position={[5, 10, 5]} intensity={2} color="#ffffff" />
            <pointLight position={[-3, 3, 3]} color="#7B2FBE" intensity={5} />
            <pointLight position={[3, -3, 3]} color="#C084FC" intensity={3} />
            <Robot />
            <OrbitControls
              enableZoom={false} enablePan={false}
              autoRotate autoRotateSpeed={1.5}
              minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll Indicator — desktop only */}
      {!isMobile && (
        <div ref={scrollIndicatorRef} style={{
          position: "absolute", bottom: "36px", left: "50%",
          transform: "translateX(-50%)", display: "flex",
          flexDirection: "column", alignItems: "center", gap: "10px", zIndex: 10,
          opacity: 0, // start hidden
        }}>
          <p style={{ color: "#4b5563", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", margin: 0 }}>Scroll</p>
          <div style={{ width: "1px", height: "60px", background: "rgba(124,58,237,0.25)", position: "relative", overflow: "hidden" }}>
            <div ref={scrollDotRef} style={{
              position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
              width: "4px", height: "4px", borderRadius: "50%",
              backgroundColor: "#C084FC", boxShadow: "0 0 8px #C084FC, 0 0 16px #7B2FBE",
            }} />
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;