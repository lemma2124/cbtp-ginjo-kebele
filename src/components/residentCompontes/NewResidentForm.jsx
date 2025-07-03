// components/auth/NewResidentForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NewResidentForm = () => {
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
    is_minor: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/residents/create.php",
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
          title: "Success",
          description: "Resident created successfully",
        });
        navigate("/residents");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to register resident",
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
            <option value="">Select Gender</option>
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
            placeholder="KEB-001"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>House Number</label>
          <input
            name="house_number"
            value={formData.house_number}
            onChange={handleChange}
            placeholder="HNo. 123"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+251911223344"
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label>Email (Optional)</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
            className="w-full border rounded p-2"
          />
        </div>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
      >
        Submit
      </button>
    </form>
  );
};

export default NewResidentForm;
