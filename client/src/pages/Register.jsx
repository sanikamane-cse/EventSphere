import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "student", college: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await register(formData);
      if (result.success) {
        toast.success("Account created! 🎉");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: "student", label: "Student", emoji: "🎓", desc: "Browse & register for events" },
    { value: "organizer", label: "Organizer", emoji: "🚀", desc: "Create & manage events" },
  ];

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .reg-input { width: 100%; border: 2px solid #f0f0f0; border-radius: 12px; padding: 14px 18px; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif; color: #333; background: #fafafa; transition: all 0.2s; box-sizing: border-box; outline: none; }
        .reg-input:focus { border-color: #667eea; background: #fff; box-shadow: 0 0 0 4px rgba(102,126,234,0.1); }
        .reg-btn { width: 100%; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 12px; padding: 15px; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .reg-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(102,126,234,0.45); }
        .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .role-card { border: 2px solid #f0f0f0; border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; background: #fafafa; flex: 1; }
        .role-card:hover { border-color: #667eea; background: #f0eeff; }
        .role-card.selected { border-color: #667eea; background: linear-gradient(135deg, #f0eeff, #fef3ff); }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .card-anim { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      {/* Blobs */}
      <div style={{ position:"absolute", top:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
      <div style={{ position:"absolute", bottom:-60, right:-60, width:250, height:250, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />

      <div className="card-anim" style={{ width: "100%", maxWidth: 480 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", border: "1px solid rgba(255,255,255,0.3)" }}>
            🎪
          </div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>EventSphere</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 }}>Join thousands of students & organizers</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 40, boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e", marginBottom: 6 }}>Create Account ✨</h2>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 28 }}>Fill in your details to get started</p>

          <form onSubmit={handleSubmit}>
            {/* Role Selection */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>I am a</label>
              <div style={{ display: "flex", gap: 12 }}>
                {roles.map(({ value, label, emoji, desc }) => (
                  <div key={value} className={`role-card ${formData.role === value ? "selected" : ""}`} onClick={() => setFormData({ ...formData, role: value })}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{emoji}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#1a1a2e", marginBottom: 2 }}>{label}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required className="reg-input" />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@college.edu" required className="reg-input" />
            </div>

            {/* College */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>College Name</label>
              <input type="text" name="college" value={formData.college} onChange={handleChange} placeholder="MIT Pune, VIT, etc." className="reg-input" />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Min 6 characters" required minLength={6} className="reg-input" />
            </div>

            <button type="submit" disabled={loading} className="reg-btn">
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ color: "#888", fontSize: 14 }}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#667eea", fontWeight: 700, textDecoration: "none" }}>Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;