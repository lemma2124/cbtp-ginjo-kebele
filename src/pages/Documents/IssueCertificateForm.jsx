import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

const IssueCertificateForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    resident_id: "",
    certificate_type: "",
    issue_date: new Date().toISOString().split("T")[0],
    expiry_date: "",
    certificate_number: "",
    file_path: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Send data to backend API
    const response = await fetch(
      "http://localhost/krfs-api/api/certificates/create.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_JWT_TOKEN",
        },
        body: JSON.stringify(form),
      }
    );

    const result = await response.json();

    if (result.success) {
      alert("Certificate issued successfully!");
      navigate("/certificates");
    } else {
      alert("Error issuing certificate: " + result.error);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Issue Certificate</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="resident_id">Resident ID *</Label>
            <Input
              id="resident_id"
              name="resident_id"
              value={form.resident_id}
              onChange={handleChange}
              placeholder="Enter Resident ID"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate_type">Certificate Type *</Label>
            <Select
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, certificate_type: value }))
              }
              value={form.certificate_type}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Certificate Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Birth Certificate">
                  Birth Certificate
                </SelectItem>
                <SelectItem value="Death Certificate">
                  Death Certificate
                </SelectItem>
                <SelectItem value="Marriage Certificate">
                  Marriage Certificate
                </SelectItem>
                <SelectItem value="Family Certificate">
                  Family Certificate
                </SelectItem>
                <SelectItem value="ID Card">ID Card</SelectItem>
                <SelectItem value="Residency Certificate">
                  Residency Certificate
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">Issue Date</Label>
              <Input
                id="issue_date"
                name="issue_date"
                type="date"
                value={form.issue_date}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date (if applicable)</Label>
              <Input
                id="expiry_date"
                name="expiry_date"
                type="date"
                value={form.expiry_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="certificate_number">Certificate Number</Label>
            <Input
              id="certificate_number"
              name="certificate_number"
              value={form.certificate_number}
              onChange={handleChange}
              placeholder="CERT-XXXX-XXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file_path">File Path (optional)</Label>
            <Input
              id="file_path"
              name="file_path"
              value={form.file_path}
              onChange={handleChange}
              placeholder="/certificates/resident_123.pdf"
            />
          </div>

          <Button type="submit" className="w-full mt-4">
            Issue Certificate
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default IssueCertificateForm;
