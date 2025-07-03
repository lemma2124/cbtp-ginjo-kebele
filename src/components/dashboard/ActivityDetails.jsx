import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ActivityDetails = () => {
  const { logId } = useParams();
  const [activityDetails, setActivityDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(
          `http://localhost/krfs-api/api/admin/auditlog_details.php?log_id=${logId}`
        );
        if (!res.ok) throw new Error("Failed to fetch audit log details");
        const data = await res.json();
        setActivityDetails(data);
      } catch (error) {
        console.error("Error fetching audit log details:", error);
        setActivityDetails({ error: "Failed to load details" });
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [logId]);

  if (loading) return <div>Loading...</div>;
  if (activityDetails?.error)
    return <div className="text-red-500">{activityDetails.error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Details</h2>
      <div className="space-y-2">
        <p>
          <strong>Log ID:</strong> {activityDetails.log_id}
        </p>
        <p>
          <strong>Action Type:</strong> {activityDetails.action_type}
        </p>
        <p>
          <strong>Table:</strong> {activityDetails.table_name}
        </p>
        <p>
          <strong>Record ID:</strong> {activityDetails.record_id}
        </p>
        <p>
          <strong>User:</strong> {activityDetails.user_name}
        </p>
        <p>
          <strong>Timestamp:</strong> {activityDetails.timestamp}
        </p>
        {activityDetails.old_values && (
          <div>
            <strong>Old Values:</strong>
            <pre className="text-sm text-muted-foreground">
              {JSON.stringify(activityDetails.old_values, null, 2)}
            </pre>
          </div>
        )}
        {activityDetails.new_values && (
          <div>
            <strong>New Values:</strong>
            <pre className="text-sm text-muted-foreground">
              {JSON.stringify(activityDetails.new_values, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityDetails;
