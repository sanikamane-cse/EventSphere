import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRegistrations(); }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/registrations/my");
      if (data.success) setRegistrations(data.registrations);
    } catch (error) {
      toast.error("Failed to fetch registrations!");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (eventId) => {
    if (!window.confirm("Cancel this registration?")) return;
    try {
      await API.delete(`/registrations/${eventId}`);
      toast.success("Registration cancelled!");
      fetchRegistrations();
    } catch (error) {
      toast.error("Cancel failed!");
    }
  };

  const catColors = {
    workshop:  { bg: "#fff3ee", text: "#e8590c", from: "#ff6b35", to: "#f7c59f" },
    seminar:   { bg: "#eef6ff", text: "#1971c2", from: "#4d96ff", to: "#74c0fc" },
    technical: { bg: "#f3f0ff", text: "#6741d9", from: "#7c3aed", to: "#a78bfa" },
    cultural:  { bg: "#fff0f6", text: "#c2255c", from: "#ec4899", to: "#f9a8d4" },
    sports:    { bg: "#ebfbee", text: "#2f9e44", from: "#22c55e", to: "#86efac" },
    other:     { bg: "#f8f9fa", text: "#495057", from: "#667eea", to: "#764ba2" },
  };

  const catEmoji = {
    workshop: "🛠️", seminar: "🎤", technical: "💻",
    cultural: "🎭", sports: "⚽", other: "🎪",
  };

  const isUpcoming = (date) => new Date(date) >= new Date();

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #f0f7ff 100%)", minHeight: "100vh", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .reg-card { background: rgba(255,255,255,0.9); border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid rgba(255,255,255,0.9); transition: all 0.3s ease; }
        .reg-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .cancel-btn { border-radius: 10px; padding: 9px 18px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; background: #fff0f0; color: #ef4444; border: 1px solid #fecaca; }
        .cancel-btn:hover { background: #ef4444; color: #fff; transform: translateY(-2px); }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #4d96ff, #12c2e9)", borderRadius: 24, padding: "36px 40px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", borderRadius:100, padding:"6px 16px", marginBottom:12, backdropFilter:"blur(10px)" }}>
              <span>🎟️</span>
              <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>Student</span>
            </div>
            <h1 style={{ fontSize:"clamp(22px,4vw,34px)", fontWeight:800, color:"#fff", marginBottom:6, letterSpacing:-0.5 }}>My Registrations</h1>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:15 }}>{registrations.length} event{registrations.length !== 1 ? "s" : ""} registered</p>
          </div>
        </div>

        {/* Stats */}
        {registrations.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:16, marginBottom:28 }}>
            {[
              { icon:"🎯", label:"Total", value: registrations.length, color:"#667eea", bg:"#f0eeff" },
              { icon:"📅", label:"Upcoming", value: registrations.filter(r => isUpcoming(r.event?.date)).length, color:"#22c55e", bg:"#ebfbee" },
              { icon:"✅", label:"Attended", value: registrations.filter(r => !isUpcoming(r.event?.date)).length, color:"#f59e0b", bg:"#fff8e1" },
            ].map(({ icon, label, value, color, bg }) => (
              <div key={label} style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(10px)", borderRadius:16, padding:20, boxShadow:"0 4px 16px rgba(0,0,0,0.06)", border:"1px solid rgba(255,255,255,0.9)", display:"flex", alignItems:"center", gap:14 }}>
                <div style={{ width:46, height:46, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 }}>{icon}</div>
                <div>
                  <div style={{ fontSize:22, fontWeight:800, color:"#1a1a2e" }}>{value}</div>
                  <div style={{ fontSize:12, color:"#888", fontWeight:600 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
            <div style={{ width:44, height:44, border:"3px solid rgba(102,126,234,0.2)", borderTop:"3px solid #667eea", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : registrations.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", background:"rgba(255,255,255,0.8)", borderRadius:24 }}>
            <div style={{ fontSize:72, marginBottom:16 }}>🎟️</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"#333", marginBottom:8 }}>No registrations yet!</h3>
            <p style={{ color:"#888", marginBottom:24 }}>Explore events and register now!</p>
            <Link to="/" style={{ background:"linear-gradient(135deg,#4d96ff,#12c2e9)", color:"#fff", padding:"12px 28px", borderRadius:12, fontWeight:700, textDecoration:"none" }}>
              Browse Events →
            </Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:24 }}>
            {registrations.map((reg, i) => {
              const event = reg.event;
              if (!event) return null;
              const c = catColors[event.category] || catColors.other;
              const emoji = catEmoji[event.category] || "🎪";
              const upcoming = isUpcoming(event.date);
              return (
                <div key={reg._id} className="reg-card fade-up" style={{ animationDelay:`${i*0.06}s` }}>

                  {/* Event Image */}
                  <div style={{ height:180, background:`linear-gradient(135deg,${c.from}44,${c.to}33)`, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {event.posterImage ? (
                      <img src={event.posterImage} alt={event.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                    ) : (
                      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
                        <span style={{ fontSize:56 }}>{emoji}</span>
                        <span style={{ fontSize:11, fontWeight:700, color:c.text, textTransform:"uppercase", letterSpacing:1.5, background:c.bg, padding:"4px 12px", borderRadius:100 }}>{event.category}</span>
                      </div>
                    )}
                    {/* Badges */}
                    <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:6 }}>
                      <span style={{ background:c.bg, color:c.text, borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{event.category}</span>
                      <span style={{ background: upcoming?"#ebfbee":"#f8f9fa", color: upcoming?"#2f9e44":"#888", borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700 }}>
                        {upcoming ? "📅 Upcoming" : "✅ Attended"}
                      </span>
                    </div>
                    <div style={{ position:"absolute", top:12, right:12 }}>
                      <span style={{ background: event.isPaid?"#fff3ee":"#ebfbee", color: event.isPaid?"#e8590c":"#2f9e44", borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700 }}>
                        {event.isPaid ? `₹${event.price}` : "FREE"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding:20 }}>
                    <h3 style={{ fontSize:17, fontWeight:700, color:"#1a1a2e", marginBottom:6, lineHeight:1.3 }}>{event.title}</h3>

                    <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:16 }}>
                      {[
                        ["📅", new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})],
                        ["⏰", event.time],
                        ["📍", event.venue?.substring(0,25)+(event.venue?.length>25?"...":"")],
                        ["🎟️", `Registered ${new Date(reg.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}`],
                      ].map(([icon, text]) => (
                        <span key={icon} style={{ color:"#777", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>{icon} {text}</span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display:"flex", gap:8 }}>
                      <Link to={`/events/${event._id}`}
                        style={{ flex:1, background:`linear-gradient(135deg,${c.from},${c.to})`, color:"#fff", padding:"10px 18px", borderRadius:10, fontWeight:700, fontSize:13, textDecoration:"none", textAlign:"center", boxShadow:`0 4px 12px ${c.from}44` }}>
                        👁️ View Details
                      </Link>
                      {upcoming && (
                        <button onClick={() => handleCancel(event._id)} className="cancel-btn">
                          ❌ Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyRegistrations;