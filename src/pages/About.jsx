import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import profileImg from "../assets/profile.jpeg";
import { projectCount } from "../data/projectsData";

// Animate element: if already in viewport → show instantly, else fade in on enter
const animateOnEnter = (el, fromVars, toVars) => {
  if (!el) return () => {};
  const rect = el.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) {
    // already visible — just show it, no animation needed
    gsap.set(el, toVars);
    return () => {};
  }
  gsap.set(el, fromVars);
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    gsap.to(el, { ...toVars, duration: 0.8, ease: "power3.out" });
  }, { threshold: 0.05 });
  obs.observe(el);
  return () => obs.disconnect();
};

const animateChildrenOnEnter = (container, selector, fromVars, toVars, stagger = 0.1) => {
  if (!container) return () => {};
  const els = container.querySelectorAll(selector);
  if (!els.length) return () => {};
  const rect = container.getBoundingClientRect();
  const inView = rect.top < window.innerHeight && rect.bottom > 0;
  if (inView) {
    gsap.set(els, toVars);
    return () => {};
  }
  gsap.set(els, fromVars);
  const obs = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    obs.disconnect();
    gsap.to(els, { ...toVars, duration: 0.75, ease: "power3.out", stagger });
  }, { threshold: 0.05 });
  obs.observe(container);
  return () => obs.disconnect();
};

const terminalLines = [
  { prefix:"$ ", text:"whoami",                                       color:"#C084FC", delay:0   },
  { prefix:"> ", text:"K. Krishna Chaitanya",                         color:"#ffffff", delay:0.5 },
  { prefix:"$ ", text:"cat role.txt",                                 color:"#C084FC", delay:1.2 },
  { prefix:"> ", text:"Full Stack Developer & Creative Technologist",  color:"#4ade80", delay:1.7 },
  { prefix:"$ ", text:"cat education.txt",                            color:"#C084FC", delay:2.5 },
  { prefix:"> ", text:"B.Tech CSE — Dayananda Sagar, 2024-2028",      color:"#ffffff", delay:3.0 },
  { prefix:"$ ", text:"cat skills.txt",                               color:"#C084FC", delay:3.8 },
  { prefix:"> ", text:"React, Next.js, Node.js, Three.js, GSAP, n8n...",color:"#4ade80",delay:4.3},
  { prefix:"$ ", text:"cat location.txt",                             color:"#C084FC", delay:5.0 },
  { prefix:"> ", text:"Bengaluru, India 🇮🇳",                         color:"#facc15", delay:5.5 },
  { prefix:"$ ", text:"cat status.txt",                               color:"#C084FC", delay:6.2 },
  { prefix:"> ", text:"Open to opportunities ✓",                      color:"#4ade80", delay:6.7 },
  { prefix:"$ ", text:"_",                                             color:"#7B2FBE", delay:7.3, blink:true },
];

const TerminalLine = ({ line, started }) => {
  const [visible, setVisible] = useState(false);
  const [text,    setText]    = useState("");
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => {
      setVisible(true);
      let i = 0;
      const iv = setInterval(() => {
        setText(line.text.slice(0, i + 1)); i++;
        if (i >= line.text.length) clearInterval(iv);
      }, 28);
      return () => clearInterval(iv);
    }, line.delay * 1000);
    return () => clearTimeout(t);
  }, [started, line]);
  if (!visible) return null;
  return (
    <div style={{ display:"flex", gap:"8px", marginBottom:"8px" }}>
      <span style={{ color:"#7B2FBE", fontWeight:"700", flexShrink:0 }}>{line.prefix}</span>
      <span style={{ color:line.color, fontFamily:"monospace" }}>
        {text}
        {line.blink && <span style={{ display:"inline-block", width:"9px", height:"15px", backgroundColor:"#7B2FBE", marginLeft:"2px", animation:"blink 1s infinite", verticalAlign:"middle" }} />}
      </span>
    </div>
  );
};

const Counter = ({ target, suffix="" }) => {
  const [count, setCount] = useState(0);
  const ref  = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true; obs.disconnect();
      const num = parseInt(target); let s = 0;
      const iv = setInterval(() => {
        s += Math.ceil(num / 30);
        if (s >= num) { setCount(num); clearInterval(iv); } else setCount(s);
      }, 40);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
};

const About = () => {
  const sectionRef  = useRef(null);
  const leftRef     = useRef(null);
  const cardRef     = useRef(null);
  const glowRef     = useRef(null);
  const titleRef    = useRef(null);
  const terminalRef = useRef(null);
  const statsRef    = useRef(null);
  const lineDotRef  = useRef(null);
  const labelRef    = useRef(null);
  const [terminalStarted, setTerminalStarted] = useState(false);
  const [isMobile,  setIsMobile]  = useState(false);
  const [isTablet,  setIsTablet]  = useState(false);

  useEffect(() => {
    const upd = () => { setIsMobile(window.innerWidth<=768); setIsTablet(window.innerWidth>768&&window.innerWidth<=1024); };
    upd(); window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  useEffect(() => {
    const isSmall = window.innerWidth <= 1024;
    const cleanups = [];

    // label
    cleanups.push(animateOnEnter(labelRef.current, { opacity:0, x:-30 }, { opacity:1, x:0 }));

    // title words
    cleanups.push(animateChildrenOnEnter(titleRef.current, ".abt-word",
      { opacity:0, y:50, rotateX:-20 }, { opacity:1, y:0, rotateX:0 }, 0.09
    ));

    // terminal
    const termRect = terminalRef.current?.getBoundingClientRect();
    const termInView = termRect && termRect.top < window.innerHeight;
    if (termInView) {
      gsap.set(terminalRef.current, { opacity:1, y:0 });
      setTerminalStarted(true);
    } else {
      gsap.set(terminalRef.current, { opacity:0, y:40 });
      const obs = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return; obs.disconnect();
        gsap.to(terminalRef.current, { opacity:1, y:0, duration:0.9, ease:"power3.out" });
        setTerminalStarted(true);
      }, { threshold:0.05 });
      if (terminalRef.current) obs.observe(terminalRef.current);
      cleanups.push(() => obs.disconnect());
    }

    // stats
    cleanups.push(animateChildrenOnEnter(statsRef.current, ".stat-item",
      { opacity:0, y:25 }, { opacity:1, y:0 }, 0.1
    ));

    // left panel
    cleanups.push(animateOnEnter(leftRef.current,
      { opacity:0, x: isSmall?0:-50, y: isSmall?30:0 },
      { opacity:1, x:0, y:0 }
    ));

    // card
    const cardEl = cardRef.current;
    if (cardEl) {
      const r = cardEl.getBoundingClientRect();
      const inView = r.top < window.innerHeight;
      if (inView) {
        gsap.set(cardEl, { opacity:1, x:0, y:0 });
        gsap.to(cardEl, { y:-14, duration:2.5, ease:"sine.inOut", repeat:-1, yoyo:true });
      } else {
        gsap.set(cardEl, { opacity:0, x: isSmall?0:80, y: isSmall?30:0 });
        const obs = new IntersectionObserver(([e]) => {
          if (!e.isIntersecting) return; obs.disconnect();
          gsap.to(cardEl, { opacity:1, x:0, y:0, duration:1, ease:"power3.out",
            onComplete:() => gsap.to(cardEl, { y:-14, duration:2.5, ease:"sine.inOut", repeat:-1, yoyo:true }) });
        }, { threshold:0.05 });
        obs.observe(cardEl);
        cleanups.push(() => obs.disconnect());
      }
    }

    // dot pulse
    if (lineDotRef.current)
      gsap.to(lineDotRef.current, { scale:1.6, duration:0.9, repeat:-1, yoyo:true, ease:"sine.inOut" });

    return () => cleanups.forEach(fn => fn());
  }, []);

  const handleMouseMove = e => {
    if (window.innerWidth<=768 || !cardRef.current) return;
    const r  = cardRef.current.getBoundingClientRect();
    const rx = ((e.clientY-r.top   -r.height/2)/(r.height/2))*-18;
    const ry = ((e.clientX-r.left  -r.width/2 )/(r.width/2 ))* 18;
    gsap.to(cardRef.current, { rotateX:rx, rotateY:ry, duration:0.3, ease:"power2.out", transformPerspective:1000 });
    if (glowRef.current) glowRef.current.style.background =
      `radial-gradient(circle at ${((e.clientX-r.left)/r.width)*100}% ${((e.clientY-r.top)/r.height)*100}%, rgba(123,47,190,0.55) 0%, transparent 60%)`;
  };
  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    gsap.to(cardRef.current, { rotateX:0, rotateY:0, duration:0.8, ease:"elastic.out(1,0.5)" });
  };

  const isSmall = isMobile || isTablet;
  const stats = [
    { target:String(projectCount), suffix:"+",  label:"Projects Built" },
    { target:"5",                  suffix:"+",  label:"Tech Stacks"    },
    { target:"2",                  suffix:"nd", label:"Year B.Tech"    },
  ];

  return (
    <section id="about" ref={sectionRef} style={{ position:"relative", minHeight:"100vh", width:"100%", backgroundColor:"#000000", display:"flex", alignItems:"center", overflow:"hidden" }}>
      <style>{`
        @keyframes blink    { 0%,100%{opacity:1}50%{opacity:0} }
        @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)} }
        @keyframes scanline { 0%{top:0%}100%{top:100%} }
        .abt-word { display:inline-block; transform-origin:bottom; }
      `}</style>

      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(123,47,190,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(123,47,190,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"40%",left:"-100px",width:"400px",height:"400px",background:"radial-gradient(circle,rgba(123,47,190,0.2) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"30%",right:"-50px",width:"400px",height:"400px",background:"radial-gradient(circle,rgba(192,132,252,0.15) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>

      <div style={{ width:"100%", display:"flex", flexDirection:isSmall?"column":"row", alignItems:isSmall?"center":"stretch",
        padding:isMobile?"100px 24px 60px":isTablet?"100px 48px 60px":"120px 100px 100px 120px", gap:isSmall?"48px":"0px" }}>

        {/* LEFT */}
        <div ref={leftRef} style={{ flex:1, display:"flex", flexDirection:"column", gap:"28px", paddingRight:isSmall?"0":"60px", width:isSmall?"100%":"auto" }}>
          <div ref={labelRef} style={{ display:"flex", alignItems:"center", gap:"16px" }}>
            <div style={{ width:"40px", height:"1px", backgroundColor:"#7B2FBE" }}/>
            <p style={{ fontSize:"11px", color:"#7B2FBE", letterSpacing:"0.4em", textTransform:"uppercase" }}>About Me</p>
          </div>

          <h2 ref={titleRef} style={{ fontSize:isMobile?"clamp(28px,8vw,40px)":isTablet?"clamp(32px,5vw,46px)":"clamp(36px,4vw,54px)", fontWeight:"800", lineHeight:"1.15", color:"#ffffff", perspective:"400px" }}>
            <span className="abt-word">The&nbsp;</span>
            <span className="abt-word">Dev&nbsp;</span>
            <span className="abt-word">Behind&nbsp;</span><br/>
            <span className="abt-word" style={{background:"linear-gradient(135deg,#7B2FBE,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>The&nbsp;</span>
            <span className="abt-word" style={{background:"linear-gradient(135deg,#7B2FBE,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Code</span>
          </h2>

          <div ref={terminalRef} style={{ background:"#080808", border:"1px solid rgba(123,47,190,0.4)", borderRadius:"12px", overflow:"hidden", maxWidth:isSmall?"100%":"500px", boxShadow:"0 0 30px rgba(123,47,190,0.15)" }}>
            <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(123,47,190,0.2)", display:"flex", alignItems:"center", gap:"8px", background:"rgba(123,47,190,0.08)" }}>
              {["#ff5f57","#ffbd2e","#28c840"].map(c=><div key={c} style={{width:"12px",height:"12px",borderRadius:"50%",backgroundColor:c}}/>)}
              <span style={{color:"#6b7280",fontSize:"12px",marginLeft:"8px",fontFamily:"monospace"}}>krishna@portfolio ~ %</span>
            </div>
            <div style={{ padding:"20px 24px", fontSize:"13px", lineHeight:"1.6", minHeight:"280px" }}>
              {terminalLines.map((line,i) => <TerminalLine key={i} line={line} started={terminalStarted}/>)}
            </div>
          </div>

          <div ref={statsRef} style={{ display:"flex", gap:isMobile?"24px":"40px", flexWrap:"wrap" }}>
            {stats.map(s => (
              <div key={s.label} className="stat-item">
                <p style={{ fontSize:isMobile?"24px":"32px", fontWeight:"800", background:"linear-gradient(135deg,#7B2FBE,#C084FC)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", lineHeight:1 }}>
                  <Counter target={s.target} suffix={s.suffix}/>
                </p>
                <p style={{ fontSize:"10px", color:"#6b7280", letterSpacing:"0.15em", textTransform:"uppercase", marginTop:"6px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CENTER LINE */}
        {!isSmall && (
          <div style={{ width:"1px", alignSelf:"stretch", flexShrink:0, position:"relative", background:"linear-gradient(180deg,transparent 0%,rgba(124,58,237,0.5) 20%,rgba(192,132,252,0.8) 50%,rgba(124,58,237,0.5) 80%,transparent 100%)" }}>
            <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"26px", height:"26px", borderRadius:"50%", border:"1px solid rgba(192,132,252,0.25)" }}/>
            <div ref={lineDotRef} style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"12px", height:"12px", borderRadius:"50%", background:"#C084FC", boxShadow:"0 0 10px #C084FC,0 0 24px #A855F7", zIndex:5 }}/>
          </div>
        )}

        {/* RIGHT — photo card */}
        <div style={{ flex:isSmall?"none":1, display:"flex", justifyContent:"center", alignItems:"center", perspective:"1000px", paddingLeft:isSmall?"0":"60px", width:isSmall?"100%":"auto" }}>
          <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
            style={{ position:"relative", width:isMobile?"260px":isTablet?"300px":"340px", height:isMobile?"340px":isTablet?"390px":"450px", borderRadius:"20px", cursor:"pointer", transformStyle:"preserve-3d", boxShadow:"0 0 50px rgba(123,47,190,0.35)" }}>
            <div ref={glowRef} style={{ position:"absolute", inset:0, borderRadius:"20px", background:"radial-gradient(circle at 50% 50%,rgba(123,47,190,0.4) 0%,transparent 60%)", pointerEvents:"none", zIndex:2 }}/>
            <img src={profileImg} alt="Krishna Chaitanya" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:"20px", border:"1px solid rgba(123,47,190,0.5)", display:"block" }}/>
            <div style={{ position:"absolute", inset:0, borderRadius:"20px", background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 50%,rgba(192,132,252,0.07) 100%)", pointerEvents:"none", zIndex:3 }}/>
            <div style={{ position:"absolute", inset:0, borderRadius:"20px", background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px)", pointerEvents:"none", zIndex:3 }}/>
            <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"3px", background:"linear-gradient(to right,transparent,#7B2FBE,#C084FC,transparent)", animation:"scanline 3s linear infinite", opacity:0.7, pointerEvents:"none", zIndex:4 }}/>
            <div style={{ position:"absolute", top:"16px", left:"16px", background:"rgba(0,0,0,0.75)", border:"1px solid rgba(123,47,190,0.6)", borderRadius:"8px", padding:"6px 12px", backdropFilter:"blur(10px)", zIndex:5, transform:"translateZ(30px)" }}>
              <p style={{ color:"#C084FC", fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", fontWeight:"600" }}>Full Stack Dev</p>
            </div>
            <div style={{ position:"absolute", top:"16px", right:"16px", background:"rgba(0,0,0,0.75)", border:"1px solid rgba(74,222,128,0.4)", borderRadius:"8px", padding:"6px 12px", backdropFilter:"blur(10px)", zIndex:5, transform:"translateZ(30px)", display:"flex", alignItems:"center", gap:"6px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", backgroundColor:"#4ade80", animation:"pulse 2s infinite" }}/>
              <p style={{ color:"#4ade80", fontSize:"10px", letterSpacing:"0.1em", fontWeight:"600" }}>Available</p>
            </div>
            <div style={{ position:"absolute", bottom:"20px", left:"50%", transform:"translateX(-50%) translateZ(30px)", background:"rgba(0,0,0,0.88)", border:"1px solid rgba(123,47,190,0.5)", borderRadius:"10px", padding:"10px 24px", backdropFilter:"blur(12px)", whiteSpace:"nowrap", zIndex:5 }}>
              <p style={{ color:"#ffffff", fontSize:"13px", fontWeight:"700", letterSpacing:"0.1em", textAlign:"center" }}>K. Krishna Chaitanya</p>
              <p style={{ color:"#7B2FBE", fontSize:"10px", letterSpacing:"0.2em", textTransform:"uppercase", textAlign:"center", marginTop:"3px" }}>Bengaluru, India 🇮🇳</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;