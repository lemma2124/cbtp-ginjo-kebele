import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

const RecentActivityCard = ({ activities }) => {
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activityDetails, setActivityDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("summary"); // State for tab control

  const handleViewClick = async (activity) => {
    console.log("View button clicked for activity:", activity);
    setSelectedActivity(activity);
    setLoading(true);
    try {
      if (!activity.log_id) throw new Error("Missing log_id in activity data");
      const res = await fetch(
        `http://localhost/krfs-api/api/admin/auditlog_details.php?log_id=${activity.log_id}`
      );
      if (!res.ok)
        throw new Error(`Failed to fetch audit log details: ${res.statusText}`);
      const data = await res.json();
      setActivityDetails(data);
      console.log("Fetched activity details:", data);
    } catch (error) {
      console.error("Error fetching audit log details:", error.message);
      setActivityDetails({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("activityDetails updated:", activityDetails);
  }, [activityDetails]);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const renderJsonTable = (jsonData) => {
    if (!jsonData) return null;
    return (
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-800">
              <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Field
              </th>
              <th className="p-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(jsonData).map(([key, value], index) => (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              >
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                  {key}
                </td>
                <td className="p-3 text-sm text-gray-600 dark:text-gray-400">
                  {value !== null ? value.toString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  console.log(
    "Rendering Dialog, selectedActivity:",
    selectedActivity,
    "activityDetails:",
    activityDetails
  );

  return (
    <div className="bg-card rounded-lg border p-4">
      <h3 className="font-semibold mb-4 text-lg text-gray-900 dark:text-gray-100">
        Recent Activity
      </h3>
      <ul className="space-y-3">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span
                className={`h-3 w-3 rounded-full ${getStatusColor(
                  activity.status
                )}`}
              ></span>
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
            <button
              onClick={() => handleViewClick(activity)}
              className="text-sm text-blue-500 hover:underline focus:outline-none"
              disabled={loading}
            >
              {loading ? "Loading..." : "View"}
            </button>
          </li>
        ))}
      </ul>

      <Dialog
        open={!!selectedActivity}
        onOpenChange={(open) => {
          if (!open) setSelectedActivity(null);
        }}
      >
        <DialogContent className="sm:max-w-[650px] z-[9999] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 transition-all duration-300 ease-in-out">
          <DialogHeader className="relative mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Activity Details
            </DialogTitle>
            <DialogDescription className="text-gray-500 dark:text-gray-400 mt-1">
              Detailed information about the selected activity.
            </DialogDescription>
            <button
              onClick={() => setSelectedActivity(null)}
              className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </DialogHeader>
          <div className="space-y-6">
            {loading ? (
              <p className="text-center text-gray-500 dark:text-gray-400 animate-pulse">
                Loading...
              </p>
            ) : activityDetails?.error ? (
              <p className="text-center text-red-500 bg-red-50 dark:bg-red-900/30 rounded-lg p-3">
                {activityDetails.error}
              </p>
            ) : activityDetails ? (
              <>
                {/* Tab Navigation */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === "summary"
                        ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    } focus:outline-none transition-colors`}
                    onClick={() => setActiveTab("summary")}
                  >
                    Summary
                  </button>
                  {activityDetails.new_values && (
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "new_values"
                          ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      } focus:outline-none transition-colors`}
                      onClick={() => setActiveTab("new_values")}
                    >
                      New Values
                    </button>
                  )}
                  {activityDetails.old_values && (
                    <button
                      className={`px-4 py-2 text-sm font-medium ${
                        activeTab === "old_values"
                          ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      } focus:outline-none transition-colors`}
                      onClick={() => setActiveTab("old_values")}
                    >
                      Old Values
                    </button>
                  )}
                </div>

                {/* Tab Content */}
                <div className="pt-4">
                  {activeTab === "summary" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { label: "Log ID", value: activityDetails.log_id },
                          {
                            label: "Action Type",
                            value: activityDetails.action_type,
                          },
                          { label: "Table", value: activityDetails.table_name },
                          {
                            label: "Record ID",
                            value: activityDetails.record_id,
                          },
                          { label: "User", value: activityDetails.user_name },
                          {
                            label: "Timestamp",
                            value: activityDetails.timestamp,
                          },
                        ].map((item, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {item.label}
                            </p>
                            <p className="mt-1 text-gray-600 dark:text-gray-400">
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeTab === "new_values" && activityDetails.new_values && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        New Values
                      </h4>
                      {renderJsonTable(activityDetails.new_values)}
                    </div>
                  )}
                  {activeTab === "old_values" && activityDetails.old_values && (
                    <div className="space-y-6">
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Old Values
                      </h4>
                      {renderJsonTable(activityDetails.old_values)}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No details available
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecentActivityCard;
