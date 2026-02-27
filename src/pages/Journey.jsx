import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import ScrollRocket from "../components/ScrollRocket";

const journeyData = [
  { year:"August 2024",   title:"The Beginning",      subtitle:"Where It All Started",    description:"Arrived at college with Python basics already in hand. Started B.Tech CSE at Dayananda Sagar College of Engineering, Bengaluru. The first line of code that changed everything.",                                                                tags:["Python","HTML","CSS","B.Tech CSE"],                  color:"#38BDF8", icon:"🚀" },
  { year:"September 2024",title:"Frontend Developer",  subtitle:"React & Modern UI",        description:"Learned C programming alongside frontend development. Built first real pages — Climate App, Blog, and Login UI. Discovered the power of React, Tailwind CSS, and JavaScript.",                                                                  tags:["C","React","Tailwind","JavaScript","HTML","CSS"],    color:"#facc15", icon:"⚛️" },
  { year:"January 2025",  title:"Going Deeper",        subtitle:"Advanced Frontend",        description:"Leveled up to C++ while going deeper into frontend. Mastered TypeScript, Redux, MUI, and Axios. Started building more complex UI components and state management.",                                                                             tags:["C++","TypeScript","Redux","MUI","Axios"],             color:"#C084FC", icon:"💻" },
  { year:"June 2025",     title:"Full Stack Developer",subtitle:"Backend & Real Projects",  description:"Crossed into backend territory with Node.js, Express.js, and MySQL. Built real full-stack projects — a Chat App and an E-Commerce platform from scratch.",                                                                                       tags:["Node.js","Express.js","MySQL","Chat App","E-Commerce"],color:"#4ade80", icon:"🔥" },
  { year:"August 2025",   title:"Creative Dev",        subtitle:"3D & Interactive UI",      description:"Discovered the world of creative development. Started building immersive 3D experiences with Three.js, GSAP animations, Lenis smooth scroll, and React Three Fiber.",                                                                            tags:["Three.js","GSAP","Lenis","React Three Fiber"],        color:"#7B2FBE", icon:"✨" },
  { year:"November 2025", title:"AI & Automation",     subtitle:"n8n Workflows",            description:"Stepped into AI automation with n8n, building intelligent workflows. Connecting apps, automating processes, and exploring the power of AI-powered pipelines.",                                                                                    tags:["n8n","AI Workflows","Automation"],                    color:"#FB923C", icon:"🤖" },
  { year:"February 2026", title:"Design Era",          subtitle:"Currently Learning",       description:"Expanding into visual design. Currently learning Photoshop, Premiere Pro and After Effects — bridging the gap between development and design.",                                                                                                   tags:["Photoshop","Premiere Pro","After Effects"],           color:"#C084FC", icon:"🎨" },
];

const Journey = () => {
  const sectionRef     = useRef(null);
  const titleRef       = useRef(null);
  const cursorGlowRef  = useRef(null);
  const cardRefs       = useRef([]);
  const titleAnimated  = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const glow    = cursorGlowRef.current;
    if (!section || !glow) return;
    const move = e => {
      const r = section.getBoundingClientRect();
      gsap.to(glow, { x: e.clientX - r.left - 200, y: e.clientY - r.top - 200, duration: 0.8, ease: "power2.out" });
    };
    section.addEventListener("mousemove", move);
    return () => section.removeEventListener("mousemove", move);
  }, [isMobile]);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const words = title.querySelectorAll(".jn-word");
    if (!words.length) return;
    gsap.set(words, { opacity: 0, y: 60 });

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || titleAnimated.current) return;
      titleAnimated.current = true;
      obs.disconnect();
      gsap.to(words, { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", stagger: 0.09 });
    }, { threshold: 0.1 });
    obs.observe(title);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const mob = window.innerWidth < 1024;
    const cleanups = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const isLeft = i % 2 === 0;
      gsap.set(card, { opacity: 0, x: mob ? 0 : (isLeft ? -80 : 80), y: mob ? 40 : 0 });

      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        gsap.to(card, { opacity: 1, x: 0, y: 0, duration: 0.9, ease: "power3.out" });

        const topBar = card.querySelector(".top-bar");
        if (topBar) gsap.fromTo(topBar, { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.7, ease: "power3.out", delay: 0.2 });

        const icon = card.querySelector(".card-icon");
        if (icon) gsap.fromTo(icon, { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2)", delay: 0.15 });

        const tags = card.querySelectorAll(".tag");
        if (tags.length) gsap.fromTo(tags, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.05, delay: 0.35 });
      }, { threshold: 0.1 });

      obs.observe(card);
      cleanups.push(() => obs.disconnect());
    });

    return () => cleanups.forEach(fn => fn());
  }, [isMobile]);

  return (
    <section id="journey" ref={sectionRef} style={{position:"relative",minHeight:"100vh",width:"100%",backgroundColor:"#000000",overflow:"hidden",paddingBottom:"120px"}}>
      <style>{`
        .jn-word{display:inline-block}
        .journey-card{transition:transform 0.3s ease,border-color 0.3s ease,box-shadow 0.3s ease}
        .journey-card:hover{transform:translateY(-8px) scale(1.01) !important}
        .tag{transition:all 0.2s ease}
        .tag:hover{transform:scale(1.1)}
        .journey-row{display:flex;position:relative;align-items:center;}
        @media(max-width:1023px){.journey-row{justify-content:center !important}.journey-card-wrap{width:100% !important;max-width:600px}}
        .journey-cards-outer{max-width:1200px;margin:0 auto;padding:0 60px;display:flex;flex-direction:column;gap:50px}
        @media(max-width:767px){.journey-cards-outer{padding:0 16px;gap:28px}}
        @media(min-width:768px) and (max-width:1023px){.journey-cards-outer{padding:0 40px;gap:36px}}
        .journey-header{padding-top:120px;padding-bottom:80px}
        @media(max-width:767px){.journey-header{padding-top:90px;padding-bottom:50px}}
      `}</style>

      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(123,47,190,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(123,47,190,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}}/>

      {!isMobile && (
        <div ref={cursorGlowRef} style={{position:"absolute",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(123,47,190,0.18) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none",zIndex:0,top:0,left:0}}/>
      )}

      <ScrollRocket sectionRef={sectionRef} />

      <div className="journey-header" style={{position:"relative",zIndex:2,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"16px",marginBottom:"20px"}}>
          <div style={{width:"40px",height:"1px",backgroundColor:"#7B2FBE"}}/>
          <p style={{fontSize:"11px",color:"#7B2FBE",letterSpacing:"0.4em",textTransform:"uppercase"}}>My Journey</p>
          <div style={{width:"40px",height:"1px",backgroundColor:"#7B2FBE"}}/>
        </div>
        <h2 ref={titleRef} style={{fontSize:"clamp(28px,5vw,64px)",fontWeight:"800",color:"#ffffff",lineHeight:1.1,padding:"0 16px"}}>
          <span className="jn-word">From&nbsp;</span>
          <span className="jn-word">Zero&nbsp;</span>
          <span className="jn-word">To&nbsp;</span>
          <span className="jn-word" style={{background:"linear-gradient(135deg,#7B2FBE,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Full&nbsp;</span>
          <span className="jn-word" style={{background:"linear-gradient(135deg,#7B2FBE,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Stack</span>
        </h2>
      </div>

      <div className="journey-cards-outer" style={{position:"relative",zIndex:2}}>
        {journeyData.map((item, index) => {
          const isLeft = index % 2 === 0;
          return (
            <div key={index} className="journey-row" style={{justifyContent: isLeft ? "flex-start" : "flex-end"}}>

              {/* Card */}
              <div
                ref={el => (cardRefs.current[index] = el)}
                className="journey-card journey-card-wrap"
                style={{width:"44%",background:"rgba(8,8,8,0.9)",border:`1px solid ${item.color}25`,borderRadius:"16px",padding:"28px",backdropFilter:"blur(20px)",position:"relative",overflow:"hidden",boxSizing:"border-box"}}
              >
                <div className="top-bar" style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:`linear-gradient(to right,${item.color},${item.color}40,transparent)`}}/>

                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
                    <div className="card-icon" style={{width:"42px",height:"42px",borderRadius:"10px",background:`${item.color}15`,border:`1px solid ${item.color}40`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>{item.icon}</div>
                    <div>
                      <p style={{fontSize:"11px",color:item.color,letterSpacing:"0.25em",textTransform:"uppercase"}}>{item.year}</p>
                      <p style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>{item.subtitle}</p>
                    </div>
                  </div>
                  <div style={{width:"30px",height:"30px",borderRadius:"50%",border:`1px solid ${item.color}40`,display:"flex",alignItems:"center",justifyContent:"center",color:item.color,fontSize:"11px",fontWeight:"700",flexShrink:0}}>
                    {String(index+1).padStart(2,"0")}
                  </div>
                </div>

                <h3 style={{fontSize:"clamp(16px,2.5vw,20px)",fontWeight:"800",color:"#ffffff",marginBottom:"10px"}}>{item.title}</h3>
                <p style={{fontSize:"13px",color:"#9ca3af",lineHeight:"1.85",marginBottom:"18px"}}>{item.description}</p>

                <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                  {item.tags.map(tag => (
                    <span key={tag} className="tag" style={{fontSize:"10px",color:item.color,background:`${item.color}12`,border:`1px solid ${item.color}30`,borderRadius:"4px",padding:"3px 8px",cursor:"default"}}>{tag}</span>
                  ))}
                </div>
                <div style={{position:"absolute",bottom:0,right:0,width:"100px",height:"100px",background:`radial-gradient(circle,${item.color}15 0%,transparent 70%)`,pointerEvents:"none"}}/>
              </div>


            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Journey;