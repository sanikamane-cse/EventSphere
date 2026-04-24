import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchMyEvents(); }, []);

  const fetchMyEvents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/events/my-events");
      if (data.success) setEvents(data.events);
    } catch (error) {
      toast.error("Failed to fetch events!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    try {
      await API.delete(`/events/${id}`);
      toast.success("Event deleted!");
      fetchMyEvents();
    } catch (error) {
      toast.error("Delete failed!");
    }
  };

  const statusConfig = {
    pending:  { bg: "#fff8e1", text: "#f59e0b", border: "#fde68a", label: "⏳ Pending" },
    approved: { bg: "#ebfbee", text: "#22c55e", border: "#b2f2bb", label: "✅ Approved" },
    rejected: { bg: "#fff0f0", text: "#ef4444", border: "#fecaca", label: "❌ Rejected" },
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

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #f0f7ff 100%)", minHeight: "100vh", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .ev-action-btn { border: none; border-radius: 10px; padding: 9px 18px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center; }
        .ev-action-btn:hover { transform: translateY(-2px); }
        .my-ev-card { background: rgba(255,255,255,0.9); border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.07); border: 1px solid rgba(255,255,255,0.9); transition: all 0.3s ease; }
        .my-ev-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 24, padding: "36px 40px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ position:"relative", zIndex:1, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
            <div>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", borderRadius:100, padding:"6px 16px", marginBottom:12, backdropFilter:"blur(10px)" }}>
                <span>📋</span>
                <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>Organizer</span>
              </div>
              <h1 style={{ fontSize:"clamp(22px,4vw,34px)", fontWeight:800, color:"#fff", marginBottom:6, letterSpacing:-0.5 }}>My Events</h1>
              <p style={{ color:"rgba(255,255,255,0.8)", fontSize:15 }}>{events.length} event{events.length !== 1 ? "s" : ""} created</p>
            </div>
            <Link to="/create-event" style={{ background:"rgba(255,255,255,0.2)", backdropFilter:"blur(10px)", color:"#fff", padding:"12px 24px", borderRadius:14, fontWeight:700, fontSize:14, textDecoration:"none", border:"1px solid rgba(255,255,255,0.3)", whiteSpace:"nowrap" }}>
              + Create New Event
            </Link>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
            <div style={{ width:44, height:44, border:"3px solid rgba(102,126,234,0.2)", borderTop:"3px solid #667eea", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", background:"rgba(255,255,255,0.8)", borderRadius:24 }}>
            <div style={{ fontSize:72, marginBottom:16 }}>🎪</div>
            <h3 style={{ fontSize:22, fontWeight:700, color:"#333", marginBottom:8 }}>No events yet!</h3>
            <p style={{ color:"#888", marginBottom:24 }}>Create your first event!</p>
            <Link to="/create-event" style={{ background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", padding:"12px 28px", borderRadius:12, fontWeight:700, textDecoration:"none" }}>
              + Create Event
            </Link>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(340px, 1fr))", gap:24 }}>
            {events.map((event, i) => {
              const c = catColors[event.category] || catColors.other;
              const s = statusConfig[event.status] || statusConfig.pending;
              const emoji = catEmoji[event.category] || "🎪";
              return (
                <div key={event._id} className="my-ev-card fade-up" style={{ animationDelay:`${i*0.06}s` }}>
                  
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
                    <div style={{ position:"absolute", top:12, left:12, display:"flex", gap:6, flexWrap:"wrap" }}>
                      <span style={{ background:c.bg, color:c.text, borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{event.category}</span>
                      <span style={{ background:s.bg, color:s.text, border:`1px solid ${s.border}`, borderRadius:100, padding:"4px 12px", fontSize:11, fontWeight:700 }}>{s.label}</span>
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
                    
                    <div style={{ display:"flex", gap:12, flexWrap:"wrap", marginBottom:14 }}>
                      {[
                        ["📅", new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})],
                        ["⏰", event.time],
                        ["📍", event.venue?.substring(0,25)+(event.venue?.length>25?"...":"")],
                      ].map(([icon, text]) => (
                        <span key={icon} style={{ color:"#777", fontSize:12, display:"flex", alignItems:"center", gap:4 }}>{icon} {text}</span>
                      ))}
                    </div>

                    {/* Capacity Bar */}
                    <div style={{ marginBottom:16 }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                        <span style={{ fontSize:12, color:"#888", fontWeight:600 }}>Registrations</span>
                        <span style={{ fontSize:12, color:"#555", fontWeight:700 }}>{event.registeredCount || 0}/{event.capacity}</span>
                      </div>
                      <div style={{ background:"#f0f0f0", borderRadius:100, height:6, overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:100, background:`linear-gradient(90deg,${c.from},${c.to})`, width:`${Math.min(((event.registeredCount||0)/event.capacity)*100,100)}%`, transition:"width 0.5s ease" }} />
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      <button onClick={() => navigate(`/edit-event/${event._id}`)} className="ev-action-btn"
                        style={{ flex:1, background:"linear-gradient(135deg,#667eea,#764ba2)", color:"#fff", boxShadow:"0 4px 12px rgba(102,126,234,0.3)" }}>
                        ✏️ Edit
                      </button>
                      <Link to={`/events/${event._id}`} className="ev-action-btn"
                        style={{ flex:1, background:"#f0eeff", color:"#667eea", border:"1px solid #d0bfff", textDecoration:"none" }}>
                        👁️ View
                      </Link>
                      <Link to={`/event-registrations/${event._id}`} className="ev-action-btn"
                        style={{ flex:1, background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", textDecoration:"none", boxShadow:"0 4px 12px rgba(34,197,94,0.3)" }}>
                        👥 Registrations
                      </Link>
                      <button onClick={() => handleDelete(event._id)} className="ev-action-btn"
                        style={{ background:"#fff0f0", color:"#ef4444", border:"1px solid #fecaca" }}>
                        🗑️
                      </button>
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

export default MyEvents;