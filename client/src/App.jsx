import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import AdminPanel from "./pages/AdminPanel";
import EventDetail from "./pages/EventDetail";
import MyRegistrations from "./pages/MyRegistrations";
import EditEvent from "./pages/EditEvent";
import Profile from "./pages/Profile";
import EventRegistrations from "./pages/EventRegistrations";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/create-event" element={<ProtectedRoute roles={["organizer","admin"]}><CreateEvent /></ProtectedRoute>} />
          <Route path="/my-events" element={<ProtectedRoute roles={["organizer","admin"]}><MyEvents /></ProtectedRoute>} />
          <Route path="/edit-event/:id" element={<ProtectedRoute roles={["organizer","admin"]}><EditEvent /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPanel /></ProtectedRoute>} />
          <Route path="/my-registrations" element={<ProtectedRoute roles={["student"]}><MyRegistrations /></ProtectedRoute>} />
          <Route path="/event-registrations/:eventId" element={<ProtectedRoute roles={["organizer","admin"]}><EventRegistrations /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;