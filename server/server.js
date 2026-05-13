const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174", 
    "http://localhost:5175",
    "https://event-sphere-six-ashen.vercel.app",
    "https://event-sphere-git-main-sanikamane-cses-projects.vercel.app",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const adminRoutes = require("./routes/adminRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/profile", profileRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "EventSphere API is running 🎉" });
});

// Temp setup route
app.get("/api/setup", async (req, res) => {
  try {
    const bcrypt = require("bcryptjs");
    const User = require("./models/User");
    const Event = require("./models/Event");

    // Admin
    await User.deleteOne({ email: "admin@eventsphere.com" });
    const adminPass = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Admin",
      email: "admin@eventsphere.com",
      password: adminPass,
      role: "admin",
      college: "EventSphere",
    });

    // Organizer
    await User.deleteOne({ email: "organizer@test.com" });
    const orgPass = await bcrypt.hash("password123", 10);
    const organizer = await User.create({
      name: "Test Organizer",
      email: "organizer@test.com",
      password: orgPass,
      role: "organizer",
      college: "MIT Pune",
    });

    // Student
    await User.deleteOne({ email: "sanika@test.com" });
    const stuPass = await bcrypt.hash("password123", 10);
    await User.create({
      name: "Sanika",
      email: "sanika@test.com",
      password: stuPass,
      role: "student",
      college: "MIT Pune",
    });

    // Events
    await Event.deleteMany({});
    await Event.create([
      {
        title: "React Workshop 2025",
        description: "Learn React.js from scratch with hands-on projects.",
        category: "workshop",
        venue: "CS Dept Lab, MIT Pune",
        date: new Date("2026-03-15"),
        time: "10:00",
        capacity: 50,
        isPaid: false,
        price: 0,
        tags: ["react", "workshop", "javascript"],
        organizer: organizer._id,
        status: "approved",
        isActive: true,
      },
      {
        title: "JavaScript Seminar 2026",
        description: "Advanced JavaScript concepts and modern ES6+ features.",
        category: "seminar",
        venue: "IT Dept, MIT Pune",
        date: new Date("2026-03-20"),
        time: "10:00",
        capacity: 100,
        isPaid: false,
        price: 0,
        tags: ["javascript", "seminar", "es6"],
        organizer: organizer._id,
        status: "approved",
        isActive: true,
      },
      {
        title: "Cultural Fest 2026",
        description: "Annual cultural fest with dance, music and drama.",
        category: "cultural",
        venue: "MIT Pune Auditorium",
        date: new Date("2026-04-15"),
        time: "10:00",
        capacity: 200,
        isPaid: false,
        price: 0,
        tags: ["cultural", "dance", "music"],
        organizer: organizer._id,
        status: "approved",
        isActive: true,
      },
      {
        title: "Hackathon 2026",
        description: "24-hour hackathon for innovative solutions.",
        category: "technical",
        venue: "Innovation Lab, VIT Pune",
        date: new Date("2026-05-15"),
        time: "10:00",
        capacity: 200,
        isPaid: true,
        price: 299,
        tags: ["hackathon", "coding", "tech"],
        organizer: organizer._id,
        status: "approved",
        isActive: true,
      },
      {
        title: "Inter-College Cricket Tournament 2026",
        description: "Annual inter-college cricket tournament open for all departments.",
        category: "sports",
        venue: "MIT Pune Cricket Ground",
        date: new Date("2026-04-25"),
        time: "08:00",
        capacity: 150,
        isPaid: false,
        price: 0,
        tags: ["cricket", "sports", "tournament"],
        organizer: organizer._id,
        status: "approved",
        isActive: true,
      },
    ]);

    res.json({ success: true, message: "Setup complete! Users and Events created in Atlas!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});