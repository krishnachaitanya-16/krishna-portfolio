import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { projects } from "../data/projectsData";

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ project, index, isMobile }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const tagsRef = useRef(null);
  const numberRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;

    gsap.fromTo(card,
      { y: 100, opacity: 0, scale: 0.9, rotateY: isMobile ? 0 : (index % 2 === 0 ? -12 : 12) },
      {
        y: 0, opacity: 1, scale: 1, rotateY: 0,
        duration: 1.1, ease: "power4.out",
        delay: isMobile ? 0 : index * 0.12,
        scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none reverse" },
      }
    );

    gsap.fromTo(titleRef.current,
      { y: 25, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        delay: isMobile ? 0.1 : index * 0.12 + 0.2,
        scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none reverse" },
      }
    );

    gsap.fromTo(descRef.current,
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        delay: isMobile ? 0.2 : index * 0.12 + 0.35,
        scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none reverse" },
      }
    );

    const tags = tagsRef.current?.children;
    if (tags) {
      gsap.fromTo(tags,
        { y: 15, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.5, ease: "back.out(1.7)",
          stagger: 0.06, delay: isMobile ? 0.3 : index * 0.12 + 0.5,
          scrollTrigger: { trigger: card, start: "top 95%", toggleActions: "play none none reverse" },
        }
      );
    }

    gsap.to(numberRef.current, {
      y: -12, duration: 2.5 + index * 0.2,
      ease: "sine.inOut", yoyo: true, repeat: -1,
    });

    if (isMobile) return; // no tilt on mobile

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      gsap.to(card, { rotateX: ((y - cy) / cy) * -14, rotateY: ((x - cx) / cx) * 14, duration: 0.35, ease: "power2.out", transformPerspective: 900 });
      gsap.to(glowRef.current, { x: x - 120, y: y - 120, opacity: 0.7, duration: 0.3 });
    };

    const handleMouseEnter = () => {
      gsap.to(card, { scale: 1.04, boxShadow: `0 25px 60px ${project.color}35`, borderColor: `${project.color}80`, duration: 0.35, ease: "power2.out" });
      gsap.to(titleRef.current, { color: project.color, duration: 0.3 });
      gsap.to(numberRef.current, { opacity: 0.18, scale: 1.1, duration: 0.3 });
    };

    const handleMouseLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, scale: 1, boxShadow: "none", borderColor: "rgba(123,47,190,0.3)", duration: 0.6, ease: "power2.out" });
      gsap.to(glowRef.current, { opacity: 0, duration: 0.3 });
      gsap.to(titleRef.current, { color: "#ffffff", duration: 0.3 });
      gsap.to(numberRef.current, { opacity: 0.08, scale: 1, duration: 0.3 });
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [index, project.color, isMobile]);

  return (
    <div
      ref={cardRef}
      style={{
        position: "relative",
        width: isMobile ? "100%" : "400px",
        flexShrink: 0,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(123,47,190,0.3)",
        borderRadius: "20px",
        padding: isMobile ? "24px" : "38px",
        overflow: "hidden",
        transformStyle: "preserve-3d",
        cursor: isMobile ? "default" : "none",
        minHeight: isMobile ? "auto" : "420px",
        height: isMobile ? "auto" : "420px",
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        willChange: "transform",
        boxSizing: "border-box",
      }}
    >
      <div ref={glowRef} style={{ position: "absolute", width: "240px", height: "240px", borderRadius: "50%", background: `radial-gradient(circle, ${project.color}40 0%, transparent 70%)`, pointerEvents: "none", opacity: 0, zIndex: 0 }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${project.color}, transparent)`, zIndex: 1 }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: "150px", height: "150px", background: `radial-gradient(circle at top right, ${project.color}15 0%, transparent 70%)`, zIndex: 0 }} />

      <span ref={numberRef} style={{ position: "absolute", bottom: "-15px", right: "12px", fontSize: isMobile ? "80px" : "120px", fontWeight: 900, color: `${project.color}08`, fontFamily: "Space Grotesk, sans-serif", lineHeight: 1, zIndex: 0, userSelect: "none", pointerEvents: "none" }}>
        {project.number}
      </span>

      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: project.color, boxShadow: `0 0 10px ${project.color}, 0 0 20px ${project.color}60` }} />
            <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.1em", textTransform: "uppercase", color: project.color, border: `1px solid ${project.color}40`, backgroundColor: `${project.color}15` }}>
              {project.tag}
            </span>
          </div>
          <a href={project.github} target="_blank" rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", gap: "6px", border: `1px solid ${project.color}50`, borderRadius: "8px", padding: "8px 14px", color: project.color, textDecoration: "none", fontSize: "12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600, letterSpacing: "0.06em", backgroundColor: `${project.color}15`, transition: "all 0.3s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${project.color}35`; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 4px 15px ${project.color}30`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${project.color}15`; e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>

        <h3 ref={titleRef} style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 700, color: "#ffffff", marginBottom: "14px", fontFamily: "Space Grotesk, sans-serif", transition: "color 0.3s ease" }}>
          {project.title}
        </h3>
        <p ref={descRef} style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, fontFamily: "Space Grotesk, sans-serif", marginBottom: isMobile ? "20px" : "0" }}>
          {project.description}
        </p>
      </div>

      <div ref={tagsRef} style={{ display: "flex", flexWrap: "wrap", gap: "7px", position: "relative", zIndex: 2 }}>
        {project.tech.map((t) => (
          <span key={t} style={{ padding: "4px 12px", borderRadius: "999px", fontSize: "10px", fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.08em", color: project.color, border: `1px solid ${project.color}40`, backgroundColor: `${project.color}12`, transition: "all 0.2s ease" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = `${project.color}30`; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = `${project.color}12`; e.currentTarget.style.transform = "translateY(0)"; }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
};

// ─── Desktop: horizontal scroll ───────────────────────────────────────────────
const DesktopProjects = ({ projects }) => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    gsap.fromTo(subtitleRef.current,
      { y: 30, opacity: 0, letterSpacing: "0.6em" },
      { y: 0, opacity: 1, letterSpacing: "0.3em", duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );
    gsap.fromTo(titleRef.current,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4.out", delay: 0.15, scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );

    const track = trackRef.current;
    const totalWidth = track.scrollWidth - window.innerWidth + 160;

    gsap.to(track, {
      x: -totalWidth, ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current, start: "top top",
        end: () => `+=${totalWidth}`,
        scrub: 1.2, pin: true, anticipatePin: 1,
        onUpdate: (self) => {
          if (progressRef.current) progressRef.current.style.width = `${self.progress * 100}%`;
          if (counterRef.current) {
            const current = Math.min(Math.ceil(self.progress * projects.length), projects.length);
            counterRef.current.textContent = `${String(current || 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
          }
        },
      },
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.ticker.remove(lenis.raf);
    };
  }, [projects.length]);

  return (
    <section id="projects" ref={sectionRef} style={{ backgroundColor: "#000", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(123,47,190,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,190,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", left: "8%", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(123,47,190,0.07) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

      <div style={{ position: "absolute", top: "50px", left: "80px", zIndex: 10, pointerEvents: "none" }}>
        <p ref={subtitleRef} style={{ fontSize: "12px", letterSpacing: "0.3em", color: "#7B2FBE", textTransform: "uppercase", marginBottom: "12px", fontFamily: "Space Grotesk, sans-serif", fontWeight: 600 }}>— My Work</p>
        <h2 ref={titleRef} style={{ fontSize: "clamp(32px, 4vw, 58px)", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: "#fff", lineHeight: 1.1 }}>
          Featured{" "}
          <span style={{ WebkitTextStroke: "1px rgba(192,132,252,0.6)", color: "transparent" }}>Projects</span>
        </h2>
      </div>

      <div style={{ position: "absolute", bottom: "40px", left: "80px", right: "80px", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "220px", height: "2px", backgroundColor: "rgba(123,47,190,0.2)", borderRadius: "2px", overflow: "hidden" }}>
            <div ref={progressRef} style={{ height: "100%", width: "0%", background: "linear-gradient(90deg, #7B2FBE, #C084FC)", borderRadius: "2px", boxShadow: "0 0 10px #7B2FBE", transition: "width 0.05s linear" }} />
          </div>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "Space Grotesk, sans-serif", letterSpacing: "0.12em", textTransform: "uppercase" }}>Scroll to explore →</span>
        </div>
        <span ref={counterRef} style={{ fontSize: "13px", color: "#7B2FBE", fontFamily: "Space Grotesk, sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}>
          01 / {String(projects.length).padStart(2, "0")}
        </span>
      </div>

      <div ref={trackRef} style={{ display: "flex", alignItems: "center", gap: "28px", padding: "160px 80px 110px", width: "max-content", height: "100vh", willChange: "transform" }}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} isMobile={false} />
        ))}
      </div>
    </section>
  );
};

// ─── Mobile/Tablet: vertical grid ─────────────────────────────────────────────
const MobileProjects = ({ projects }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} style={{ backgroundColor: "#000", position: "relative", overflow: "hidden", paddingBottom: "80px" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(123,47,190,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(123,47,190,0.03) 1px, transparent 1px)", backgroundSize: "50px 50px", zIndex: 0, pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ position: "relative", zIndex: 2, textAlign: "center", paddingTop: "90px", paddingBottom: "50px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{ width: "40px", height: "1px", backgroundColor: "#7B2FBE" }} />
          <p style={{ fontSize: "11px", color: "#7B2FBE", letterSpacing: "0.4em", textTransform: "uppercase" }}>My Work</p>
          <div style={{ width: "40px", height: "1px", backgroundColor: "#7B2FBE" }} />
        </div>
        <h2 ref={titleRef} style={{ fontSize: "clamp(28px, 8vw, 48px)", fontWeight: 800, fontFamily: "Space Grotesk, sans-serif", color: "#fff", lineHeight: 1.1 }}>
          Featured{" "}
          <span style={{ WebkitTextStroke: "1px rgba(192,132,252,0.6)", color: "transparent" }}>Projects</span>
        </h2>
      </div>

      {/* Cards grid */}
      <div style={{ position: "relative", zIndex: 2, maxWidth: "700px", margin: "0 auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: "24px" }}>
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} index={index} isMobile={true} />
        ))}
      </div>
    </section>
  );
};

// ─── Main export — switches based on screen size ───────────────────────────────
const Projects = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    setReady(true);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!ready) return null;

  return isMobile
    ? <MobileProjects projects={projects} />
    : <DesktopProjects projects={projects} />;
};

export default Projects;