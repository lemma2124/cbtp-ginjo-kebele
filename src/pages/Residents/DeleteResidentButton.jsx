// src/components/DeleteResidentButton.jsx
import React from "react";
import { toast } from "@/hooks/use-toast";

const DeleteResidentButton = ({ residentId }) => {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resident?"))
      return;

    try {
      const response = await fetch(`/api/residents/delete.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resident_id: residentId }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Deleted",
          description: "Resident removed successfully",
        });
        window.location.href = "/residents";
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
        title: "Network Error",
        description: err.message,
      });
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      {t("delete")}
    </button>
  );
};

export default DeleteResidentButton;
