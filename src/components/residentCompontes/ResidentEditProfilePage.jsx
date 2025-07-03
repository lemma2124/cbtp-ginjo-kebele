import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const ResidentEditProfilePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone_number: "",
    email: "",
  });

  useEffect(() => {
    // Pre-fill existing data
    fetch("/api/residents/get_one.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFormData({
            phone_number: data.resident.phone_number,
            email: data.resident.email,
          });
        }
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/residents/update_profile.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
      credentials: "include",
    });

    const result = await response.json();

    if (result.success) {
      alert("Profile updated successfully");
    } else {
      alert("Update failed");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <Label htmlFor="phone_number">Phone Number</Label>
          <Input
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+251911223344"
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@example.com"
          />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
};

export default ResidentEditProfilePage;
