import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [posterPreview, setPosterPreview] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "workshop",
    venue: "",
    date: "",
    time: "",
    capacity: "",
    isPaid: false,
    price: "",
    tags: "",
    posterImage: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
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
        setFormData((prev) => ({ ...prev, posterImage: data.secure_url }));
        setPosterPreview(data.secure_url);
        toast.success("Image uploaded! ✅");
      } else {
        toast.error("Upload failed!");
      }
    } catch (error) {
      toast.error("Image upload failed!");
    } finally {
      setImageUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const eventData = {
        ...formData,
        capacity: parseInt(formData.capacity),
        price: formData.isPaid ? parseFloat(formData.price) : 0,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const { data } = await API.post("/events", eventData);

      if (data.success) {
        toast.success("Event submitted for admin approval! 🎉");
        navigate("/my-events");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create New Event 🎪</h1>
        <p className="text-gray-500 mb-8">Fill in the details — admin will review and approve!</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Poster Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Poster
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
              {posterPreview ? (
                <div>
                  <img src={posterPreview} alt="Poster" className="w-full h-48 object-cover rounded-lg mb-2" />
                  <button
                    type="button"
                    onClick={() => { setPosterPreview(null); setFormData((p) => ({ ...p, posterImage: "" })); }}
                    className="text-red-500 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-gray-400 mb-2">🖼️ Upload Event Poster</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="poster-upload"
                  />
                  <label
                    htmlFor="poster-upload"
                    className="bg-primary text-white px-4 py-2 rounded-lg cursor-pointer text-sm"
                  >
                    {imageUploading ? "Uploading..." : "Choose Image"}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="React Workshop 2025"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your event..."
              required
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="workshop">Workshop</option>
              <option value="seminar">Seminar</option>
              <option value="technical">Technical</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Venue *</label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="CS Dept Lab, MIT Pune"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="50"
              required
              min="1"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Paid Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPaid"
              id="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
              className="w-5 h-5 accent-primary"
            />
            <label htmlFor="isPaid" className="text-sm font-medium text-gray-700">
              This is a paid event
            </label>
          </div>

          {formData.isPaid && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="499"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="react, javascript, frontend"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || imageUploading}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit for Approval 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;