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

// Assume you get the admin user_id from context or props
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
    <div className="container mx-auto max-w-xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Notification to Resident</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <Label>Resident</Label>
              <Select
                onValueChange={(v) => handleSelect("resident_id", v)}
                value={form.resident_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Resident" />
                </SelectTrigger>
                <SelectContent>
                  {residents.map((r) => (
                    <SelectItem
                      key={r.resident_id}
                      value={String(r.resident_id)}
                    >
                      {r.first_name} {r.last_name} ({r.national_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Event Type</Label>
              <Select
                onValueChange={(v) => handleSelect("event_type", v)}
                value={form.event_type}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  {eventTypes.map((et) => (
                    <SelectItem key={et.value} value={et.value}>
                      {et.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SendNotification;
