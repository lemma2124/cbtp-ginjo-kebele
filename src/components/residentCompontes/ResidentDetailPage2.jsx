// pages/ResidentDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import DeleteResidentButton from "@/components/residents/DeleteResidentButton";

const ResidentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [resident, setResident] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetch(
      `http://localhost/krfs-api/api/residents/get_one.php?resident_id=${id}`
    )
      .then((res) => res.json())
      .then((data) => setResident(data.resident));
  }, [id, isAuthenticated]);

  if (!isAuthenticated) return null;
  if (!resident) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        {resident.first_name} {resident.last_name}
      </h2>
      <div className="mb-4">
        <p>
          <strong>Gender:</strong> {resident.gender}
        </p>
        <p>
          <strong>Date of Birth:</strong> {resident.date_of_birth}
        </p>
        <p>
          <strong>Kebele:</strong> {resident.kebele_code}
        </p>
        <p>
          <strong>Phone:</strong> {resident.phone_number}
        </p>
        <p>
          <strong>Email:</strong> {resident.email || "N/A"}
        </p>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => navigate(`/residents/edit/${resident.resident_id}`)}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <DeleteResidentButton residentId={resident.resident_id} />
      </div>
    </div>
  );
};

export default ResidentDetailPage;
