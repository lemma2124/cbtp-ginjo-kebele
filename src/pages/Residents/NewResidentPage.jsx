import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateResidentForm = () => {
  const navigate = useNavigate();

  const [resident, setResident] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    national_id: "",
    house_number: "",
    street_name: "",
    kebele_id: "1",
    region_id: "1",
    zone_id: "1",
    woreda_id: "1",
    is_active: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResident({ ...resident, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/residents/create.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 1",
          },
          body: JSON.stringify(resident),
        }
      );

      const result = await response.json();

      if (result.success) {
        alert("Resident created successfully!");
        navigate(`/residents/${result.resident_id}`);
      } else {
        alert(`Failed to create resident: ${result.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">Register New Resident</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label>First Name</label>
          <input
            type="text"
            name="first_name"
            value={resident.first_name}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label>Last Name</label>
          <input
            type="text"
            name="last_name"
            value={resident.last_name}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label>Gender</label>
          <select
            name="gender"
            value={resident.gender}
            onChange={handleChange}
            className="w-full border p-2"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label>National ID</label>
          <input
            type="text"
            name="national_id"
            value={resident.national_id}
            onChange={handleChange}
            className="w-full border p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label>House Number</label>
          <input
            type="text"
            name="house_number"
            value={resident.house_number}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        <div className="mb-4">
          <label>Street Name</label>
          <input
            type="text"
            name="street_name"
            value={resident.street_name}
            onChange={handleChange}
            className="w-full border p-2"
          />
        </div>

        {/* Hidden Fields */}
        <input type="hidden" name="kebele_id" value={resident.kebele_id} />
        <input type="hidden" name="region_id" value={resident.region_id} />
        <input type="hidden" name="zone_id" value={resident.zone_id} />
        <input type="hidden" name="woreda_id" value={resident.woreda_id} />
        <input type="hidden" name="is_active" value={resident.is_active} />

        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Register Resident
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateResidentForm;
