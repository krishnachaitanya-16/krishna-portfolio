import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "./components/Navbar";
import Hero from "./pages/Hero";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Journey from "./pages/Journey";
import Contact from "./pages/Contact";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import PageTransition from "./components/PageTransition";
import "./index.css";
import AIChatBox from "./components/AIChatBox";
import Resume from "./pages/Resume";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) return;

    // Refresh ScrollTrigger after main content becomes visible
    const t = setTimeout(() => ScrollTrigger.refresh(true), 150);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    return () => {
      clearTimeout(t);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [loaded]);

  return (
    <>
      <CustomCursor />
      <AIChatBox />

      {/*
        ✅ LoadingScreen is ALWAYS mounted — never conditionally removed.
        It hides itself (returns null) after its animation finishes internally.
        Conditional unmounting caused the React removeChild crash.
      */}
      <LoadingScreen onComplete={() => setLoaded(true)} />

      <PageTransition />

      <main
        className="bg-black text-white font-grotesk"
        style={{
          opacity: loaded ? 1 : 0,
          pointerEvents: loaded ? "all" : "none",
          transition: "opacity 0.5s ease",
        }}
      >
        <Navbar />
        <Hero ready={loaded} />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Resume />
        <Contact />
      </main>
    </>
  );
}

export default App;