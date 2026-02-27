import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";

const ABOUT_KRISHNA = `
You are an AI assistant on Krishna Chaitanya's portfolio website.

About Krishna Chaitanya:
- Full name: K. Krishna Chaitanya
- College: Dayananda College of Engineering
- Persona: Calls himself lazy but clearly very skilled and hardworking!
- Hobbies: Playing outdoor games
- Career goal: Full Stack Developer
- Email: kanakavallikrishna2006@gmail.com
- GitHub: https://github.com/Krishna-chaitanya-16
- LinkedIn: https://www.linkedin.com/in/kanakavalli-krishna-chaitanya-2b3114325

Skills:
- Frontend: React, Next.js, TypeScript, JavaScript, Tailwind CSS, HTML, CSS, Redux, MUI, Axios
- Backend: Node.js, Express.js, MySQL
- Animations: GSAP, Three.js, Lenis, Spline
- Tools: Git, GitHub, Vercel
- Design: Photoshop, Premiere Pro, After Effects
- AI/Automation: n8n

Projects:
1. Chat App (React, Node.js, MySQL)
2. E-Commerce Platform (React, Node.js, MySQL)
3. AI Chatbot Integration App
4. Blog Platform
5. Portfolio with 3D Animations
6. Authentication System
7. Climate App

Rules:
- Keep answers short, friendly, 2-4 sentences max
- Be casual and fun
- If you don't know something say "Krishna hasn't told me that! Email him at kanakavallikrishna2006@gmail.com"
- If asked to hire him, say YES enthusiastically!
`;

const SUGGESTED_QUESTIONS = [
  "Who is Krishna? 👋",
  "What are his skills? 💻",
  "Show me his projects 🚀",
  "How to contact him? 📬",
  "Should I hire him? 🤔",
];

const AIChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! 👋 I'm Krishna's AI assistant. Ask me anything about him — skills, projects, contact info, or whether you should hire him! 😄",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!buttonRef.current) return;
    gsap.to(buttonRef.current, {
      y: -6, duration: 1.2, ease: "power1.inOut",
      yoyo: true, repeat: -1,
    });
  }, []);

  useEffect(() => {
    if (!panelRef.current || !isOpen) return;
    gsap.fromTo(panelRef.current,
      { opacity: 0, scale: 0.85, y: 20, transformOrigin: "bottom right" },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.4)" }
    );
    setTimeout(() => inputRef.current?.focus(), 400);
  }, [isOpen]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error("No API key found");
      }

      // Build contents array
      // First message includes the system prompt so Gemini understands context
      const contents = [];

      // Add system context as first user/model exchange
      contents.push({
        role: "user",
        parts: [{ text: ABOUT_KRISHNA + "\n\nUser question: " + userText }],
      });

      // If there are previous real messages, include them for context
      if (newMessages.length > 2) {
        // rebuild with history
        contents.length = 0;
        // System context first
        contents.push({
          role: "user",
          parts: [{ text: ABOUT_KRISHNA + "\n\nNow answer the following conversation. First question: " + newMessages[1].text }],
        });
        contents.push({
          role: "model",
          parts: [{ text: newMessages[2]?.text || "Got it!" }],
        });

        // Add remaining history
        for (let i = 3; i < newMessages.length; i++) {
          contents.push({
            role: newMessages[i].role === "user" ? "user" : "model",
            parts: [{ text: newMessages[i].text }],
          });
        }
      }

      // Try models in order — gemini-2.5-flash is current free tier model
      const models = [
        { version: "v1beta", name: "gemini-2.5-flash" },
        { version: "v1beta", name: "gemini-2.0-flash" },
        { version: "v1beta", name: "gemini-2.0-flash-lite" },
      ];

      let reply = null;
      for (const { version, name } of models) {
        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${name}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents,
                generationConfig: { temperature: 0.8, maxOutputTokens: 250, topP: 0.9 },
              }),
            }
          );

          const data = await response.json();
          if (response.ok) {
            reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            console.log(`✅ Model ${name} worked!`);
            if (reply) break;
          } else {
            console.warn(`❌ Model ${name} failed:`, data?.error?.message);
          }
        } catch (e) {
          console.warn(`❌ Model ${name} error:`, e.message);
        }
      }

      reply = reply || "I couldn't get an answer right now. Try again!";

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: `Oops! Error: ${err.message}. Check console for details 🙏`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "32px", right: "32px", zIndex: 9990 }}>

      {isOpen && (
        <div
          ref={panelRef}
          style={{
            position: "absolute", bottom: "72px", right: 0,
            width: "340px", height: "480px",
            background: "rgba(5,5,15,0.97)",
            border: "1px solid rgba(123,47,190,0.35)",
            borderRadius: "16px",
            display: "flex", flexDirection: "column",
            overflow: "hidden",
            boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(123,47,190,0.15)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Header */}
          <div style={{
            padding: "16px 20px",
            borderBottom: "1px solid rgba(123,47,190,0.2)",
            display: "flex", alignItems: "center", gap: "12px",
            background: "rgba(123,47,190,0.08)",
          }}>
            <div style={{
              width: "36px", height: "36px", borderRadius: "50%",
              background: "linear-gradient(135deg, #7B2FBE, #C084FC)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px", flexShrink: 0,
            }}>🤖</div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: "13px", fontWeight: "700", color: "#ffffff" }}>
                Krishna's AI
              </p>
              <p style={{ margin: 0, fontSize: "10px", color: "#4ade80", letterSpacing: "0.1em" }}>
                ● Online
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent", border: "none",
                color: "#6b7280", cursor: "pointer",
                fontSize: "20px", padding: "4px", lineHeight: 1,
              }}
            >×</button>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            style={{
              flex: 1, overflowY: "auto", padding: "16px",
              display: "flex", flexDirection: "column", gap: "12px",
              scrollbarWidth: "thin", scrollbarColor: "#7B2FBE20 transparent",
            }}
          >
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "82%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user"
                    ? "16px 16px 4px 16px"
                    : "16px 16px 16px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #7B2FBE, #C084FC)"
                    : "rgba(255,255,255,0.06)",
                  border: msg.role === "assistant"
                    ? "1px solid rgba(123,47,190,0.2)" : "none",
                  fontSize: "13px", color: "#ffffff",
                  lineHeight: "1.6", whiteSpace: "pre-wrap",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "12px 16px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(123,47,190,0.2)",
                  display: "flex", gap: "5px", alignItems: "center",
                }}>
                  {[0, 1, 2].map((i) => (
                    <div key={i} style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: "#C084FC",
                      animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {messages.length === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                <p style={{ fontSize: "10px", color: "#4b5563", letterSpacing: "0.15em", textTransform: "uppercase", margin: 0 }}>
                  Try asking:
                </p>
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    style={{
                      background: "rgba(123,47,190,0.08)",
                      border: "1px solid rgba(123,47,190,0.25)",
                      borderRadius: "8px", padding: "8px 12px",
                      color: "#C084FC", fontSize: "12px",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.2s", fontFamily: "inherit",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(123,47,190,0.18)";
                      e.currentTarget.style.borderColor = "#7B2FBE";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(123,47,190,0.08)";
                      e.currentTarget.style.borderColor = "rgba(123,47,190,0.25)";
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div style={{
            padding: "12px 16px",
            borderTop: "1px solid rgba(123,47,190,0.2)",
            display: "flex", gap: "8px", alignItems: "center",
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything about Krishna..."
              style={{
                flex: 1, background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(123,47,190,0.25)",
                borderRadius: "8px", padding: "10px 14px",
                color: "#ffffff", fontSize: "13px", outline: "none",
                transition: "border-color 0.2s", fontFamily: "inherit",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#C084FC"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(123,47,190,0.25)"; }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                width: "40px", height: "40px", borderRadius: "8px",
                background: input.trim() && !loading
                  ? "linear-gradient(135deg, #7B2FBE, #C084FC)"
                  : "rgba(123,47,190,0.2)",
                border: "none",
                cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", transition: "all 0.2s", flexShrink: 0,
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: isOpen
            ? "rgba(123,47,190,0.3)"
            : "linear-gradient(135deg, #7B2FBE, #C084FC)",
          border: "2px solid rgba(192,132,252,0.4)",
          cursor: "pointer", fontSize: "24px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 24px rgba(123,47,190,0.5), 0 4px 16px rgba(0,0,0,0.4)",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      <style>{`
        @keyframes dotBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AIChatBox;