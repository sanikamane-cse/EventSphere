import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success("Welcome back! 🎉");
        navigate("/dashboard");
      } else {
        toast.error(result.message || "Login failed!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .login-input { width: 100%; border: 2px solid #f0f0f0; border-radius: 12px; padding: 14px 18px; font-size: 15px; font-family: 'Plus Jakarta Sans', sans-serif; color: #333; background: #fafafa; transition: all 0.2s; box-sizing: border-box; outline: none; }
        .login-input:focus { border-color: #667eea; background: #fff; box-shadow: 0 0 0 4px rgba(102,126,234,0.1); }
        .login-btn { width: 100%; background: linear-gradient(135deg, #667eea, #764ba2); border: none; border-radius: 12px; padding: 15px; color: #fff; font-size: 16px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; }
        .login-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(102,126,234,0.45); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        .card-anim { animation: fadeUp 0.5s ease forwards; }
      `}</style>

      {/* Decorative blobs */}
      <div style={{ position:"absolute", top:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
      <div style={{ position:"absolute", bottom:-60, right:-60, width:250, height:250, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }} />

      <div className="card-anim" style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px", border: "1px solid rgba(255,255,255,0.3)" }}>
            🎪
          </div>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, letterSpacing: -0.5 }}>EventSphere</h1>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 14, marginTop: 4 }}>Your college events platform</p>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 40, boxShadow: "0 32px 80px rgba(0,0,0,0.2)" }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1a1a2e", marginBottom: 6 }}>Welcome Back! 👋</h2>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>Sign in to your account to continue</p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@college.edu" required className="login-input" />
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#444", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" required className="login-input" />
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ color: "#888", fontSize: 14 }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#667eea", fontWeight: 700, textDecoration: "none" }}>Register here</Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div style={{ marginTop: 24, background: "linear-gradient(135deg, #f0eeff, #fef3ff)", borderRadius: 14, padding: 16, border: "1px solid rgba(102,126,234,0.15)" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#667eea", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>🔑 Demo Accounts</p>
            {[
              ["Admin", "admin@eventsphere.com", "#f64f59"],
              ["Organizer", "organizer@test.com", "#667eea"],
              ["Student", "sanika@test.com", "#22c55e"],
            ].map(([role, email, color]) => (
              <div key={role} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ background: color + "22", color: color, borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>{role}</span>
                <span style={{ color: "#666", fontSize: 12 }}>{email}</span>
              </div>
            ))}
            <p style={{ color: "#aaa", fontSize: 11, marginTop: 8 }}>Password: password123 / admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;