import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEvent();
    if (user?.role === "student") checkRegistration();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const { data } = await API.get(`/events/${id}`);
      if (data.success) setEvent(data.event);
    } catch (error) {
      toast.error("Event not found!");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    try {
      const { data } = await API.get("/registrations/my");
      const registered = data.registrations.some((r) => r.event?._id === id);
      setIsRegistered(registered);
    } catch (error) {}
  };

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "eventsphere");
      const res = await fetch(`https://api.cloudinary.com/v1_1/djrlebn4l/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setScreenshotUrl(data.secure_url);
        toast.success("Screenshot uploaded! ✅");
      }
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) return navigate("/login");
    if (event.isPaid && !showPayment) {
      setShowPayment(true);
      return;
    }
    if (event.isPaid && !screenshotUrl) {
      toast.error("Please upload payment screenshot first!");
      return;
    }
    setRegistering(true);
    try {
      await API.post(`/registrations/${id}`, {
        paymentScreenshot: screenshotUrl,
      });
      toast.success("Registered successfully! 🎉");
      setIsRegistered(true);
      setShowPayment(false);
      setEvent((prev) => ({ ...prev, registeredCount: prev.registeredCount + 1 }));
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setRegistering(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel registration?")) return;
    setRegistering(true);
    try {
      await API.delete(`/registrations/${id}`);
      toast.success("Registration cancelled!");
      setIsRegistered(false);
      setEvent((prev) => ({ ...prev, registeredCount: prev.registeredCount - 1 }));
    } catch (error) {
      toast.error("Failed to cancel!");
    } finally {
      setRegistering(false);
    }
  };

  const catColors = {
    workshop: { from: "#ff6b35", to: "#f7c59f", text: "#e8590c", bg: "#fff3ee" },
    seminar: { from: "#4d96ff", to: "#74c0fc", text: "#1971c2", bg: "#eef6ff" },
    technical: { from: "#7c3aed", to: "#a78bfa", text: "#6741d9", bg: "#f3f0ff" },
    cultural: { from: "#ec4899", to: "#f9a8d4", text: "#c2255c", bg: "#fff0f6" },
    sports: { from: "#22c55e", to: "#86efac", text: "#2f9e44", bg: "#ebfbee" },
    other: { from: "#667eea", to: "#764ba2", text: "#555", bg: "#f8f9ff" },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div style={{ width: 48, height: 48, border: "3px solid #e8e8ff", borderTop: "3px solid #667eea", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!event) return null;

  const colors = catColors[event.category] || catColors.other;
  const upiId = "eventsphere@paytm";
  const upiString = `upi://pay?pa=${upiId}&pn=EventSphere&am=${event.price}&cu=INR&tn=${encodeURIComponent(event.title)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#f8f9ff", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes modalIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        .fade-up{animation:fadeUp 0.5s ease forwards}
        .reg-btn{transition:all 0.2s ease}
        .reg-btn:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.2)}
        .modal-overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto}
        .modal-box{background:#fff;border-radius:24px;padding:32px;max-width:440px;width:100%;animation:modalIn 0.3s ease;max-height:90vh;overflow-y:auto}
        .upload-area{border:2px dashed #d0bfff;border-radius:16px;padding:24px;text-align:center;cursor:pointer;transition:all 0.2s}
        .upload-area:hover{border-color:#667eea;background:#f8f6ff}
      `}</style>

      {/* Hero Banner */}
      <div style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, padding: "60px 24px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />

        <div style={{ maxWidth: 800, margin: "0 auto", position: "relative", zIndex: 1 }} className="fade-up">
          <button onClick={() => navigate(-1)} style={{ background: "rgba(255,255,255,0.2)", border: "none", borderRadius: 10, padding: "8px 16px", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600, marginBottom: 24, backdropFilter: "blur(10px)" }}>
            ← Back
          </button>

          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.2)", color: "#fff", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 700, textTransform: "capitalize", backdropFilter: "blur(10px)" }}>
              {event.category}
            </span>
            <span style={{ background: event.isPaid ? "rgba(255,107,53,0.3)" : "rgba(34,197,94,0.3)", color: "#fff", borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 700, backdropFilter: "blur(10px)" }}>
              {event.isPaid ? `₹${event.price}` : "FREE"}
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>
            {event.title}
          </h1>
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 16, fontWeight: 500 }}>
            by {event.organizer?.name} · {event.organizer?.college}
          </p>
        </div>
      </div>

      {/* Wave */}
      <div style={{ marginTop: -2, lineHeight: 0 }}>
        <svg viewBox="0 0 1440 60" style={{ width: "100%", display: "block" }}>
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#f8f9ff" />
        </svg>
      </div>

      <div style={{ maxWidth: 800, margin: "-20px auto 60px", padding: "0 24px" }}>
        {/* Poster */}
        {event.posterImage && (
          <div style={{ borderRadius: 20, overflow: "hidden", marginBottom: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <img src={event.posterImage} alt={event.title} style={{ width: "100%", height: 300, objectFit: "cover" }} />
          </div>
        )}

        {/* Info Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { icon: "📅", label: "Date", value: new Date(event.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) },
            { icon: "⏰", label: "Time", value: event.time },
            { icon: "📍", label: "Venue", value: event.venue },
            { icon: "👥", label: "Seats Left", value: event.seatsRemaining === 0 ? "FULL!" : `${event.seatsRemaining} left` },
          ].map(({ icon, label, value }) => (
            <div key={label} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ color: "#888", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
              <div style={{ color: "#1a1a2e", fontSize: 14, fontWeight: 700 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Capacity Bar */}
        <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, color: "#1a1a2e" }}>Registrations</span>
            <span style={{ color: "#888", fontSize: 14 }}>{event.registeredCount}/{event.capacity}</span>
          </div>
          <div style={{ background: "#f0f0f0", borderRadius: 100, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 100, background: `linear-gradient(90deg, ${colors.from}, ${colors.to})`, width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%`, transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Description */}
        <div style={{ background: "#fff", borderRadius: 20, padding: 28, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 16 }}>About this Event</h2>
          <p style={{ color: "#555", lineHeight: 1.8, fontSize: 15 }}>{event.description}</p>
        </div>

        {/* Tags */}
        {event.tags?.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
            {event.tags.map((tag) => (
              <span key={tag} style={{ background: colors.bg, color: colors.text, borderRadius: 100, padding: "6px 16px", fontSize: 13, fontWeight: 600 }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Register Button */}
        {user?.role === "student" && (
          isRegistered ? (
            <div>
              <div style={{ background: "#ebfbee", border: "1px solid #b2f2bb", borderRadius: 16, padding: 20, marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                <p style={{ color: "#2f9e44", fontWeight: 700, fontSize: 16 }}>You are registered for this event!</p>
              </div>
              <button onClick={handleCancel} disabled={registering} className="reg-btn"
                style={{ width: "100%", background: "linear-gradient(135deg, #ef4444, #dc2626)", border: "none", borderRadius: 16, padding: "18px", color: "#fff", fontWeight: 800, fontSize: 18, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {registering ? "Cancelling..." : "❌ Cancel Registration"}
              </button>
            </div>
          ) : (
            <button onClick={handleRegister} disabled={event.isFull || registering} className="reg-btn"
              style={{ width: "100%", background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, border: "none", borderRadius: 16, padding: "18px", color: "#fff", fontWeight: 800, fontSize: 18, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", opacity: event.isFull ? 0.5 : 1 }}>
              {event.isFull ? "Event Full 😢" : registering ? "Registering..." : event.isPaid ? `💳 Pay ₹${event.price} & Register` : "🎯 Register for this Event"}
            </button>
          )
        )}

        {!user && (
          <button onClick={() => navigate("/login")} className="reg-btn"
            style={{ width: "100%", background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, border: "none", borderRadius: 16, padding: "18px", color: "#fff", fontWeight: 800, fontSize: 18, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            🔐 Login to Register
          </button>
        )}
      </div>

      {/* Payment Modal */}
      {showPayment && (
        <div className="modal-overlay" onClick={() => setShowPayment(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", marginBottom: 6, textAlign: "center" }}>💳 Complete Payment</h2>
            <p style={{ color: "#888", fontSize: 14, textAlign: "center", marginBottom: 24 }}>Scan QR → Pay → Upload Screenshot → Register</p>

            {/* Amount */}
            <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 16, padding: 16, marginBottom: 20, textAlign: "center" }}>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Amount to Pay</p>
              <p style={{ color: "#fff", fontSize: 32, fontWeight: 800 }}>₹{event.price}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>{event.title}</p>
            </div>

            {/* QR Code */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ background: "#f8f9ff", borderRadius: 16, padding: 16, display: "inline-block", border: "2px solid #e8e8ff" }}>
                <img src={qrUrl} alt="UPI QR Code" style={{ width: 180, height: 180, display: "block" }} />
              </div>
              <p style={{ color: "#888", fontSize: 12, marginTop: 8 }}>Scan with GPay, PhonePe, Paytm, BHIM</p>
            </div>

            {/* UPI ID */}
            <div style={{ background: "#f3f0ff", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#888", fontSize: 11, fontWeight: 600, marginBottom: 2 }}>UPI ID</p>
                <p style={{ color: "#6741d9", fontSize: 15, fontWeight: 700 }}>{upiId}</p>
              </div>
              <button onClick={() => { navigator.clipboard.writeText(upiId); toast.success("UPI ID copied!"); }}
                style={{ background: "#667eea", color: "#fff", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                Copy
              </button>
            </div>

            {/* Screenshot Upload */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", marginBottom: 10 }}>📸 Upload Payment Screenshot</p>
              
              {screenshotUrl ? (
                <div style={{ position: "relative" }}>
                  <img src={screenshotUrl} alt="Payment Screenshot" style={{ width: "100%", borderRadius: 12, border: "2px solid #b2f2bb" }} />
                  <div style={{ position:"absolute", top:8, right:8, background:"#22c55e", color:"#fff", borderRadius:100, padding:"4px 12px", fontSize:12, fontWeight:700 }}>
                    ✅ Uploaded!
                  </div>
                  <button onClick={() => setScreenshotUrl("")}
                    style={{ marginTop:8, background:"#fff0f0", color:"#ef4444", border:"1px solid #fecaca", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:600, cursor:"pointer", width:"100%" }}>
                    🔄 Change Screenshot
                  </button>
                </div>
              ) : (
                <label className="upload-area">
                  <input type="file" accept="image/*" onChange={handleScreenshotUpload} style={{ display:"none" }} />
                  {uploading ? (
                    <div>
                      <div style={{ width:32, height:32, border:"3px solid #e8e8ff", borderTop:"3px solid #667eea", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 8px" }} />
                      <p style={{ color:"#888", fontSize:13 }}>Uploading...</p>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize:36, marginBottom:8 }}>📸</div>
                      <p style={{ color:"#667eea", fontWeight:700, fontSize:14, marginBottom:4 }}>Click to upload screenshot</p>
                      <p style={{ color:"#aaa", fontSize:12 }}>JPG, PNG supported</p>
                    </div>
                  )}
                </label>
              )}
            </div>

            {/* Confirm Button */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={handleRegister}
                disabled={registering || !screenshotUrl || uploading}
                style={{ background: screenshotUrl ? "linear-gradient(135deg, #22c55e, #16a34a)" : "#e0e0e0", border: "none", borderRadius: 14, padding: "16px", color: screenshotUrl ? "#fff" : "#aaa", fontWeight: 800, fontSize: 16, cursor: screenshotUrl ? "pointer" : "not-allowed", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {registering ? "Confirming..." : !screenshotUrl ? "Upload screenshot first" : "✅ Confirm Registration"}
              </button>
              <button onClick={() => setShowPayment(false)}
                style={{ background: "#f0f0f0", border: "none", borderRadius: 14, padding: "12px", color: "#666", fontWeight: 600, fontSize: 14, cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;