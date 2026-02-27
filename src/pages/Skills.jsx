import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const allSkills = [
  { name:"React",        color:"#61DAFB", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name:"Next.js",      color:"#ffffff", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  { name:"TypeScript",   color:"#3178C6", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  { name:"JavaScript",   color:"#F7DF1E", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name:"Tailwind",     color:"#38BDF8", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  { name:"HTML",         color:"#E34F26", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name:"CSS",          color:"#1572B6", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name:"Redux",        color:"#764ABC", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  { name:"Node.js",      color:"#539E43", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name:"Express",      color:"#a3e635", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  { name:"MySQL",        color:"#4479A1", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  { name:"Git",          color:"#F05032", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  { name:"GitHub",       color:"#ffffff", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  { name:"Vercel",       color:"#ffffff", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
  { name:"Photoshop",    color:"#31A8FF", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-original.svg" },
  { name:"After Effects",color:"#FF9A00", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg" },
  { name:"Axios",        color:"#5A29E4", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/axios/axios-plain.svg" },
  { name:"MUI",          color:"#007FFF", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/materialui/materialui-original.svg" },
  { name:"Three.js",     color:"#a78bfa", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/threejs/threejs-original.svg" },
  { name:"Premiere",     color:"#9999FF", icon:"https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg" },
];

const categories = [
  { name:"Frontend",       color:"#C084FC" },
  { name:"Backend",        color:"#7B2FBE" },
  { name:"AI & Animation", color:"#4ade80" },
  { name:"Tools",          color:"#38BDF8" },
  { name:"Design",         color:"#FB923C" },
];

const INVERT = new Set(["Next.js","GitHub","Express","Three.js","Vercel"]);

const OrbitRing = ({ skills, radius, duration, iconSize, imgSize, sectionVisible }) => {
  const ringRef  = useRef(null);
  const isPaused = useRef(false);
  const rotation = useRef(0);
  const rafRef   = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const speed = 360 / (duration * 60);
    const tick = () => {
      if (!isPaused.current && sectionVisible && ring) {
        rotation.current += speed;
        ring.style.transform = `translate(-50%,-50%) rotate(${rotation.current}deg)`;
        ring.style.setProperty("--counter-rot", `${-rotation.current}deg`);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [duration, sectionVisible]);

  useEffect(() => {
    const nodes = ringRef.current?.querySelectorAll(".skill-node");
    if (!nodes?.length) return;
    gsap.set(nodes, { scale: 0, opacity: 0 });
    const t = setTimeout(() => {
      gsap.to(nodes, { scale:1, opacity:1, duration:0.4, ease:"back.out(1.7)", stagger:0.025 });
    }, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <style>{`.ico-inner { transform: rotate(var(--counter-rot, 0deg)); will-change: transform; } .skill-orbit-ring { will-change: transform; }`}</style>
      <div ref={ringRef} className="skill-orbit-ring"
        style={{ position:"absolute", top:"50%", left:"50%", width:`${radius*2}px`, height:`${radius*2}px`, transform:"translate(-50%,-50%)", borderRadius:"50%", pointerEvents:"none", zIndex:10 }}
      >
        {skills.map((skill, i) => {
          const angle = (i / skills.length) * 360;
          const rad   = (angle * Math.PI) / 180;
          const x = 50 + Math.cos(rad) * 50;
          const y = 50 + Math.sin(rad) * 50;
          return (
            <div key={skill.name} className="skill-node"
              style={{ position:"absolute", left:`${x}%`, top:`${y}%`, transform:"translate(-50%,-50%)", zIndex:10, pointerEvents:"all" }}
            >
              <div className="ico-inner" style={{ display:"inline-block" }}>
                <div title={skill.name}
                  style={{ width:`${iconSize}px`, height:`${iconSize}px`, borderRadius:"50%", background:"rgba(5,5,15,0.92)", border:`1.5px solid ${skill.color}50`, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 12px ${skill.color}25`, transition:"all 0.25s ease", cursor:"none", padding:`${Math.round(iconSize*0.21)}px` }}
                  onMouseEnter={e => { isPaused.current=true; e.currentTarget.style.background=`${skill.color}20`; e.currentTarget.style.boxShadow=`0 0 24px ${skill.color}80,0 0 48px ${skill.color}35`; e.currentTarget.style.borderColor=skill.color; e.currentTarget.style.transform="scale(1.3)"; }}
                  onMouseLeave={e => { isPaused.current=false; e.currentTarget.style.background="rgba(5,5,15,0.92)"; e.currentTarget.style.boxShadow=`0 0 12px ${skill.color}25`; e.currentTarget.style.borderColor=`${skill.color}50`; e.currentTarget.style.transform="scale(1)"; }}
                >
                  <img src={skill.icon} alt={skill.name}
                    style={{ width:`${imgSize}px`, height:`${imgSize}px`, objectFit:"contain", filter:INVERT.has(skill.name)?"invert(1)":"none", pointerEvents:"none" }}
                    onError={e => { e.target.outerHTML=`<span style="font-size:9px;font-weight:800;color:${skill.color}">${skill.name.slice(0,2).toUpperCase()}</span>`; }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

const Skills = () => {
  const sectionRef = useRef(null);
  const titleRef   = useRef(null);
  const orbitRef   = useRef(null);
  const legendRef  = useRef(null);
  const [dims, setDims]                     = useState({ mobile:false, tablet:false });
  const [sectionVisible, setSectionVisible] = useState(false);
  const [splineLoaded, setSplineLoaded]     = useState(false);

  useEffect(() => {
    const check = () => setDims({ mobile:window.innerWidth<640, tablet:window.innerWidth>=640&&window.innerWidth<1024 });
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ One observer — controls RAF pause AND lazy-loads Spline
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const obs = new IntersectionObserver(([e]) => {
      const visible = e.isIntersecting;
      setSectionVisible(visible);
      if (visible) setSplineLoaded(true); // load once, never unload
    }, { threshold: 0.05 });
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const cleanups = [];
    const words = titleRef.current?.querySelectorAll(".sk-word");
    if (words?.length) {
      const r = titleRef.current.getBoundingClientRect();
      if (r.top < window.innerHeight) { gsap.set(words, { opacity:1, y:0 }); }
      else {
        gsap.set(words, { opacity:0, y:50 });
        const obs = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; obs.disconnect(); gsap.to(words, { opacity:1, y:0, duration:0.8, ease:"power3.out", stagger:0.1 }); }, { threshold:0.1 });
        obs.observe(titleRef.current);
        cleanups.push(() => obs.disconnect());
      }
    }
    if (orbitRef.current) {
      const r = orbitRef.current.getBoundingClientRect();
      if (r.top < window.innerHeight) { gsap.set(orbitRef.current, { opacity:1, scale:1 }); }
      else {
        gsap.set(orbitRef.current, { opacity:0, scale:0.92 });
        const obs = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; obs.disconnect(); gsap.to(orbitRef.current, { opacity:1, scale:1, duration:1, ease:"power3.out" }); }, { threshold:0.05 });
        obs.observe(orbitRef.current);
        cleanups.push(() => obs.disconnect());
      }
    }
    const pills = legendRef.current?.querySelectorAll(".cat-pill");
    if (pills?.length) {
      const r = legendRef.current.getBoundingClientRect();
      if (r.top < window.innerHeight) { gsap.set(pills, { opacity:1, y:0 }); }
      else {
        gsap.set(pills, { opacity:0, y:20 });
        const obs = new IntersectionObserver(([e]) => { if (!e.isIntersecting) return; obs.disconnect(); gsap.to(pills, { opacity:1, y:0, duration:0.5, ease:"power3.out", stagger:0.07 }); }, { threshold:0.1 });
        obs.observe(legendRef.current);
        cleanups.push(() => obs.disconnect());
      }
    }
    return () => cleanups.forEach(fn => fn());
  }, []);

  const { mobile, tablet } = dims;
  const robotW      = mobile?"180px":tablet?"300px":"460px";
  const robotH      = mobile?"240px":tablet?"380px":"600px";
  const orbitRadius = mobile?155:tablet?220:340;
  const orbitHeight = mobile?"460px":tablet?"620px":"880px";
  const iconSize    = mobile?38:tablet?44:52;
  const imgSize     = mobile?18:tablet?22:26;

  return (
    <section id="skills" ref={sectionRef} style={{ position:"relative", minHeight:"100vh", width:"100%", backgroundColor:"#000000", overflow:"hidden", paddingBottom:"80px" }}>
      <style>{`.sk-word{display:inline-block}`}</style>
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(123,47,190,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(123,47,190,0.04) 1px,transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:mobile?"300px":"600px", height:mobile?"300px":"600px", background:"radial-gradient(circle,rgba(123,47,190,0.2) 0%,transparent 65%)", filter:"blur(60px)", pointerEvents:"none" }}/>

      <div style={{ textAlign:"center", paddingTop:mobile?"90px":"120px", paddingBottom:"10px", position:"relative", zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"16px", marginBottom:"20px" }}>
          <div style={{ width:"40px", height:"1px", backgroundColor:"#7B2FBE" }}/>
          <p style={{ fontSize:"11px", color:"#7B2FBE", letterSpacing:"0.4em", textTransform:"uppercase", margin:0 }}>Arsenal</p>
          <div style={{ width:"40px", height:"1px", backgroundColor:"#7B2FBE" }}/>
        </div>
        <h2 ref={titleRef} style={{ fontSize:"clamp(28px,5vw,64px)", fontWeight:"800", color:"#ffffff", lineHeight:1.1, margin:0 }}>
          <span className="sk-word">My&nbsp;</span>
          <span className="sk-word" style={{ background:"linear-gradient(135deg,#7B2FBE,#C084FC)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Skills&nbsp;</span>
          <span className="sk-word">&amp; Tech</span>
        </h2>
        <p style={{ color:"#4b5563", fontSize:mobile?"11px":"13px", marginTop:"12px", letterSpacing:"0.15em" }}>
          {mobile ? "Tap icons to interact" : "Hover icons to pause • Click robot to interact"}
        </p>
      </div>

      <div ref={orbitRef} style={{ position:"relative", width:"100%", height:orbitHeight }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", width:`${orbitRadius*2}px`, height:`${orbitRadius*2}px`, transform:"translate(-50%,-50%)", borderRadius:"50%", border:"1px dashed rgba(123,47,190,0.22)", pointerEvents:"none", zIndex:1 }}/>
        <OrbitRing skills={allSkills} radius={orbitRadius} duration={30} iconSize={iconSize} imgSize={imgSize} sectionVisible={sectionVisible} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:robotW, height:robotH, zIndex:5 }}>
          <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"60px", background:"#000000", zIndex:20, pointerEvents:"none" }}/>
          <div style={{ position:"absolute", bottom:0, right:0, width:"160px", height:"60px", background:"#000000", zIndex:21, pointerEvents:"none" }}/>
          {splineLoaded ? (
            <iframe src="https://my.spline.design/nexbotrobotcharacterconcept-gqClXjO79eVShzYrLeILrrqw/" frameBorder="0" title="NEXBOT" style={{ width:"100%", height:"100%", border:"none", marginBottom:"-60px" }} allowFullScreen />
          ) : (
            <div style={{ width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <div style={{ width:"60px", height:"60px", borderRadius:"50%", border:"2px solid rgba(123,47,190,0.4)", borderTopColor:"#7B2FBE", animation:"spin 1s linear infinite" }}/>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      </div>

      <div ref={legendRef} style={{ display:"flex", justifyContent:"center", gap:mobile?"8px":"12px", flexWrap:"wrap", padding:mobile?"0 16px 20px":"0 40px 20px", position:"relative", zIndex:10 }}>
        {categories.map(cat => (
          <div key={cat.name} className="cat-pill"
            style={{ display:"flex", alignItems:"center", gap:"8px", padding:mobile?"6px 12px":"7px 18px", border:`1px solid ${cat.color}40`, borderRadius:"999px", background:`${cat.color}10`, transition:"all 0.3s", cursor:"none" }}
            onMouseEnter={e => { e.currentTarget.style.background=`${cat.color}25`; e.currentTarget.style.borderColor=`${cat.color}80`; }}
            onMouseLeave={e => { e.currentTarget.style.background=`${cat.color}10`; e.currentTarget.style.borderColor=`${cat.color}40`; }}
          >
            <div style={{ width:"7px", height:"7px", borderRadius:"50%", backgroundColor:cat.color, boxShadow:`0 0 6px ${cat.color}` }}/>
            <span style={{ fontSize:mobile?"10px":"11px", color:cat.color, fontWeight:"600", letterSpacing:"0.15em", textTransform:"uppercase" }}>{cat.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;