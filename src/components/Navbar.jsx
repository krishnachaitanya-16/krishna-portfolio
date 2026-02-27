import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const navLinks = ["About", "Skills", "Projects", "Journey", "Resume", "Contact"];

const smoothScrollTo = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
};

const Navbar = () => {
  const navRef = useRef(null);
  const menuRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 2.8 }
    );
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    if (menuOpen) {
      gsap.fromTo(menuRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      );
    } else {
      gsap.to(menuRef.current,
        { opacity: 0, y: -10, duration: 0.3, ease: "power3.in" }
      );
    }
  }, [menuOpen]);

  const handleNavClick = (e, link) => {
    e.preventDefault();
    const id = link.toLowerCase();
    smoothScrollTo(id);
    setMenuOpen(false);
  };

  const handleHireClick = (e) => {
    e.preventDefault();
    smoothScrollTo("contact");
    setMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: "fixed", top: 0, left: 0, width: "100%", zIndex: 100,
          padding: isMobile ? "16px 24px" : "20px 60px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          backdropFilter: "blur(12px)",
          background: scrolled ? "rgba(0,0,0,0.75)" : "rgba(0,0,0,0.5)",
          borderBottom: scrolled ? "1px solid rgba(123,47,190,0.25)" : "1px solid rgba(123,47,190,0.15)",
          boxSizing: "border-box",
          transition: "background 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Logo — KC 🔥 */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          style={{
            fontSize: "20px", fontWeight: "900", letterSpacing: "0.05em",
            color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px",
            fontFamily: "inherit",
          }}
        >
          <span>KC</span>
          <span style={{ fontSize: "18px" }}>❣️</span>
        </div>

        {/* Desktop Nav Links */}
        {!isMobile && (
          <ul style={{ display: "flex", gap: "32px", listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}>
            {navLinks.map((link) => (
              <li key={link}>
                <a
                  href={"#" + link.toLowerCase()}
                  onClick={(e) => handleNavClick(e, link)}
                  style={{
                    fontSize: "11px", color: "#9ca3af", textDecoration: "none",
                    letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: "500",
                    transition: "color 0.3s",
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#C084FC")}
                  onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop Right Buttons */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>

            {/* Play With Me button */}
            <a
              href="/play"
              style={{
                padding: "10px 20px", fontSize: "11px", letterSpacing: "0.15em",
                textTransform: "uppercase", fontWeight: "600",
                color: "#4ade80",
                border: "1px solid #4ade8060",
                borderRadius: "4px", textDecoration: "none",
                transition: "all 0.3s",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#4ade8015";
                e.currentTarget.style.borderColor = "#4ade80";
                e.currentTarget.style.boxShadow = "0 0 16px #4ade8040";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.borderColor = "#4ade8060";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              🎮 Play
            </a>

            {/* Hire Me button */}
            <a
              href="#contact"
              onClick={handleHireClick}
              style={{
                padding: "10px 24px", fontSize: "11px", letterSpacing: "0.2em",
                textTransform: "uppercase", fontWeight: "600",
                color: "#7B2FBE", border: "1px solid #7B2FBE",
                borderRadius: "4px", textDecoration: "none", transition: "all 0.3s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#7B2FBE"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#7B2FBE"; }}
            >
              Hire Me
            </a>
          </div>
        )}

        {/* Hamburger — Mobile */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent", border: "1px solid rgba(123,47,190,0.4)",
              borderRadius: "6px", padding: "8px 10px", cursor: "pointer",
              display: "flex", flexDirection: "column", gap: "5px",
              alignItems: "center", justifyContent: "center",
            }}
          >
            <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "#C084FC" : "#9ca3af", transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "#C084FC" : "#9ca3af", transition: "all 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "22px", height: "2px", background: menuOpen ? "#C084FC" : "#9ca3af", transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
          </button>
        )}
      </nav>

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: "fixed", top: "61px", left: 0, right: 0, zIndex: 99,
            background: "rgba(0,0,0,0.97)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(123,47,190,0.2)",
            padding: "16px 24px 28px",
            display: "flex", flexDirection: "column", gap: "4px",
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={"#" + link.toLowerCase()}
              onClick={(e) => handleNavClick(e, link)}
              style={{
                fontSize: "13px", color: "#9ca3af", textDecoration: "none",
                letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "500",
                padding: "14px 0", borderBottom: "1px solid rgba(123,47,190,0.1)",
                transition: "color 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#C084FC")}
              onMouseLeave={(e) => (e.target.style.color = "#9ca3af")}
            >
              {link}
            </a>
          ))}

          {/* Mobile Play With Me */}
          <a
            href="/play"
            style={{
              marginTop: "12px", padding: "14px 24px", fontSize: "12px",
              letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "600",
              color: "#4ade80", border: "1px solid #4ade8050",
              borderRadius: "6px", textDecoration: "none", textAlign: "center",
              background: "#4ade8010",
            }}
          >
            🎮 Play With Me
          </a>

          {/* Mobile Hire Me */}
          <a
            href="#contact"
            onClick={handleHireClick}
            style={{
              marginTop: "8px", padding: "14px 24px", fontSize: "12px",
              letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: "600",
              color: "#ffffff", background: "linear-gradient(135deg, #7B2FBE, #C084FC)",
              borderRadius: "6px", textDecoration: "none", textAlign: "center",
            }}
          >
            Hire Me
          </a>
        </div>
      )}
    </>
  );
};

export default Navbar;