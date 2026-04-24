
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  const studentCards = [
    { icon: "🎟️", title: "My Registrations", desc: "View all events you've registered for", link: "/my-registrations", color: "#4d96ff", bg: "#eef6ff" },
    { icon: "🔍", title: "Browse Events", desc: "Discover new events happening around you", link: "/", color: "#22c55e", bg: "#ebfbee" },
    { icon: "👤", title: "My Profile", desc: "Update your profile and preferences", link: "/profile", color: "#764ba2", bg: "#f3f0ff" },
  ];

  const organizerCards = [
    { icon: "➕", title: "Create Event", desc: "Plan and publish a new event", link: "/create-event", color: "#667eea", bg: "#f0eeff" },
    { icon: "📋", title: "My Events", desc: "Manage and track your created events", link: "/my-events", color: "#f64f59", bg: "#fff0f0" },
    { icon: "👤", title: "My Profile", desc: "Update your organizer profile", link: "/profile", color: "#764ba2", bg: "#f3f0ff" },
  ];

  const adminCards = [
    { icon: "⚙️", title: "Admin Panel", desc: "Approve events and manage users", link: "/admin", color: "#f64f59", bg: "#fff0f0" },
    { icon: "➕", title: "Create Event", desc: "Create events as admin", link: "/create-event", color: "#667eea", bg: "#f0eeff" },
    { icon: "📋", title: "All Events", desc: "View and manage all events", link: "/my-events", color: "#22c55e", bg: "#ebfbee" },
    { icon: "👤", title: "My Profile", desc: "Admin profile settings", link: "/profile", color: "#764ba2", bg: "#f3f0ff" },
  ];

  const cards = user?.role === "admin" ? adminCards : user?.role === "organizer" ? organizerCards : studentCards;

  const greetings = {
    student: { emoji: "👋", msg: "Ready to discover amazing events?", color: "#4d96ff" },
    organizer: { emoji: "🚀", msg: "Ready to create something amazing?", color: "#667eea" },
    admin: { emoji: "⚡", msg: "Manage your platform with ease!", color: "#f64f59" },
  };

  const g = greetings[user?.role] || greetings.student;

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #f0f7ff 100%)", minHeight: "100vh", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .dash-card { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); text-decoration: none; display: block; }
        .dash-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 24px 48px rgba(0,0,0,0.13) !important; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Welcome Banner */}
        <div className="fade-up" style={{ background: "linear-gradient(135deg, #667eea, #764ba2, #f64f59)", borderRadius: 24, padding: "40px", marginBottom: 40, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -60, left: -20, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.15)", borderRadius: 100, padding: "6px 16px", marginBottom: 16, backdropFilter: "blur(10px)" }}>
              <span style={{ fontSize: 14 }}>{g.emoji}</span>
              <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, textTransform: "capitalize" }}>{user?.role} Dashboard</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#fff", marginBottom: 8, letterSpacing: -0.5 }}>
              Welcome back, {user?.name?.split(" ")[0]}! {g.emoji}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>{g.msg}</p>
            <div style={{ display: "flex", gap: 16, marginTop: 24, flexWrap: "wrap" }}>
              <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 20px", backdropFilter: "blur(10px)" }}>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>Email</span>
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.email}</span>
              </div>
              {user?.college && (
                <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: "10px 20px", backdropFilter: "blur(10px)" }}>
                  <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, fontWeight: 600, display: "block", textTransform: "uppercase", letterSpacing: 0.5 }}>College</span>
                  <span style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{user?.college}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a2e", marginBottom: 20 }}>Quick Actions</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {cards.map((card, i) => (
            <Link
              key={i}
              to={card.link}
              className="dash-card"
              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(10px)",
                borderRadius: 20,
                padding: 28,
                boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                border: "1px solid rgba(255,255,255,0.9)",
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 16, background: card.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, marginBottom: 16, boxShadow: `0 4px 12px ${card.color}22` }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", marginBottom: 6 }}>{card.title}</h3>
              <p style={{ color: "#888", fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>{card.desc}</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: card.color, fontSize: 13, fontWeight: 700 }}>
                Go to {card.title} <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Browse Events Banner */}
        <div style={{ marginTop: 32, background: "rgba(255,255,255,0.85)", backdropFilter: "blur(10px)", borderRadius: 20, padding: 28, boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid rgba(255,255,255,0.9)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1a1a2e", marginBottom: 4 }}>🎪 Explore All Events</h3>
            <p style={{ color: "#888", fontSize: 14 }}>Browse workshops, seminars, tech fests & more!</p>
          </div>
          <Link to="/" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", padding: "12px 28px", borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none", boxShadow: "0 4px 15px rgba(102,126,234,0.35)", whiteSpace: "nowrap" }}>
            Browse Events →
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;