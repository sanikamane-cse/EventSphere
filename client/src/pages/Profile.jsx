import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [stats, setStats] = useState({ events: 0, registrations: 0 });

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    college: user?.college || "",
    avatar: user?.avatar || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    try {
      if (user?.role === "organizer") {
        const { data } = await API.get("/events/my-events");
        setStats((prev) => ({ ...prev, events: data.events?.length || 0 }));
      }
      if (user?.role === "student") {
        const { data } = await API.get("/registrations/my");
        setStats((prev) => ({ ...prev, registrations: data.registrations?.length || 0 }));
      }
    } catch (error) {}
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const formDataImg = new FormData();
      formDataImg.append("file", file);
      formDataImg.append("upload_preset", "eventsphere");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/djrlebn4l/image/upload`,
        { method: "POST", body: formDataImg }
      );
      const data = await response.json();
      if (data.secure_url) {
        setProfileData((prev) => ({ ...prev, avatar: data.secure_url }));
        toast.success("Avatar uploaded! ✅");
      }
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.put("/profile", profileData);
      if (data.success) {
        setUser(data.user);
        toast.success("Profile updated! 🎉");
      }
    } catch (error) {
      toast.error("Update failed!");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("Passwords don't match!");
    }
    setLoading(true);
    try {
      const { data } = await API.put("/profile/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      if (data.success) {
        toast.success("Password changed! 🔒");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed!");
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    student:   { color: "#4d96ff", bg: "#eef6ff", gradient: "linear-gradient(135deg, #4d96ff, #12c2e9)" },
    organizer: { color: "#667eea", bg: "#f0eeff", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
    admin:     { color: "#f64f59", bg: "#fff0f0", gradient: "linear-gradient(135deg, #f64f59, #c471ed)" },
  };
  const rc = roleConfig[user?.role] || roleConfig.student;

  const inputStyle = { width: "100%", border: "2px solid #f0f0f0", borderRadius: 12, padding: "13px 18px", fontSize: 15, fontFamily: "'Plus Jakarta Sans', sans-serif", color: "#333", background: "#fafafa", transition: "all 0.2s", boxSizing: "border-box", outline: "none" };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "linear-gradient(160deg, #f0eeff 0%, #fef3ff 40%, #f0f7ff 100%)", minHeight: "100vh", padding: "40px 24px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .prof-input:focus { border-color: #667eea !important; background: #fff !important; box-shadow: 0 0 0 4px rgba(102,126,234,0.1); }
        .prof-btn { width: 100%; border: none; border-radius: 12px; padding: 14px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: 'Plus Jakarta Sans', sans-serif; transition: all 0.2s; color: #fff; }
        .prof-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(102,126,234,0.35); }
        .prof-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Profile Header Card */}
        <div className="fade-up" style={{ background: rc.gradient, borderRadius: 24, padding: "40px", marginBottom: 28, position: "relative", overflow: "hidden" }}>
          <div style={{ position:"absolute", top:-50, right:-50, width:220, height:220, borderRadius:"50%", background:"rgba(255,255,255,0.08)" }} />
          <div style={{ position:"absolute", bottom:-40, left:-20, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

          <div style={{ position:"relative", zIndex:1, display:"flex", gap:24, alignItems:"center", flexWrap:"wrap" }}>
            {/* Avatar */}
            <div style={{ position:"relative", flexShrink:0 }}>
              <div style={{ width:90, height:90, borderRadius:22, overflow:"hidden", background:"rgba(255,255,255,0.2)", border:"3px solid rgba(255,255,255,0.4)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {profileData.avatar
                  ? <img src={profileData.avatar} alt="Avatar" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
                  : <span style={{ fontSize:38 }}>👤</span>
                }
              </div>
              <label htmlFor="avatar-upload" style={{ position:"absolute", bottom:-6, right:-6, width:30, height:30, borderRadius:"50%", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", fontSize:14 }}>
                {avatarUploading ? "⏳" : "✏️"}
              </label>
              <input type="file" id="avatar-upload" accept="image/*" onChange={handleAvatarUpload} style={{ display:"none" }} />
            </div>

            {/* Info */}
            <div style={{ flex:1 }}>
              <h1 style={{ fontSize:"clamp(20px,4vw,28px)", fontWeight:800, color:"#fff", marginBottom:4, letterSpacing:-0.5 }}>{user?.name}</h1>
              <p style={{ color:"rgba(255,255,255,0.8)", fontSize:14, marginBottom:12 }}>{user?.email}</p>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <span style={{ background:"rgba(255,255,255,0.2)", color:"#fff", borderRadius:100, padding:"4px 14px", fontSize:12, fontWeight:700, textTransform:"capitalize", backdropFilter:"blur(10px)" }}>
                  {user?.role}
                </span>
                {user?.college && (
                  <span style={{ background:"rgba(255,255,255,0.15)", color:"#fff", borderRadius:100, padding:"4px 14px", fontSize:12, fontWeight:600, backdropFilter:"blur(10px)" }}>
                    🏫 {user?.college}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))", gap:12, marginTop:24 }}>
            {user?.role === "organizer" && (
              <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 18px", backdropFilter:"blur(10px)", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#fff" }}>{stats.events}</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, fontWeight:600 }}>Events Created</div>
              </div>
            )}
            {user?.role === "student" && (
              <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 18px", backdropFilter:"blur(10px)", textAlign:"center" }}>
                <div style={{ fontSize:24, fontWeight:800, color:"#fff" }}>{stats.registrations}</div>
                <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, fontWeight:600 }}>Registered</div>
              </div>
            )}
            <div style={{ background:"rgba(255,255,255,0.15)", borderRadius:14, padding:"14px 18px", backdropFilter:"blur(10px)", textAlign:"center" }}>
              <div style={{ fontSize:24, fontWeight:800, color:"#fff", textTransform:"capitalize" }}>{user?.role}</div>
              <div style={{ color:"rgba(255,255,255,0.75)", fontSize:12, fontWeight:600 }}>Account Type</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:10, marginBottom:24 }}>
          {[
            { key:"profile", label:"✏️ Edit Profile" },
            { key:"password", label:"🔒 Change Password" },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ padding:"11px 24px", borderRadius:12, border:"none", cursor:"pointer", fontWeight:700, fontSize:14, fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"all 0.2s",
                background: activeTab === key ? rc.gradient : "rgba(255,255,255,0.8)",
                color: activeTab === key ? "#fff" : "#666",
                boxShadow: activeTab === key ? "0 4px 15px rgba(102,126,234,0.35)" : "0 2px 8px rgba(0,0,0,0.06)",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Edit Profile */}
        {activeTab === "profile" && (
          <div className="fade-up" style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(10px)", borderRadius:24, padding:36, boxShadow:"0 4px 24px rgba(0,0,0,0.07)", border:"1px solid rgba(255,255,255,0.9)" }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#1a1a2e", marginBottom:24 }}>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#666", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Full Name</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name:e.target.value})} style={inputStyle} className="prof-input" />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#666", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>College</label>
                <input type="text" value={profileData.college} onChange={(e) => setProfileData({...profileData, college:e.target.value})} style={inputStyle} className="prof-input" />
              </div>
              <div style={{ marginBottom:28 }}>
                <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#666", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Email (read only)</label>
                <input type="email" value={user?.email} disabled style={{...inputStyle, background:"#f0f0f0", color:"#aaa", cursor:"not-allowed"}} />
              </div>
              <button type="submit" disabled={loading} className="prof-btn" style={{ background: rc.gradient }}>
                {loading ? "Saving..." : "Save Changes ✅"}
              </button>
            </form>
          </div>
        )}

        {/* Change Password */}
        {activeTab === "password" && (
          <div className="fade-up" style={{ background:"rgba(255,255,255,0.85)", backdropFilter:"blur(10px)", borderRadius:24, padding:36, boxShadow:"0 4px 24px rgba(0,0,0,0.07)", border:"1px solid rgba(255,255,255,0.9)" }}>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#1a1a2e", marginBottom:24 }}>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              {[
                { label:"Current Password", key:"currentPassword", placeholder:"Enter current password" },
                { label:"New Password", key:"newPassword", placeholder:"Enter new password" },
                { label:"Confirm New Password", key:"confirmPassword", placeholder:"Confirm new password" },
              ].map(({ label, key, placeholder }) => (
                <div key={key} style={{ marginBottom:20 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:700, color:"#666", marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
                  <input type="password" value={passwordData[key]} onChange={(e) => setPasswordData({...passwordData, [key]:e.target.value})} placeholder={placeholder} required style={inputStyle} className="prof-input" />
                </div>
              ))}
              <button type="submit" disabled={loading} className="prof-btn" style={{ background: rc.gradient, marginTop:8 }}>
                {loading ? "Changing..." : "Change Password 🔒"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;