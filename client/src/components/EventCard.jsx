import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const categoryColors = {
    workshop: "bg-blue-100 text-blue-700",
    seminar: "bg-green-100 text-green-700",
    technical: "bg-purple-100 text-purple-700",
    cultural: "bg-pink-100 text-pink-700",
    sports: "bg-orange-100 text-orange-700",
    other: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden border border-gray-100">
      {/* Poster Image */}
      <div className="h-48 bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
        {event.posterImage ? (
          <img
            src={event.posterImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-6xl">🎪</span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category Badge */}
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[event.category] || categoryColors.other}`}>
          {event.category}
        </span>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-800 mt-3 mb-1 line-clamp-2">
          {event.title}
        </h3>

        {/* Organizer */}
        <p className="text-sm text-gray-500 mb-3">
          by {event.organizer?.name || "Unknown"}
        </p>

        {/* Details */}
        <div className="space-y-1 text-sm text-gray-600 mb-4">
          <p>📅 {formatDate(event.date)} • {event.time}</p>
          <p>📍 {event.venue}</p>
          <p>👥 {event.registeredCount}/{event.capacity} registered</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <span className={`font-bold ${event.isPaid ? "text-green-600" : "text-blue-600"}`}>
            {event.isPaid ? `₹${event.price}` : "FREE"}
          </span>
          <Link
            to={`/events/${event._id}`}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;