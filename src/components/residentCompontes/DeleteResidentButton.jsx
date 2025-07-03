// components/residents/DeleteResidentButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const DeleteResidentButton = ({ residentId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this resident?"))
      return;

    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/residents/delete.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ resident_id: residentId }),
          credentials: "include",
        }
      );

      const result = await response.json();
      if (result.success) {
        toast({
          title: "Deleted",
          description: "Resident removed successfully",
        });
        navigate("/residents");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete resident",
      });
    }
  };

  return (
    <Button variant="destructive" onClick={handleDelete}>
      Delete Resident
    </Button>
  );
};

export default DeleteResidentButton;
