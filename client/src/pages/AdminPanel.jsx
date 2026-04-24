import { useState, useEffect } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => { fetchEvents(); }, [activeTab]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/events?status=${activeTab}`);
      if (data.success) setEvents(data.events);
    } catch (error) {
      toast.error("Failed to fetch events!");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      await API.put(`/admin/events/${id}/${action}`);
      toast.success(`Event ${action}d! ✅`);
      fetchEvents();
    } catch (error) {
      toast.error("Action failed!");
    }
  };

  const tabs = [
    { value: "pending", label: "Pending", emoji: "⏳", color: "#f59e0b" },
    { value: "approved", label: "Approved", emoji: "✅", color: "#22c55e" },
    { value: "rejected", label: "Rejected", emoji: "❌", color: "#ef4444" },
  ];

  const catColors = {
    workshop: { bg: "#fff3ee", text: "#e8590c" },
    seminar: { bg: "#eef6ff", text: "#1971c2" },
    technical: { bg: "#f3f0ff", text: "#6741d9" },
    cultural: { bg: "#fff0f6", text: "#c2255c" },
    sports: { bg: "#ebfbee", text: "#2f9e44" },
    other: { bg: "#f8f9fa", text: "#495057" },
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #f0f7ff 100%)", minHeight: "100vh", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .action-btn { border: none; border-radius: 10px; padding: 9px 18px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .action-btn:hover { transform: translateY(-2px); }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #f64f59, #c471ed, #12c2e9)", borderRadius: 24, padding: "36px 40px", marginBottom: 36, position: "relative", overflow: "hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:180, height:180, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,255,255,0.15)", borderRadius:100, padding:"6px 16px", marginBottom:12, backdropFilter:"blur(10px)" }}>
              <span>⚙️</span>
              <span style={{ color:"#fff", fontSize:12, fontWeight:600 }}>Admin Panel</span>
            </div>
            <h1 style={{ fontSize:"clamp(24px,4vw,36px)", fontWeight:800, color:"#fff", marginBottom:6, letterSpacing:-0.5 }}>Event Management</h1>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:15 }}>Review, approve or reject submitted events</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:10, marginBottom:28, flexWrap:"wrap" }}>
          {tabs.map(({ value, label, emoji, color }) => (
            <button key={value} onClick={() => setActiveTab(value)}
              style={{ padding:"11px 24px", borderRadius:12, border:"none", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.2s",
                background: activeTab === value ? color : "rgba(255,255,255,0.8)",
                color: activeTab === value ? "#fff" : "#666",
                boxShadow: activeTab === value ? `0 4px 15px ${color}55` : "0 2px 8px rgba(0,0,0,0.06)",
              }}>
              {emoji} {label}
            </button>
          ))}
        </div>

        {/* Events List */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
            <div style={{ width:44, height:44, border:"3px solid rgba(102,126,234,0.2)", borderTop:"3px solid #667eea", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : events.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", background:"rgba(255,255,255,0.8)", borderRadius:24, backdropFilter:"blur(10px)" }}>
            <div style={{ fontSize:64, marginBottom:16 }}>📭</div>
            <h3 style={{ fontSize:20, fontWeight:700, color:"#333", marginBottom:8 }}>No {activeTab} events</h3>
            <p style={{ color:"#888" }}>Nothing to review right now!</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {events.map((event, i) => {
              const c = catColors[event.category] || catColors.other;
              return (
                <div key={event._id} className="fade-up" style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(10px)", borderRadius:20, padding:24, boxShadow:"0 4px 20px rgba(0,0,0,0.07)", border:"1px solid rgba(255,255,255,0.9)", animationDelay:`${i*0.06}s` }}>
                  <div style={{ display:"flex", gap:16, alignItems:"flex-start", flexWrap:"wrap" }}>
                    {/* Poster */}
                    <div style={{ width:80, height:80, borderRadius:14, overflow:"hidden", flexShrink:0, background:`linear-gradient(135deg,${c.bg},#f0f0ff)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                      {event.posterImage
                        ? <img src={event.posterImage} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                        : <span style={{ fontSize:36 }}>🎪</span>
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex:1, minWidth:200 }}>
                      <div style={{ display:"flex", gap:8, marginBottom:8, flexWrap:"wrap" }}>
                        <span style={{ background:c.bg, color:c.text, borderRadius:100, padding:"3px 12px", fontSize:11, fontWeight:700, textTransform:"capitalize" }}>{event.category}</span>
                        <span style={{ background: event.isPaid?"#fff3ee":"#ebfbee", color: event.isPaid?"#e8590c":"#2f9e44", borderRadius:100, padding:"3px 12px", fontSize:11, fontWeight:700 }}>
                          {event.isPaid ? `₹${event.price}` : "FREE"}
                        </span>
                      </div>
                      <h3 style={{ fontSize:18, fontWeight:700, color:"#1a1a2e", marginBottom:4 }}>{event.title}</h3>
                      <p style={{ color:"#888", fontSize:13, marginBottom:8 }}>by {event.organizer?.name} · {event.organizer?.college}</p>
                      <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
                        {[
                          ["📅", new Date(event.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})],
                          ["📍", event.venue],
                          ["👥", `${event.capacity} seats`],
                        ].map(([icon, text]) => (
                          <span key={icon} style={{ color:"#666", fontSize:13 }}>{icon} {text}</span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    {activeTab === "pending" && (
                      <div style={{ display:"flex", gap:8, flexShrink:0 }}>
                        <button onClick={() => handleAction(event._id, "approve")} className="action-btn"
                          style={{ background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", boxShadow:"0 4px 12px rgba(34,197,94,0.35)" }}>
                          ✅ Approve
                        </button>
                        <button onClick={() => handleAction(event._id, "reject")} className="action-btn"
                          style={{ background:"linear-gradient(135deg,#ef4444,#dc2626)", color:"#fff", boxShadow:"0 4px 12px rgba(239,68,68,0.35)" }}>
                          ❌ Reject
                        </button>
                      </div>
                    )}
                    {activeTab !== "pending" && (
                      <div style={{ padding:"8px 18px", borderRadius:10, background: activeTab==="approved"?"#ebfbee":"#fff0f0", color: activeTab==="approved"?"#2f9e44":"#ef4444", fontWeight:700, fontSize:13 }}>
                        {activeTab === "approved" ? "✅ Approved" : "❌ Rejected"}
                      </div>
                    )}
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

export default AdminPanel;