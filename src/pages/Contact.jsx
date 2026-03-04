import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const socialLinks = [
  { name: "GitHub",   icon: "⌨️", url: "https://github.com/krishnachaitanya-16",                             color: "#ffffff", handle: "@krishnachaitanya-16"           },
  { name: "LinkedIn", icon: "💼", url: "https://www.linkedin.com/in/kanakavalli-krishna-chaitanya-2b3114325", color: "#0A66C2", handle: "Krishna Chaitanya"                },
  { name: "Email",    icon: "📧", url: "mailto:kanakavallikrishna2006@gmail.com",                              color: "#C084FC", handle: "kanakavallikrishna2006@gmail.com" },
];

const Contact = () => {
  const sectionRef    = useRef(null);
  const titleRef      = useRef(null);
  const formRef       = useRef(null);
  const leftRef       = useRef(null);
  const cursorGlowRef = useRef(null);
  const animated      = useRef(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [focused,  setFocused]  = useState(null);
  const [sent,     setSent]     = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const chk = () => setIsMobile(window.innerWidth < 768);
    chk();
    window.addEventListener("resize", chk);
    return () => window.removeEventListener("resize", chk);
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
    const section = sectionRef.current;
    if (!section) return;

    // set all hidden immediately
    const words = titleRef.current?.querySelectorAll(".ct-word");
    if (words?.length) gsap.set(words, { opacity: 0, y: 50 });
    if (leftRef.current)  gsap.set(leftRef.current,  { opacity: 0, x: window.innerWidth < 768 ? 0 : -50 });
    if (formRef.current)  gsap.set(formRef.current,  { opacity: 0, x: window.innerWidth < 768 ? 0 :  50 });

    const cards = section.querySelectorAll(".social-card");
    if (cards?.length) gsap.set(cards, { opacity: 0, y: 25 });

    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || animated.current) return;
      animated.current = true;
      obs.disconnect();

      if (words?.length)
        gsap.to(words, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 });
      if (leftRef.current)
        gsap.to(leftRef.current,  { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.15 });
      if (formRef.current)
        gsap.to(formRef.current,  { opacity: 1, x: 0, duration: 0.9, ease: "power3.out", delay: 0.25 });
      if (cards?.length)
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.08, delay: 0.4 });
    }, { threshold: 0.05 });

    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();
    gsap.to(".submit-btn", { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" ref={sectionRef} style={{ position:"relative", minHeight:"100vh", width:"100%", backgroundColor:"#000000", overflow:"hidden", paddingBottom:"100px" }}>
      <style>{`
        .ct-word{display:inline-block}
        .contact-input{width:100%;background:rgba(8,8,8,0.9);border:1px solid rgba(123,47,190,0.25);border-radius:8px;padding:14px 18px;color:#fff;font-size:14px;outline:none;transition:all .3s;font-family:inherit;resize:none;box-sizing:border-box}
        .contact-input:focus{border-color:#7B2FBE;box-shadow:0 0 20px rgba(123,47,190,0.2);background:rgba(123,47,190,0.05)}
        .contact-input::placeholder{color:#4b5563}
        .submit-btn:hover{opacity:.9;transform:translateY(-2px)}
        .social-card:hover{transform:translateY(-4px)}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}
        .contact-grid{display:grid;grid-template-columns:1fr 1.4fr;gap:60px;align-items:start}
        @media(max-width:1023px){.contact-grid{grid-template-columns:1fr;gap:40px}}
        .contact-inner{max-width:1100px;margin:0 auto;padding:0 60px}
        @media(max-width:767px){.contact-inner{padding:0 20px}}
        @media(min-width:768px) and (max-width:1023px){.contact-inner{padding:0 40px}}
        .contact-header{padding-top:120px;padding-bottom:70px}
        @media(max-width:767px){.contact-header{padding-top:90px;padding-bottom:40px}}
        .form-card{padding:40px}
        @media(max-width:767px){.form-card{padding:24px 20px}}
        @media(max-width:480px){.social-handle{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:160px}}
      `}</style>

      <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(123,47,190,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(123,47,190,0.03) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}}/>

      {!isMobile && (
        <div ref={cursorGlowRef} style={{position:"absolute",width:"400px",height:"400px",borderRadius:"50%",background:"radial-gradient(circle,rgba(123,47,190,0.2) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none",zIndex:0,top:0,left:0}}/>
      )}
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",width:"600px",height:"300px",background:"radial-gradient(circle,rgba(123,47,190,0.15) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}}/>

      {/* Header */}
      <div className="contact-header" style={{position:"relative",zIndex:2,textAlign:"center"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:"16px",marginBottom:"20px"}}>
          <div style={{width:"40px",height:"1px",backgroundColor:"#7B2FBE"}}/>
          <p style={{fontSize:"11px",color:"#7B2FBE",letterSpacing:"0.4em",textTransform:"uppercase"}}>Contact</p>
          <div style={{width:"40px",height:"1px",backgroundColor:"#7B2FBE"}}/>
        </div>
        <h2 ref={titleRef} style={{fontSize:"clamp(28px,5vw,64px)",fontWeight:"800",color:"#ffffff",lineHeight:1.1,padding:"0 16px"}}>
          <span className="ct-word">Let&apos;s&nbsp;</span>
          <span className="ct-word">Build&nbsp;</span>
          <span className="ct-word" style={{background:"linear-gradient(135deg,#7B2FBE,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Something&nbsp;</span>
          <span className="ct-word" style={{background:"linear-gradient(135deg,#7B2FBE,#C084FC)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Together</span>
        </h2>
        <p style={{color:"#6b7280",fontSize:"14px",marginTop:"12px",maxWidth:"400px",margin:"12px auto 0",padding:"0 20px"}}>
          Have a project in mind? Let's connect and create something amazing.
        </p>
      </div>

      {/* Main */}
      <div className="contact-inner" style={{position:"relative",zIndex:2}}>
        <div className="contact-grid">

          {/* LEFT */}
          <div ref={leftRef} style={{display:"flex",flexDirection:"column",gap:"32px"}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:"10px",padding:"10px 20px",border:"1px solid rgba(74,222,128,0.3)",borderRadius:"999px",background:"rgba(74,222,128,0.05)",width:"fit-content"}}>
              <div style={{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:"#4ade80",boxShadow:"0 0 8px #4ade80",animation:"pulse 2s infinite"}}/>
              <span style={{fontSize:"12px",color:"#4ade80",fontWeight:"600",letterSpacing:"0.1em"}}>Available for Work</span>
            </div>
            <div>
              <h3 style={{fontSize:"clamp(18px,3vw,22px)",fontWeight:"800",color:"#ffffff",marginBottom:"12px"}}>K. Krishna Chaitanya</h3>
              <p style={{fontSize:"13px",color:"#9ca3af",lineHeight:"1.85"}}>Full Stack Developer & Creative Technologist based in Bengaluru, India. Open to freelance projects, collaborations, and full-time opportunities.</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
              {socialLinks.map(social => (
                <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="social-card"
                  style={{display:"flex",alignItems:"center",gap:"16px",padding:"16px 20px",background:"rgba(8,8,8,0.9)",border:`1px solid ${social.color}20`,borderRadius:"12px",textDecoration:"none",backdropFilter:"blur(10px)",transition:"all 0.3s ease"}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${social.color}60`;e.currentTarget.style.boxShadow=`0 0 20px ${social.color}15`;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=`${social.color}20`;e.currentTarget.style.boxShadow="none";}}
                >
                  <div style={{width:"40px",height:"40px",borderRadius:"10px",background:`${social.color}15`,border:`1px solid ${social.color}30`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px",flexShrink:0}}>{social.icon}</div>
                  <div style={{minWidth:0,flex:1}}>
                    <p style={{fontSize:"13px",fontWeight:"600",color:"#ffffff"}}>{social.name}</p>
                    <p className="social-handle" style={{fontSize:"11px",color:"#6b7280",marginTop:"2px"}}>{social.handle}</p>
                  </div>
                  <div style={{marginLeft:"auto",color:"#4b5563",fontSize:"16px",flexShrink:0}}>→</div>
                </a>
              ))}
            </div>
          </div>

          {/* RIGHT — Form */}
          <div ref={formRef} className="form-card" style={{background:"rgba(8,8,8,0.9)",border:"1px solid rgba(123,47,190,0.25)",borderRadius:"20px",backdropFilter:"blur(20px)",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:"3px",background:"linear-gradient(to right,#7B2FBE,#C084FC,transparent)"}}/>
            <h3 style={{fontSize:"18px",fontWeight:"800",color:"#ffffff",marginBottom:"8px"}}>Send a Message</h3>
            <p style={{fontSize:"12px",color:"#6b7280",marginBottom:"28px"}}>I'll get back to you within 24 hours ⚡</p>

            {sent ? (
              <div style={{textAlign:"center",padding:"40px 0"}}>
                <div style={{fontSize:"48px",marginBottom:"16px"}}>🚀</div>
                <h4 style={{fontSize:"18px",fontWeight:"700",color:"#ffffff",marginBottom:"8px"}}>Message Sent!</h4>
                <p style={{fontSize:"13px",color:"#9ca3af"}}>Thanks for reaching out. I'll be in touch soon!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{display:"flex",flexDirection:"column",gap:"20px"}}>
                <div>
                  <label style={{fontSize:"11px",color:"#7B2FBE",letterSpacing:"0.2em",textTransform:"uppercase",display:"block",marginBottom:"8px"}}>Your Name</label>
                  <input type="text" className="contact-input" placeholder="Krishna Chaitanya" value={formData.name}
                    onChange={e=>setFormData({...formData,name:e.target.value})} required
                    style={{border:focused==="name"?"1px solid #7B2FBE":"1px solid rgba(123,47,190,0.25)"}}
                    onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)}/>
                </div>
                <div>
                  <label style={{fontSize:"11px",color:"#7B2FBE",letterSpacing:"0.2em",textTransform:"uppercase",display:"block",marginBottom:"8px"}}>Email Address</label>
                  <input type="email" className="contact-input" placeholder="hello@example.com" value={formData.email}
                    onChange={e=>setFormData({...formData,email:e.target.value})} required
                    style={{border:focused==="email"?"1px solid #7B2FBE":"1px solid rgba(123,47,190,0.25)"}}
                    onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}/>
                </div>
                <div>
                  <label style={{fontSize:"11px",color:"#7B2FBE",letterSpacing:"0.2em",textTransform:"uppercase",display:"block",marginBottom:"8px"}}>Message</label>
                  <textarea className="contact-input" placeholder="Hey Krishna, I'd love to work with you on..." rows={5} value={formData.message}
                    onChange={e=>setFormData({...formData,message:e.target.value})} required
                    style={{border:focused==="message"?"1px solid #7B2FBE":"1px solid rgba(123,47,190,0.25)"}}
                    onFocus={()=>setFocused("message")} onBlur={()=>setFocused(null)}/>
                </div>
                <button type="submit" className="submit-btn" style={{padding:"14px 28px",fontSize:"12px",letterSpacing:"0.2em",textTransform:"uppercase",fontWeight:"700",color:"#ffffff",background:"linear-gradient(135deg,#7B2FBE,#C084FC)",borderRadius:"8px",border:"none",cursor:"pointer",transition:"all 0.3s",width:"100%",boxShadow:"0 0 30px rgba(123,47,190,0.3)"}}>
                  Send Message 🚀
                </button>
              </form>
            )}
            <div style={{position:"absolute",bottom:0,right:0,width:"150px",height:"150px",background:"radial-gradient(circle,rgba(123,47,190,0.15) 0%,transparent 70%)",pointerEvents:"none"}}/>
          </div>
        </div>
      </div>

      <div style={{position:"relative",zIndex:2,textAlign:"center",marginTop:"80px",borderTop:"1px solid rgba(123,47,190,0.15)",padding:"40px 20px 0"}}>
        <p style={{fontSize:"12px",color:"#4b5563",letterSpacing:"0.2em"}}>
          DESIGNED & BUILT BY <span style={{color:"#7B2FBE",fontWeight:"700"}}>K. KRISHNA CHAITANYA</span> • 2026
        </p>
      </div>
    </section>
  );
};

export default Contact;