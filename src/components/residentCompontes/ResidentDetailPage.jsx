// pages/ResidentDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";

const ResidentDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    fetch(
      `http://localhost/krfs-api/api/residents/get_one.php?resident_id=${id}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResident(data.resident);
        }
      })
      .catch((err) => {
        console.error("Error fetching resident data:", err);
      })
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  if (!isAuthenticated) return null;
  if (loading) return <div>Loading...</div>;
  if (!resident) return <div>Resident not found</div>;

  return (
    <div className="container mx-auto p-4">
      <Card className="p-6 shadow">
        <h2 className="text-2xl font-bold">{resident.full_name}</h2>
        <p>
          <strong>Gender:</strong> {resident.gender}
        </p>
        <p>
          <strong>Date of Birth:</strong> {resident.date_of_birth}
        </p>
        <p>
          <strong>Occupation:</strong> {resident.occupation}
        </p>
        <p>
          <strong>Phone:</strong> {resident.phone_number}
        </p>
        <p>
          <strong>Email:</strong> {resident.email}
        </p>
      </Card>
    </div>
  );
};

export default ResidentDetailPage;
