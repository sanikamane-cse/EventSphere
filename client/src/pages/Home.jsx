import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const Home = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [isPaid, setIsPaid] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEvents = useCallback(async (searchVal, categoryVal, page, isPaidVal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page || 1,
        limit: 6,
        ...(searchVal && { search: searchVal }),
        ...(categoryVal && { category: categoryVal }),
        ...(isPaidVal !== "" && isPaidVal !== undefined && { isPaid: isPaidVal }),
      });
      const { data } = await API.get(`/events?${params}`);
      if (data.success) {
        setEvents(data.events);
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents(search, category, currentPage, isPaid);
  }, [category, currentPage, isPaid]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setCategory("");
    setIsPaid("");
    fetchEvents(search, "", 1, "");
  };

  const handleCategoryChange = (val) => {
    setCategory(val);
    setCurrentPage(1);
    setSearch("");
  };

  const categories = [
    { value: "", label: "All Events", emoji: "✨" },
    { value: "workshop", label: "Workshop", emoji: "🛠️" },
    { value: "seminar", label: "Seminar", emoji: "🎤" },
    { value: "technical", label: "Technical", emoji: "💻" },
    { value: "cultural", label: "Cultural", emoji: "🎭" },
    { value: "sports", label: "Sports", emoji: "⚽" },
  ];

  const catColors = {
    workshop:  { bg: "#fff3ee", text: "#e8590c", border: "#ffd8c0", from: "#ff6b35", to: "#f7c59f" },
    seminar:   { bg: "#eef6ff", text: "#1971c2", border: "#bde0ff", from: "#4d96ff", to: "#74c0fc" },
    technical: { bg: "#f3f0ff", text: "#6741d9", border: "#d0bfff", from: "#7c3aed", to: "#a78bfa" },
    cultural:  { bg: "#fff0f6", text: "#c2255c", border: "#ffb8d0", from: "#ec4899", to: "#f9a8d4" },
    sports:    { bg: "#ebfbee", text: "#2f9e44", border: "#b2f2bb", from: "#22c55e", to: "#86efac" },
    other:     { bg: "#f8f9fa", text: "#495057", border: "#dee2e6", from: "#667eea", to: "#764ba2" },
  };

  const catEmoji = {
    workshop: "🛠️", seminar: "🎤", technical: "💻",
    cultural: "🎭", sports: "⚽", other: "🎪",
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #fff8f0 70%, #f0f7ff 100%)", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .ev-card { background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid rgba(255,255,255,0.8); transition: all 0.3s ease; cursor: pointer; }
        .ev-card:hover { transform: translateY(-8px); box-shadow: 0 24px 48px rgba(0,0,0,0.13); }
        .cat-chip { border: none; cursor: pointer; transition: all 0.2s ease; font-family: 'Plus Jakarta Sans', sans-serif; }
        .cat-chip:hover { transform: translateY(-2px); }
        .search-box:focus { outline: none; }
        .hero-btn { transition: all 0.2s ease; }
        .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(92,107,192,0.4); }
        @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .view-btn { transition: all 0.2s ease; }
        .view-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      `}</style>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)", padding: "72px 24px 100px", position: "relative", overflow: "hidden" }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />
        <div style={{ position:"absolute", bottom:-80, left:-40, width:250, height:250, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }} className="fade-up">
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", backdropFilter:"blur(10px)", borderRadius:100, padding:"8px 20px", marginBottom:28, border:"1px solid rgba(255,255,255,0.25)" }}>
            <span style={{ fontSize:16 }}>🎓</span>
            <span style={{ color:"#fff", fontSize:13, fontWeight:600, letterSpacing:0.5 }}>India's #1 College Events Platform</span>
          </div>

          <h1 style={{ fontSize:"clamp(36px,6vw,64px)", fontWeight:800, color:"#fff", lineHeight:1.1, marginBottom:20, letterSpacing:-1.5 }}>
            Discover Amazing<br />
            <span style={{ background:"linear-gradient(90deg,#ffd700,#ffb347)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              College Events
            </span>
          </h1>

          <p style={{ color:"rgba(255,255,255,0.82)", fontSize:18, fontWeight:400, lineHeight:1.7, marginBottom:40, maxWidth:500, margin:"0 auto 40px" }}>
            Workshops, seminars, tech fests & cultural events — all in one place. Register instantly!
          </p>

          <form onSubmit={handleSearch} style={{ display:"flex", gap:10, maxWidth:560, margin:"0 auto 48px", background:"#fff", borderRadius:16, padding:8, boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍  Search events, workshops..."
              className="search-box"
              style={{ flex:1, border:"none", borderRadius:10, padding:"12px 16px", fontSize:15, color:"#333", background:"transparent", fontFamily:"'Plus Jakarta Sans',sans-serif" }}
            />
            <button type="submit" className="hero-btn"
              style={{ background:"linear-gradient(135deg,#667eea,#764ba2)", border:"none", borderRadius:10, padding:"12px 24px", color:"#fff", fontWeight:700, fontSize:15, cursor:"pointer", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Search
            </button>
          </form>

          <div style={{ display:"flex", justifyContent:"center", gap:48, flexWrap:"wrap" }}>
            {[["500+","Events","🎪"],["10K+","Students","👥"],["50+","Colleges","🏫"]].map(([num,label,emoji]) => (
              <div key={label} style={{ textAlign:"center" }}>
                <div style={{ fontSize:28, fontWeight:800, color:"#fff" }}>{num}</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:13, fontWeight:500 }}>{emoji} {label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curved separator */}
      <div style={{ marginTop:-2, lineHeight:0, background:"linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)" }}>
        <svg viewBox="0 0 1440 80" style={{ width:"100%", display:"block" }} preserveAspectRatio="none">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0eeff" />
        </svg>
      </div>

      {/* Content */}
      <div style={{ background:"linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #fff8f0 70%, #f0f7ff 100%)" }}>
        <div style={{ maxWidth:1160, margin:"0 auto", padding:"20px 24px 80px" }}>

          {/* Paid/Free Filter */}
          <div style={{ marginBottom:20 }}>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {[
                { value: "", label: "🎫 All" },
                { value: "false", label: "🆓 Free Events" },
                { value: "true", label: "💰 Paid Events" },
              ].map(({ value, label }) => (
                <button key={value}
                  onClick={() => { setIsPaid(value); setCurrentPage(1); }}
                  className="cat-chip"
                  style={{
                    padding:"8px 20px", borderRadius:100, fontSize:13, fontWeight:600,
                    background: isPaid === value ? "linear-gradient(135deg,#22c55e,#16a34a)" : "rgba(255,255,255,0.9)",
                    color: isPaid === value ? "#fff" : "#555",
                    boxShadow: isPaid === value ? "0 4px 15px rgba(34,197,94,0.4)" : "0 2px 8px rgba(0,0,0,0.07)",
                    border: isPaid === value ? "none" : "1px solid rgba(255,255,255,0.9)",
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div style={{ marginBottom:40 }}>
            <h2 style={{ fontSize:22, fontWeight:700, color:"#1a1a2e", marginBottom:16 }}>Browse by Category</h2>
            <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
              {categories.map(({ value, label, emoji }) => (
                <button key={value} onClick={() => handleCategoryChange(value)}
                  className="cat-chip"
                  style={{
                    padding:"10px 20px", borderRadius:100, fontSize:14, fontWeight:600,
                    background: category === value ? "linear-gradient(135deg,#667eea,#764ba2)" : "rgba(255,255,255,0.9)",
                    color: category === value ? "#fff" : "#555",
                    boxShadow: category === value ? "0 4px 15px rgba(102,126,234,0.45)" : "0 2px 8px rgba(0,0,0,0.07)",
                    border: category === value ? "none" : "1px solid rgba(255,255,255,0.9)",
                  }}>
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Section Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
            <div>
              <h2 style={{ fontSize:26, fontWeight:800, color:"#1a1a2e" }}>
                {search ? `Results for "${search}"` : category ? `${category.charAt(0).toUpperCase()+category.slice(1)} Events` : isPaid === "true" ? "💰 Paid Events" : isPaid === "false" ? "🆓 Free Events" : "All Events"}
                <span style={{ color:"#667eea", marginLeft:8 }}>✦</span>
              </h2>
              <p style={{ color:"#888", fontSize:14, marginTop:4 }}>Showing latest approved events</p>
            </div>
            {user?.role === "organizer" && (
              <Link to="/create-event" style={{ background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", padding:"10px 22px", borderRadius:12, fontWeight:600, fontSize:14, textDecoration:"none", boxShadow:"0 4px 15px rgba(102,126,234,0.3)" }}>
                + Create Event
              </Link>
            )}
          </div>

          {/* Events Grid */}
          {loading ? (
            <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height:300 }}>
              <div style={{ width:44, height:44, border:"3px solid rgba(102,126,234,0.2)", borderTop:"3px solid #667eea", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
            </div>
          ) : events.length === 0 ? (
            <div style={{ textAlign:"center", padding:"80px 0", background:"rgba(255,255,255,0.7)", borderRadius:24, backdropFilter:"blur(10px)" }}>
              <div style={{ fontSize:72, marginBottom:16 }}>🎯</div>
              <h3 style={{ fontSize:22, fontWeight:700, color:"#333", marginBottom:8 }}>No events found!</h3>
              <p style={{ color:"#888", fontSize:15 }}>Try a different search or category</p>
            </div>
          ) : (
            <>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:24 }}>
                {events.map((event) => {
                  const c = catColors[event.category] || catColors.other;
                  const emoji = catEmoji[event.category] || "🎪";
                  return (
                    <div key={event._id} className="ev-card">
                      {/* Image */}
                      <div style={{ height:200, background:`linear-gradient(135deg,${c.from}33,${c.to}44)`, display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>
                        {event.posterImage ? (
                          <img src={event.posterImage} alt={event.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        ) : (
                          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
                            <span style={{ fontSize:64 }}>{emoji}</span>
                            <span style={{ fontSize:11, fontWeight:700, color:c.text, textTransform:"uppercase", letterSpacing:1.5, background:c.bg, padding:"4px 12px", borderRadius:100 }}>{event.category}</span>
                          </div>
                        )}
                        <div style={{ position:"absolute", top:14, left:14, background:c.bg, color:c.text, border:`1px solid ${c.border}`, borderRadius:100, padding:"4px 14px", fontSize:12, fontWeight:700, textTransform:"capitalize" }}>
                          {event.category}
                        </div>
                        <div style={{ position:"absolute", top:14, right:14, background: event.isPaid?"#fff3ee":"#ebfbee", color: event.isPaid?"#e8590c":"#2f9e44", border:`1px solid ${event.isPaid?"#ffd8c0":"#b2f2bb"}`, borderRadius:100, padding:"4px 14px", fontSize:12, fontWeight:700 }}>
                          {event.isPaid ? `₹${event.price}` : "FREE"}
                        </div>
                      </div>

                      {/* Content */}
                      <div style={{ padding:22 }}>
                        <h3 style={{ fontSize:18, fontWeight:700, color:"#1a1a2e", marginBottom:6, lineHeight:1.3 }}>{event.title}</h3>
                        <p style={{ color:"#888", fontSize:13, marginBottom:14, fontWeight:500 }}>by {event.organizer?.name} · {event.organizer?.college}</p>

                        <div style={{ background:`linear-gradient(135deg,${c.from}11,${c.to}11)`, border:`1px solid ${c.border}`, borderRadius:14, padding:14, marginBottom:16 }}>
                          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                            {[
                              ["📅", new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})],
                              ["⏰", event.time],
                              ["📍", event.venue?.substring(0,20)+(event.venue?.length>20?"...":"")],
                              ["👥", `${event.registeredCount}/${event.capacity}`],
                            ].map(([icon, text]) => (
                              <div key={icon} style={{ display:"flex", alignItems:"center", gap:6 }}>
                                <span style={{ fontSize:13 }}>{icon}</span>
                                <span style={{ fontSize:12, color:"#555", fontWeight:600 }}>{text}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <Link to={`/events/${event._id}`} className="view-btn"
                          style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, background:`linear-gradient(135deg,${c.from},${c.to})`, color:"#fff", padding:"12px 20px", borderRadius:12, fontWeight:700, fontSize:14, textDecoration:"none", boxShadow:`0 4px 15px ${c.from}44` }}>
                          View Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:48 }}>
                  {Array.from({ length:totalPages },(_,i)=>i+1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      style={{ width:42, height:42, borderRadius:12, border:"none", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif",
                        background: currentPage===page ? "linear-gradient(135deg,#667eea,#764ba2)" : "rgba(255,255,255,0.9)",
                        color: currentPage===page ? "#fff" : "#555",
                        boxShadow: currentPage===page ? "0 4px 15px rgba(102,126,234,0.4)" : "0 2px 8px rgba(0,0,0,0.07)",
                      }}>
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;