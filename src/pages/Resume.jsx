import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const onEnter = (el, cb) => {
  if (!el) return () => {};
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight) { cb(); return () => {}; }
  const obs = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; obs.disconnect(); cb();
  }, { threshold: 0.05 });
  obs.observe(el);
  return () => obs.disconnect();
};

const resumeData = {
  education: [
    { title: "B.Tech Computer Science & Engineering", place: "Dayananda Sagar College of Engineering", period: "2024 – 2028", location: "Bengaluru, India", desc: "Currently pursuing undergraduate degree with focus on software development, data structures, and algorithms.", color: "#C084FC" },
  ],
  experience: [
    { title: "Full Stack Developer", place: "Freelance / Personal Projects", period: "2024 – Present", location: "Remote", desc: "Building full-stack web applications, creative portfolios, and AI-powered tools for clients and personal projects.", color: "#4ade80" },
    { title: "n8n Automation Developer", place: "Personal & Client Workflows", period: "Nov 2025 – Present", location: "Remote", desc: "Designing and deploying AI automation pipelines using n8n, connecting APIs and building intelligent workflows.", color: "#38BDF8" },
  ],
  skills: {
    "Frontend":   ["React","Next.js","TypeScript","JavaScript","Tailwind CSS","Redux","MUI","HTML","CSS"],
    "Backend":    ["Node.js","Express.js","MySQL"],
    "Creative":   ["Three.js","GSAP","Lenis","React Three Fiber"],
    "AI & Tools": ["n8n","Git","GitHub","Vercel","Axios"],
    "Design":     ["Photoshop","Premiere Pro","After Effects"],
  },
  projects: [
    { name: "Portfolio Website",   tech: "React · Three.js · GSAP",    desc: "Interactive creative developer portfolio with 3D animations, smooth scroll, and AI chatbot." },
    { name: "Real-Time Chat App",  tech: "React · Node.js · Socket.io", desc: "Full-stack real-time messaging application with rooms, typing indicators, and online presence." },
    { name: "E-Commerce Platform", tech: "React · Express · MySQL",     desc: "Complete e-commerce solution with product catalog, cart, checkout, and admin dashboard." },
    { name: "AI Automation Flows", tech: "n8n · OpenAI · Webhooks",    desc: "Intelligent workflow automations connecting multiple APIs for business process optimization." },
  ],
};

const RESUME_PDF_URL = "/resume.pdf";

const Resume = () => {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const contentRef = useRef(null);
  const animated   = useRef(false);
  const [activeTab, setActiveTab] = useState("experience");
  const [isMobile,  setIsMobile]  = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const words = titleRef.current?.querySelectorAll(".rv-word");
    if (words?.length) gsap.set(words, { opacity: 0, y: 50 });
    if (contentRef.current) gsap.set(contentRef.current, { opacity: 0, y: 30 });
    return onEnter(section, () => {
      if (animated.current) return;
      animated.current = true;
      if (words?.length) gsap.to(words, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.09 });
      if (contentRef.current) gsap.to(contentRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: 0.2 });
    });
  }, []);

  const tabs = ["experience", "education", "skills", "projects"];

  return (
    <section id="resume" ref={sectionRef} style={{ position:"relative", minHeight:"100vh", width:"100%", backgroundColor:"#000000", overflow:"hidden", paddingBottom:"100px" }}>
      <style>{`
        .rv-word { display: inline-block; }
        .rv-tab { transition: all 0.2s ease; cursor: pointer; }
        .rv-tab:hover { color: #C084FC !important; }
        .rv-card { transition: all 0.3s ease; }
        .rv-card:hover { border-color: rgba(123,47,190,0.5) !important; transform: translateY(-3px); }
        .rv-skill-tag { transition: all 0.2s; cursor: default; }
        .rv-skill-tag:hover { transform: scale(1.08); }
      `}</style>

      {/* BG */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(123,47,190,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(123,47,190,0.03) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"400px", background:"radial-gradient(circle,rgba(123,47,190,0.12) 0%,transparent 70%)", filter:"blur(80px)", pointerEvents:"none" }}/>

      {/* Header */}
      <div style={{ textAlign:"center", paddingTop:isMobile?"90px":"120px", paddingBottom:"50px", position:"relative", zIndex:2 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", marginBottom:"20px" }}>
          <div style={{ width:"40px", height:"1px", backgroundColor:"#7B2FBE" }}/>
          <p style={{ fontSize:"11px", color:"#7B2FBE", letterSpacing:"0.4em", textTransform:"uppercase" }}>Resume</p>
          <div style={{ width:"40px", height:"1px", backgroundColor:"#7B2FBE" }}/>
        </div>
        <h2 ref={titleRef} style={{ fontSize:"clamp(28px,5vw,64px)", fontWeight:"800", color:"#ffffff", lineHeight:1.1, padding:"0 16px" }}>
          <span className="rv-word">My&nbsp;</span>
          <span className="rv-word" style={{ background:"linear-gradient(135deg,#7B2FBE,#C084FC)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Background&nbsp;</span>
          <span className="rv-word">&amp; Skills</span>
        </h2>

        {/* ✅ View Resume — opens PDF in new tab, browser handles download option */}
        <a
          href={RESUME_PDF_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display:"inline-flex", alignItems:"center", gap:"10px", marginTop:"28px", padding:"12px 32px", background:"linear-gradient(135deg,#7B2FBE,#C084FC)", borderRadius:"8px", color:"#ffffff", fontWeight:"700", fontSize:"13px", letterSpacing:"0.1em", textDecoration:"none", boxShadow:"0 0 30px rgba(123,47,190,0.35)", transition:"all 0.3s" }}
          onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 0 40px rgba(123,47,190,0.5)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)"; e.currentTarget.style.boxShadow="0 0 30px rgba(123,47,190,0.35)"; }}
        >
          <span>📄</span> View Resume
        </a>
      </div>

      {/* Content */}
      <div ref={contentRef} style={{ maxWidth:"900px", margin:"0 auto", padding:isMobile?"0 16px":"0 40px", position:"relative", zIndex:2 }}>

        {/* Tabs */}
        <div style={{ display:"flex", gap:"4px", marginBottom:"36px", background:"rgba(255,255,255,0.03)", borderRadius:"12px", padding:"4px", border:"1px solid rgba(123,47,190,0.15)", flexWrap:"wrap" }}>
          {tabs.map(tab => (
            <button key={tab} className="rv-tab"
              onClick={() => setActiveTab(tab)}
              style={{ flex:1, minWidth:isMobile?"calc(50% - 4px)":"auto", padding:"10px 16px", borderRadius:"8px", border:"none", background:activeTab===tab?"linear-gradient(135deg,#7B2FBE,#C084FC)":"transparent", color:activeTab===tab?"#ffffff":"#6b7280", fontSize:"12px", fontWeight:"700", letterSpacing:"0.15em", textTransform:"uppercase", transition:"all 0.2s" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Experience */}
        {activeTab==="experience" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
            {resumeData.experience.map((item,i) => (
              <div key={i} className="rv-card" style={{ padding:"28px", background:"rgba(8,8,8,0.9)", border:"1px solid rgba(123,47,190,0.2)", borderRadius:"16px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:`linear-gradient(to right,${item.color},${item.color}40,transparent)` }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px", flexWrap:"wrap" }}>
                  <div>
                    <h3 style={{ color:"#ffffff", fontWeight:"800", fontSize:"17px", marginBottom:"4px" }}>{item.title}</h3>
                    <p style={{ color:item.color, fontSize:"13px", fontWeight:"600" }}>{item.place}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <p style={{ color:"#C084FC", fontSize:"12px", fontWeight:"600", background:"rgba(123,47,190,0.15)", padding:"4px 12px", borderRadius:"999px", border:"1px solid rgba(123,47,190,0.3)" }}>{item.period}</p>
                    <p style={{ color:"#6b7280", fontSize:"11px", marginTop:"6px" }}>📍 {item.location}</p>
                  </div>
                </div>
                <p style={{ color:"#9ca3af", fontSize:"13px", lineHeight:"1.8", marginTop:"14px" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {activeTab==="education" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
            {resumeData.education.map((item,i) => (
              <div key={i} className="rv-card" style={{ padding:"28px", background:"rgba(8,8,8,0.9)", border:"1px solid rgba(123,47,190,0.2)", borderRadius:"16px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"3px", background:`linear-gradient(to right,${item.color},${item.color}40,transparent)` }}/>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"16px", flexWrap:"wrap" }}>
                  <div>
                    <h3 style={{ color:"#ffffff", fontWeight:"800", fontSize:"17px", marginBottom:"4px" }}>{item.title}</h3>
                    <p style={{ color:item.color, fontSize:"13px", fontWeight:"600" }}>{item.place}</p>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <p style={{ color:"#C084FC", fontSize:"12px", fontWeight:"600", background:"rgba(123,47,190,0.15)", padding:"4px 12px", borderRadius:"999px", border:"1px solid rgba(123,47,190,0.3)" }}>{item.period}</p>
                    <p style={{ color:"#6b7280", fontSize:"11px", marginTop:"6px" }}>📍 {item.location}</p>
                  </div>
                </div>
                <p style={{ color:"#9ca3af", fontSize:"13px", lineHeight:"1.8", marginTop:"14px" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {activeTab==="skills" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"24px" }}>
            {Object.entries(resumeData.skills).map(([cat, skills]) => (
              <div key={cat} className="rv-card" style={{ padding:"24px", background:"rgba(8,8,8,0.9)", border:"1px solid rgba(123,47,190,0.2)", borderRadius:"16px" }}>
                <h3 style={{ color:"#7B2FBE", fontSize:"11px", letterSpacing:"0.3em", textTransform:"uppercase", fontWeight:"700", marginBottom:"16px" }}>{cat}</h3>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"8px" }}>
                  {skills.map(skill => (
                    <span key={skill} className="rv-skill-tag" style={{ padding:"6px 14px", background:"rgba(123,47,190,0.12)", border:"1px solid rgba(123,47,190,0.3)", borderRadius:"6px", color:"#C084FC", fontSize:"12px", fontWeight:"600" }}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {activeTab==="projects" && (
          <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:"20px" }}>
            {resumeData.projects.map((proj,i) => (
              <div key={i} className="rv-card" style={{ padding:"24px", background:"rgba(8,8,8,0.9)", border:"1px solid rgba(123,47,190,0.2)", borderRadius:"16px", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(to right,#7B2FBE,#C084FC,transparent)" }}/>
                <h3 style={{ color:"#ffffff", fontWeight:"800", fontSize:"15px", marginBottom:"6px" }}>{proj.name}</h3>
                <p style={{ color:"#7B2FBE", fontSize:"11px", letterSpacing:"0.1em", marginBottom:"12px", fontWeight:"600" }}>{proj.tech}</p>
                <p style={{ color:"#9ca3af", fontSize:"12px", lineHeight:"1.7" }}>{proj.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Resume;