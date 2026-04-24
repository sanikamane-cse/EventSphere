import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const EventRegistrations = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventRes, regRes] = await Promise.all([
        API.get(`/events/${eventId}`),
        API.get(`/registrations/event/${eventId}`),
      ]);
      if (eventRes.data.success) setEvent(eventRes.data.event);
      if (regRes.data.success) setRegistrations(regRes.data.registrations);
    } catch (error) {
      toast.error("Failed to load!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (registrationId) => {
    setVerifying(registrationId);
    try {
      await API.put(`/registrations/${registrationId}/verify`);
      toast.success("Payment verified! ✅");
      fetchData();
    } catch (error) {
      toast.error("Verification failed!");
    } finally {
      setVerifying(null);
    }
  };

  const catColors = {
    workshop:  { from: "#ff6b35", to: "#f7c59f" },
    seminar:   { from: "#4d96ff", to: "#74c0fc" },
    technical: { from: "#7c3aed", to: "#a78bfa" },
    cultural:  { from: "#ec4899", to: "#f9a8d4" },
    sports:    { from: "#22c55e", to: "#86efac" },
    other:     { from: "#667eea", to: "#764ba2" },
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #f0f7ff 100%)", minHeight: "100vh", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .reg-row { background: rgba(255,255,255,0.9); border-radius: 16px; padding: 20px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); border: 1px solid rgba(255,255,255,0.9); transition: all 0.2s; }
        .reg-row:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
        .verify-btn { border: none; border-radius: 10px; padding: 8px 18px; font-size: 13px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .verify-btn:hover { transform: translateY(-2px); }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ background: `linear-gradient(135deg, ${catColors[event?.category]?.from || "#667eea"}, ${catColors[event?.category]?.to || "#764ba2"})`, borderRadius: 24, padding: "32px 36px", marginBottom: 32, position: "relative", overflow: "hidden" }}>
          <div style={{ position:"absolute", top:-40, right:-40, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <button onClick={() => navigate(-1)} style={{ background:"rgba(255,255,255,0.2)", border:"none", borderRadius:10, padding:"8px 16px", color:"#fff", cursor:"pointer", fontSize:13, fontWeight:600, marginBottom:16, backdropFilter:"blur(10px)" }}>
            ← Back
          </button>
          <h1 style={{ fontSize:"clamp(20px,4vw,30px)", fontWeight:800, color:"#fff", marginBottom:6 }}>
            📋 Event Registrations
          </h1>
          {event && (
            <p style={{ color:"rgba(255,255,255,0.85)", fontSize:15, fontWeight:500 }}>
              {event.title} · {registrations.length} registrations
            </p>
          )}
        </div>

        {/* Stats */}
        {registrations.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:16, marginBottom:28 }}>
            {[
              { icon:"👥", label:"Total", value: registrations.length, color:"#667eea", bg:"#f0eeff" },
              { icon:"✅", label:"Payment Verified", value: registrations.filter(r => r.paymentVerified).length, color:"#22c55e", bg:"#ebfbee" },
              { icon:"⏳", label:"Pending Verify", value: registrations.filter(r => !r.paymentVerified && r.paymentStatus === "pending").length, color:"#f59e0b", bg:"#fff8e1" },
              { icon:"🆓", label:"Free", value: registrations.filter(r => r.paymentStatus === "free").length, color:"#4d96ff", bg:"#eef6ff" },
            ].map(({ icon, label, value, color, bg }) => (
              <div key={label} style={{ background:"rgba(255,255,255,0.85)", borderRadius:16, padding:18, boxShadow:"0 4px 16px rgba(0,0,0,0.06)", display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:42, height:42, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>{icon}</div>
                <div>
                  <div style={{ fontSize:20, fontWeight:800, color:"#1a1a2e" }}>{value}</div>
                  <div style={{ fontSize:11, color:"#888", fontWeight:600 }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Registrations List */}
        {loading ? (
          <div style={{ display:"flex", justifyContent:"center", padding:"80px 0" }}>
            <div style={{ width:44, height:44, border:"3px solid rgba(102,126,234,0.2)", borderTop:"3px solid #667eea", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
          </div>
        ) : registrations.length === 0 ? (
          <div style={{ textAlign:"center", padding:"80px 0", background:"rgba(255,255,255,0.8)", borderRadius:24 }}>
            <div style={{ fontSize:64, marginBottom:16 }}>👥</div>
            <h3 style={{ fontSize:20, fontWeight:700, color:"#333" }}>No registrations yet!</h3>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {registrations.map((reg, i) => (
              <div key={reg._id} className="reg-row fade-up" style={{ animationDelay:`${i*0.05}s` }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:16 }}>
                  
                  {/* Student Info */}
                  <div style={{ display:"flex", gap:14, alignItems:"center" }}>
                    <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#667eea,#764ba2)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:18, flexShrink:0 }}>
                      {reg.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontWeight:700, color:"#1a1a2e", fontSize:16, marginBottom:2 }}>{reg.user?.name}</p>
                      <p style={{ color:"#888", fontSize:13 }}>{reg.user?.email}</p>
                      <p style={{ color:"#aaa", fontSize:12 }}>{reg.user?.college}</p>
                    </div>
                  </div>

                  {/* Payment Status & Actions */}
                  <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:10 }}>
                    
                    {/* Status Badge */}
                    <span style={{
                      background: reg.paymentVerified ? "#ebfbee" : reg.paymentStatus === "free" ? "#eef6ff" : "#fff8e1",
                      color: reg.paymentVerified ? "#22c55e" : reg.paymentStatus === "free" ? "#1971c2" : "#f59e0b",
                      borderRadius:100, padding:"4px 14px", fontSize:12, fontWeight:700
                    }}>
                      {reg.paymentStatus === "free" ? "🆓 Free" : reg.paymentVerified ? "✅ Payment Verified" : "⏳ Payment Pending"}
                    </span>

                    {/* Registered Date */}
                    <p style={{ color:"#bbb", fontSize:11 }}>
                      Registered: {new Date(reg.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                    </p>

                    {/* Verify Button */}
                    {reg.paymentStatus === "pending" && !reg.paymentVerified && (
                      <button onClick={() => handleVerify(reg._id)} disabled={verifying === reg._id}
                        className="verify-btn"
                        style={{ background:"linear-gradient(135deg,#22c55e,#16a34a)", color:"#fff", boxShadow:"0 4px 12px rgba(34,197,94,0.3)" }}>
                        {verifying === reg._id ? "Verifying..." : "✅ Verify Payment"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Screenshot */}
                {reg.paymentScreenshot && (
                  <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid #f0f0f0" }}>
                    <p style={{ fontSize:13, fontWeight:600, color:"#888", marginBottom:10 }}>💳 Payment Screenshot:</p>
                    <img
                      src={reg.paymentScreenshot}
                      alt="Payment Screenshot"
                      style={{ maxWidth:300, borderRadius:12, border:"2px solid #e8e8ff", cursor:"pointer" }}
                      onClick={() => window.open(reg.paymentScreenshot, "_blank")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrations;