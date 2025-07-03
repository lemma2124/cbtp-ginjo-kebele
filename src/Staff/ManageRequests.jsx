import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Load documents from backend
  useEffect(() => {
    const loadRequests = async () => {
      try {
        const response = await fetch(
          "http://localhost/krfs-api/api/documents/get-documents.php",
          {
            headers: {
              Authorization: "Bearer 1",
            },
          }
        );

        const data = await response.json();

        if (data.success) {

            console.log(" data of documets ", data);
            console.log(" data of documets ", data.documents);

          setRequests(data.documents); // Make sure your PHP returns { success, documents }
        } else {
          throw new Error(data.error || "Failed to load requests");
        }
      } catch (err) {
        setError(err.message);
        toast.error(`Error loading requests: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    console.log( "request",requests);
    loadRequests();
  }, []);

  // Handle status change
  const handleStatusChange = async (documentId, newStatus) => {
    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/documents/update-status.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 1",
          },
          body: JSON.stringify({
            document_id: documentId,
            status: newStatus,
            processed_by: user.user_id,
          }),
        }
      );

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Status update failed");
      }

      // Update local state
      setRequests((prev) =>
        prev.map((doc) =>
          doc.document_id === documentId ? { ...doc, status: newStatus } : doc
        )
      );

      toast.success(`Document #${documentId} updated to "${newStatus}"`);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to update document #${documentId}: ${err.message}`);
    }
  };

  // Filter by search query
  const filteredRequests = requests.filter((req) => {
    const query = searchQuery.toLowerCase();
    return (
      req.resident_name?.toLowerCase().includes(query) ||
      req.service_type?.toLowerCase().includes(query) ||
      req.details?.toLowerCase().includes(query) ||
      req.status?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <span className="text-gray-500">Loading requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Documents</h2>

      {/* Search Input */}
      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 p-2 border rounded"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Table of Requests */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-md rounded-lg">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                 document number
              </th>
             
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Date
              </th>
             
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request, index) => (
                <tr
                  key={request.document_id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    {requests[index].document_number}
                  </td>
                  {console.log("request body ", requests[0].document_type)}
                  <td className="px-6 py-4">{request.service_type}</td>
                  <td className="px-6 py-4">{request.issue_date}</td>
                  <td className="px-6 py-4 max-w-xs truncate">
                    {request.details}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={request.status}
                      onChange={(e) =>
                        handleStatusChange(request.document_id, e.target.value)
                      }
                      disabled={!["admin", "staff"].includes(user?.role)}
                      className={`w-full p-2 rounded border ${
                        ["admin", "staff"].includes(user?.role)
                          ? "border-gray-300 hover:border-blue-400"
                          : "border-gray-200 bg-gray-100 cursor-not-allowed"
                      }`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="approved">✅ Approved</option>
                      <option value="rejected">❌ Rejected</option>
                      <option value="processing">🔄 Processing</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No matching documents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManageRequests;
