import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ResidentProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [residentData, setResidentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user.role !== "resident") {
      return;
    }

    // Fetch resident data from PHP API
    fetch("/api/residents/get_one.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setResidentData(data.resident);
        } else {
          alert(data.error || "Failed to load profile");
        }
      })
      .catch((err) => {
        console.error("Error fetching resident data:", err.message);
        alert("Connection error");
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (isLoading || loading) return <div>Loading...</div>;
  if (!isAuthenticated || !residentData) return <div>Unauthorized</div>;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <strong>Name:</strong> {residentData.first_name}{" "}
            {residentData.last_name}
          </div>
          <div>
            <strong>Gender:</strong> {residentData.gender}
          </div>
          <div>
            <strong>Date of Birth:</strong> {residentData.date_of_birth}
          </div>
          <div>
            <strong>Occupation:</strong>{" "}
            {residentData.occupation || "Not specified"}
          </div>
          <div>
            <strong>Education:</strong>{" "}
            {residentData.education_level || "Not specified"}
          </div>
          <div>
            <strong>Kebele Code:</strong> {residentData.kebele_code}
          </div>
          <div>
            <strong>House Number:</strong> {residentData.house_number}
          </div>
          <div>
            <strong>Phone:</strong> {residentData.phone_number}
          </div>
          <div>
            <strong>Email:</strong> {residentData.email || "N/A"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResidentProfilePage;
