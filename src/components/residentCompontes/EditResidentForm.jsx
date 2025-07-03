// components/auth/EditResidentForm.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const EditResidentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    kebele_code: "",
    house_number: "",
    phone_number: "",
    email: "",
  });

  useEffect(() => {
    fetch(
      `http://localhost/krfs-api/api/residents/get_one.php?resident_id=${id}`
    )
      .then((res) => res.json())
      .then((data) => setFormData(data.resident));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/residents/update.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Updated",
          description: "Resident info has been updated",
        });
        navigate(`/residents/${id}`);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update resident",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label>First Name</label>
          <input
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label>Date of Birth</label>
          <input
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Kebele Code</label>
          <input
            name="kebele_code"
            value={formData.kebele_code}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>House Number</label>
          <input
            name="house_number"
            value={formData.house_number}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditResidentForm;
