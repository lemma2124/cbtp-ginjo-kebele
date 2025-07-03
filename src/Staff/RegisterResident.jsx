import React, { useState } from "react";
import axios from "axios";

const RegisterResident = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    place_of_birth: "",
    nationality: "Ethiopian",
    marital_status: "",
    occupation: "",
    education_level: "",
    phone_number: "",
    email_address: "",
    national_id: "",
    house_number: "",
    street_name: "",
    subcity: "",
    city: "",
    postal_code: "",
    kebele_id: "1",
    region_id: "1",
    zone_id: "1",
    woreda_id: "1",
  });

  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const data = new FormData();

    // Add resident + address fields
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value || "");
    });

    if (photo) {
      data.append("photo", photo);
    }

    try {
      const response = await axios.post(
        "http://localhost/krfs-api/api/residents/staffCreate.php",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setMessage("✅ Resident registered successfully!");
        setTimeout(() => {
          window.location.href = `/residents/${response.data.resident_id}`;
        }, 2000);
      } else {
        setMessage(
          "❌ Registration failed: " + (response.data.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "🚨 Error submitting form: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-4">Register New Resident</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name *
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Middle Name
            </label>
            <input
              type="text"
              name="middle_name"
              value={formData.middle_name}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name *
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Gender *</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full border p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              National ID *
            </label>
            <input
              type="text"
              name="national_id"
              value={formData.national_id}
              onChange={handleChange}
              required
              className="w-full border p-2"
            />
          </div>
        </div>

        {/* Birth Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Place of Birth
            </label>
            <input
              type="text"
              name="place_of_birth"
              value={formData.place_of_birth}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Marital Status
            </label>
            <select
              name="marital_status"
              value={formData.marital_status}
              onChange={handleChange}
              className="w-full border p-2"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>
        </div>

        {/* Address Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              House Number
            </label>
            <input
              type="text"
              name="house_number"
              value={formData.house_number}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Street Name
            </label>
            <input
              type="text"
              name="street_name"
              value={formData.street_name}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Subcity</label>
            <input
              type="text"
              name="subcity"
              value={formData.subcity}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Postal Code
            </label>
            <input
              type="text"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Education Level
            </label>
            <input
              type="text"
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
              className="w-full border p-2"
            />
          </div>
        </div>

        {/* Hidden Kebele Info */}
        <input type="hidden" name="kebele_id" value={formData.kebele_id} />
        <input type="hidden" name="region_id" value={formData.region_id} />
        <input type="hidden" name="zone_id" value={formData.zone_id} />
        <input type="hidden" name="woreda_id" value={formData.woreda_id} />

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Upload Photo (Optional)
          </label>
          <input
            type="file"
            name="photo"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full border p-2"
          />
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register Resident"}
          </button>
        </div>

        {/* Status Message */}
        {message && <p className="mt-4 text-lg">{message}</p>}
      </form>
    </div>
  );
};

export default RegisterResident;
