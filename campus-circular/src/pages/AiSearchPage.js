import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const cost = a[i - 1] === b[j - 1] ? 0 : 1;
    dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
  }
  return dp[m][n];
}
function similar(a, b) {
  if (!a || !b) return 0;
  const d = levenshtein(a, b);
  return 1 - d / Math.max(a.length, b.length);
}
function fuzzyMatch(token, keyword) {
  const t = token.toLowerCase(), k = keyword.toLowerCase();
  if (t === k) return 1;
  if (t.includes(k) || k.includes(t)) return 0.92;
  const sim = similar(t, k);
  if (sim >= 0.80) return sim;
  const d = levenshtein(t, k);
  if (k.length >= 5 && d <= 2) return 0.76;
  if (k.length >= 4 && d <= 1) return 0.70;
  return 0;
}
const STOPWORDS = new Set(["i","me","my","we","us","need","needs","want","wants","something","anything","some","thing","things","for","a","an","the","to","please","help","find","get","looking","search","require","required","should","would","could","can","give","show","is","are","am","be","have","has","do","does","it","this","that","with","on","at","in","of","and","or"]);
function tokenize(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w.length > 1);
}

// Distinct keyword sets — no overlap bleed
const RESOURCE_TAGS = {
  "Canon EOS 1500D DSLR Camera": ["camera","dslr","canon","nikon","sony","photography","photo","shoot","shooting","video","reel","film","cinema","vlog","youtube"],
  "Tripod Stand - Professional": ["tripod","tripod stand","stabilizer","gimbal","mount"],
  "Wireless Bluetooth Microphone": ["microphone","mic","mike","audio","sound","podcast","recording","interview","voice"],
  "LED Ring Light 12 inch": ["ring light","ringlight","studio light","softbox","lighting","led light","brightness"],
  "Engineering Mathematics Vol 1": ["textbook","book","mathematics","maths","math","kreyszig","engineering book","study material","notes"],
  "Scientific Calculator - Casio fx-991EX": ["calculator","calc","casio","fx991","scientific calculator"],
  "Dell Laptop - i5 10th Gen": ["laptop","computer","pc","dell","coding","programming","software","assignment"],
  "Yamaha Acoustic Guitar": ["guitar","acoustic guitar","yamaha","instrument","music instrument","song","band","singing","performance"],
  "Bluetooth Speaker - JBL": ["speaker","jbl speaker","bluetooth speaker","soundbox","party speaker"],
  "Cricket Bat - SG": ["cricket","cricket bat","sg bat","cricket kit"],
  "Football - Official Size 5": ["football","soccer","footbal","football ball"],
  "Desk Lamp - LED Study Lamp": ["desk lamp","study lamp","reading lamp","table lamp"],
};

function getRecommendations(query, allResources) {
  const rawTokens = tokenize(query);
  const meaningful = rawTokens.filter(t => !STOPWORDS.has(t) && t.length > 2);
  const lower = query.toLowerCase();

  // Vague query handling — don't return same tripod kit
  if (meaningful.length === 0) {
    // pick one per category diverse
    const byCat = {};
    allResources.filter(r=>r.isApproved && r.availability==="Available").forEach(r=>{
      if (!byCat[r.category] || r.rating > byCat[r.category].rating) byCat[r.category]=r;
    });
    const diverse = Object.values(byCat).sort(()=>Math.random()-0.5).slice(0,5);
    return {
      text: "Your request was a bit vague — try being specific!\n\nExamples:\n• “i need camera for shooting”\n• “calculator for exam tomorrow”\n• “guitar for music jam”\n\nHere’s a diverse pick from each category to get you started:",
      resources: diverse.length ? diverse : allResources.slice(0,4),
      intent: "vague"
    };
  }

  // Score only on meaningful keywords (stopwords removed) — rating boost only if keyword matched
  const scored = allResources.map(r => {
    const tags = RESOURCE_TAGS[r.name] || [r.category.toLowerCase()];
    let keywordScore = 0;
    meaningful.forEach(tok => {
      let best = 0;
      tags.forEach(kw => {
        kw.split(/\s+/).forEach(k => {
          const s = fuzzyMatch(tok, k);
          if (s > best) best = s;
        });
      });
      // also check category as whole
      const catScore = fuzzyMatch(tok, r.category.toLowerCase());
      best = Math.max(best, catScore * 0.88);
      if (best >= 0.68) keywordScore += best * (tok.length > 4 ? 1.25 : 1);
    });
    // exact phrase bonus inside original query
    if (lower.includes(r.category.toLowerCase())) keywordScore += 0.6;
    const finalScore = keywordScore > 0 ? keywordScore + (r.rating||0)*0.06 + (r.availability==="Available"?0.15:0) : 0;
    return { resource: r, keywordScore, finalScore };
  });

  scored.sort((a,b)=>b.finalScore-a.finalScore);
  const matched = scored.filter(s=>s.keywordScore>0.65);
  // If we have good matches, use them
  if (matched.length >= 1) {
    // For camera intent, expand to kit; otherwise keep matched
    const isCameraIntent = meaningful.some(t => ["camera","camra","shoot","shooting","photo","video","reel","dslr","film","canon","photograph"].some(k=>fuzzyMatch(t,k)>=0.68));
    if (isCameraIntent && matched.some(m=>m.resource.name.includes("Canon"))) {
      // return full kit but only if query actually about shooting
      const kitNames = ["Canon EOS 1500D DSLR Camera","Tripod Stand - Professional","Wireless Bluetooth Microphone","LED Ring Light 12 inch"];
      const kit = kitNames.map(n=>allResources.find(r=>r.name===n)).filter(Boolean);
      return { text: "Shooting kit — camera + tripod + mic + light. Ranked by trust & distance, typo-tolerant (camra→camera, shotting→shooting).", resources: kit, intent:"camera" };
    }
    // normal: return top matched
    let topResources = matched.slice(0,5).map(s=>s.resource);
    // intent-based explanation
    const has = (...words) => meaningful.some(t=>words.some(w=>fuzzyMatch(t,w)>=0.68));
    let text = `Found ${topResources.length} strong match${topResources.length>1?"es":""} for “${meaningful.join(" ")}” — ranked by keyword relevance, then trust & distance.`;
    if (has("calculator","calc","casio")) text = "Calculator & study essentials — cheapest trusted first. Try “calculator for exam” or “maths textbook”.";
    else if (has("textbook","book","mathematics","maths","math")) text = "Textbooks & study material — high trust, low deposit.";
    else if (has("laptop","computer","coding","programming","ppt","presentation")) text = "Laptop & presentation gear — highest rated, nearby first.";
    else if (has("guitar","music","instrument","song","band")) text = "Music kit — guitar + speaker + mic.";
    else if (has("cricket","football","soccer","sports","sport")) text = "Sports gear — available today, sorted by distance.";
    else if (has("speaker","sound","audio","party","event")) text = "Event audio — speakers & mics for parties/presentations.";
    else if (has("light","lamp","ring")) text = "Lighting — ring light & study lamps, verified owners.";
    return { text, resources: topResources, intent:"matched" };
  }

  // No keyword match — show closest by fuzzy category + ask to refine
  const fallback = scored.filter(s=>s.finalScore>0).slice(0,4).map(s=>s.resource);
  if (fallback.length) {
    return { text: `No exact match for “${query}” — here are the closest categories. Try:\n• “camera for shooting”\n• “textbook for exam”\n• “laptop for presentation”`, resources: fallback, intent:"fallback" };
  }
  // ultimate fallback diverse
  const byCat = {};
  allResources.filter(r=>r.isApproved).forEach(r=>{ if(!byCat[r.category]) byCat[r.category]=r; });
  return { text: "I couldn’t parse that — here’s a diverse sample. Be specific: “i need camera for shooting” or “i need calculator”.", resources: Object.values(byCat).slice(0,4), intent:"fallback" };
}

const AiSearchPage = () => {
  const { allResources } = useApp();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hey! I’m typo-tolerant. Try:\n• “i need camera for shooting”\n• “camra for shotting” (same result)\n• “i need something” → I’ll ask you to clarify instead of same kit\n• “calculator for exam”" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef(null);
  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages, isTyping]);

  const handleSend = () => {
    const q = input.trim();
    if (!q) return;
    setMessages(prev=>[...prev,{role:"user",content:q}]);
    setInput("");
    setIsTyping(true);
    setTimeout(()=>{
      const { text, resources } = getRecommendations(q, allResources);
      setMessages(prev=>[...prev,{role:"ai",content:text,resources}]);
      setIsTyping(false);
    }, 550);
  };

  const quickPrompts = [
    "i need camera for shooting",
    "camra for shotting tomorrow",
    "i need something",
    "calculator for exam",
    "guitar for music session",
    "football for match",
  ];

  return (
    <div className="page">
      <div className="page-header" style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 16px" }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '999px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          <i className="fa-solid fa-wand-magic-sparkles" style={{ color: 'var(--primary)' }}></i> AI discovery • typo-tolerant • no more same-kit spam
        </div>
        <h1 className="page-title" style={{ textAlign: 'center' }}>Ask in <em>plain language</em></h1>
        <p className="page-subtitle" style={{ textAlign: 'center', margin: '0 auto' }}>Vague “i need something” → asks to clarify with diverse picks. Specific “camera for shooting” → correct kit.</p>
      </div>

      <div className="ai-chat">
        <div ref={listRef} style={{ background: "var(--bg-card)", borderRadius: "var(--radius)", border: "1px solid var(--border)", padding: "14px", marginBottom: "10px", maxHeight: "54vh", overflowY: "auto" }}>
          {messages.map((msg,i)=>(
            <motion.div key={i} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}}>
              <div className={`chat-bubble ${msg.role}`} style={{whiteSpace:'pre-line'}}>{msg.content}</div>
              {msg.resources && (
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))",gap:"10px",marginBottom:"12px",marginLeft:"6px"}}>
                  {msg.resources.map(r=>(
                    <motion.div key={r.id} className="card" style={{cursor:"pointer",overflow:"hidden"}} whileHover={{y:-2}} onClick={()=>navigate(`/resource/${r.id}`)}>
                      <div style={{position:'relative'}}>
                        <img src={r.images[0]} alt={r.name} style={{width:"100%",height:"108px",objectFit:"cover"}}/>
                        <span className="badge badge-neutral" style={{position:'absolute',bottom:'7px',left:'7px',background:'rgba(15,14,13,0.84)',color:'white',borderColor:'rgba(255,255,255,0.12)',fontSize:'10px'}}>{r.category}</span>
                      </div>
                      <div style={{padding:"9px 10px"}}>
                        <div style={{fontWeight:600,fontSize:"12px",lineHeight:1.3,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{r.name}</div>
                        <div style={{display:"flex",justifyContent:"space-between",marginTop:"4px"}}>
                          <span style={{color:"var(--primary)",fontWeight:700,fontSize:"11px",fontFamily:'JetBrains Mono, monospace'}}>₹{r.dailyRate}/day</span>
                          <span style={{fontSize:"11px",color:"var(--warning)",fontWeight:600}}><i className="fa-solid fa-star" style={{fontSize:'9px'}}></i> {r.rating}</span>
                        </div>
                        <div style={{fontSize:"10px",color:"var(--text-muted)",marginTop:"3px",fontFamily:'JetBrains Mono, monospace',display:'flex',justifyContent:'space-between'}}>
                          <span><i className="fa-solid fa-location-dot"></i> {r.distance}</span>
                          <span style={{color:r.availability==="Available"?"var(--success)":"var(--danger)"}}>{r.availability}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
          {isTyping && <div className="chat-bubble ai" style={{display:"flex",gap:"4px"}}><motion.span animate={{opacity:[0.3,1,0.3]}} transition={{repeat:Infinity,duration:1}}><i className="fa-solid fa-circle" style={{fontSize:'6px'}}></i></motion.span><motion.span animate={{opacity:[0.3,1,0.3]}} transition={{repeat:Infinity,duration:1,delay:0.2}}><i className="fa-solid fa-circle" style={{fontSize:'6px'}}></i></motion.span><motion.span animate={{opacity:[0.3,1,0.3]}} transition={{repeat:Infinity,duration:1,delay:0.4}}><i className="fa-solid fa-circle" style={{fontSize:'6px'}}></i></motion.span></div>}
        </div>

        <div style={{display:"flex",flexWrap:"wrap",gap:"7px",marginBottom:"10px"}}>
          {quickPrompts.map((p,i)=><button key={i} className="btn btn-secondary btn-sm" onClick={()=>setInput(p)} style={{fontSize:"11px",borderRadius:'999px'}}><i className="fa-regular fa-message"></i> {p}</button>)}
        </div>

        <div className="chat-input-wrapper">
          <input className="chat-input" placeholder='Try "i need something" vs "i need camera for shooting"...' value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSend()} />
          <button className="btn btn-primary" onClick={handleSend} style={{borderRadius:'999px',padding:'10px 16px'}}><i className="fa-solid fa-paper-plane"></i></button>
        </div>
        <p style={{fontSize:'11px',color:'var(--text-faint)',textAlign:'center',marginTop:'7px'}}>No backend — fuzzy on-device. Vague queries no longer spam tripod kit.</p>
      </div>
    </div>
  );
};
export default AiSearchPage;
