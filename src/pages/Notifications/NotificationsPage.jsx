import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

const ADMIN_USER_ID = 1;

const eventTypes = [
  { value: "info", label: "Info" },
  { value: "alert", label: "Alert" },
  { value: "reminder", label: "Reminder" },
];

const SendNotification = () => {
  const [residents, setResidents] = useState([]);
  const [form, setForm] = useState({
    resident_id: "",
    title: "",
    message: "",
    event_type: "info",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://localhost/krfs-api/api/residents/read.php")
      .then((res) => res.json())
      .then((data) => setResidents(data))
      .catch(() => setResidents([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelect = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        user_id: ADMIN_USER_ID,
      };
      const res = await fetch(
        "http://localhost/krfs-api/api/notifications/send.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const result = await res.json();
      if (result.success) {
        toast.success("Notification sent!");
        setForm({
          resident_id: "",
          title: "",
          message: "",
          event_type: "info",
        });
      } else {
        toast.error(result.error || "Failed to send notification");
      }
    } catch {
      toast.error("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-10">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardHeader className="bg-blue-600 rounded-t-lg px-8 py-6">
          <CardTitle className="text-white text-2xl font-bold flex items-center gap-2">
            <span role="img" aria-label="notification">
              📢
            </span>
            Send Notification to Resident
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <form className="space-y-7" onSubmit={handleSubmit}>
            <div>
              <Label className="font-semibold text-base mb-1 block">
                Resident
              </Label>
              <Select
                onValueChange={(v) => handleSelect("resident_id", v)}
                value={form.resident_id}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Resident" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white shadow-lg rounded-lg border mt-1 max-h-64 overflow-y-auto">
                  {residents.length === 0 && (
                    <div className="px-4 py-2 text-gray-400">
                      No residents found
                    </div>
                  )}
                  {residents.map((r) => (
                    <SelectItem
                      key={r.resident_id}
                      value={String(r.resident_id)}
                      className="hover:bg-blue-50 cursor-pointer"
                    >
                      {r.first_name} {r.last_name} ({r.national_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold text-base mb-1 block">
                Event Type
              </Label>
              <Select
                onValueChange={(v) => handleSelect("event_type", v)}
                value={form.event_type}
              >
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white shadow-lg rounded-lg border mt-1 max-h-64 overflow-y-auto">
                  {eventTypes.map((et) => (
                    <SelectItem
                      key={et.value}
                      value={et.value}
                      className="hover:bg-blue-50 cursor-pointer"
                    >
                      {et.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold text-base mb-1 block">
                Title
              </Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter notification title"
                className="w-full"
              />
            </div>
            <div>
              <Label className="font-semibold text-base mb-1 block">
                Message
              </Label>
              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Type your message here..."
                className="w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendNotification;
