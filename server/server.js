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

app.get("/api/check-admin", async (req, res) => {
  try {
    const User = require("./models/User");
    const user = await User.findOne({ email: "admin@eventsphere.com" }).select("+password");
    res.json({
      found: !!user,
      role: user?.role,
      name: user?.name,
      hasPassword: !!user?.password,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

app.get("/api/setup", async (req, res) => {
  try {
    const User = require("./models/User");
    const Event = require("./models/Event");

    await User.deleteOne({ email: "admin@eventsphere.com" });
    await User.create({
      name: "Admin",
      email: "admin@eventsphere.com",
      password: "Admin@123",
      role: "admin",
      college: "EventSphere",
    });

    await User.deleteOne({ email: "organizer@test.com" });
    const organizer = await User.create({
      name: "Test Organizer",
      email: "organizer@test.com",
      password: "password123",
      role: "organizer",
      college: "MIT Pune",
    });

    await User.deleteOne({ email: "sanika@test.com" });
    await User.create({
      name: "Sanika",
      email: "sanika@test.com",
      password: "password123",
      role: "student",
      college: "MIT Pune",
    });

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
        description: "Annual inter-college cricket tournament.",
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

    res.json({ success: true, message: "Setup complete!" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});