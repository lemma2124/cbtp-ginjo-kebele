import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, ArrowRight, User, Upload } from "lucide-react";

const NewResidentPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    idNumber: "",
    phone: "",
    email: "",
    maritalStatus: "",
    occupation: "",
    education: "",
    street: "",
    kebele: "",
    zone: "",
    houseNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNextStep = (step) => {
    setCurrentStep(step);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // In a real app, you would submit the data to your backend
    console.log("Resident data submitted:", formData);

    toast({
      title: "Registration Successful",
      description: "The resident has been successfully registered",
    });

    // Navigate to the residents page
    navigate("/residents");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/residents")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">
          New Resident Registration
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Please fill the resident information</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} className="w-full">
            <TabsList className="mb-4 grid grid-cols-3">
              <TabsTrigger
                value="personal"
                onClick={() => handleNextStep("personal")}
              >
                Personal Information
              </TabsTrigger>
              <TabsTrigger
                value="address"
                onClick={() => handleNextStep("address")}
              >
                Address & Contact
              </TabsTrigger>
              <TabsTrigger
                value="documents"
                onClick={() => handleNextStep("documents")}
              >
                Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Gender</Label>
                  <RadioGroup
                    value={formData.gender}
                    onValueChange={(value) =>
                      handleSelectChange("gender", value)
                    }
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">Female</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="ETH-000000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status</Label>
                  <Select
                    value={formData.maritalStatus}
                    onValueChange={(value) =>
                      handleSelectChange("maritalStatus", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="married">Married</SelectItem>
                      <SelectItem value="divorced">Divorced</SelectItem>
                      <SelectItem value="widowed">Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="occupation">Occupation</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Enter occupation"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education">Education Level</Label>
                  <Select
                    value={formData.education}
                    onValueChange={(value) =>
                      handleSelectChange("education", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary School</SelectItem>
                      <SelectItem value="secondary">
                        Secondary School
                      </SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelors">
                        Bachelor's Degree
                      </SelectItem>
                      <SelectItem value="masters">Master's Degree</SelectItem>
                      <SelectItem value="phd">PhD or Higher</SelectItem>
                      <SelectItem value="none">No Formal Education</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => handleNextStep("address")}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="address" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="street">Street</Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Enter street name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kebele">Kebele</Label>
                  <Input
                    id="kebele"
                    name="kebele"
                    value={formData.kebele}
                    onChange={handleChange}
                    placeholder="Enter kebele number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    name="zone"
                    value={formData.zone}
                    onChange={handleChange}
                    placeholder="Enter zone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="houseNumber">House Number</Label>
                  <Input
                    id="houseNumber"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    placeholder="Enter house number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+251 900 000 000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Optional)</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleNextStep("personal")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={() => handleNextStep("documents")}>
                  Next Step <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label>Photo ID</Label>
                  <div className="border-dashed border-2 border-input rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="mb-4 rounded-full bg-muted h-24 w-24 flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2 text-center">
                      <div>Drag and drop a photo, or</div>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" /> Browse Files
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        JPEG, PNG or GIF, max 5MB
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>ID Card (Front & Back)</Label>
                  <div className="border-dashed border-2 border-input rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="space-y-2 text-center">
                      <div>Drag and drop ID scan, or</div>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" /> Browse Files
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        PDF, JPEG or PNG, max 10MB
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Birth Certificate (Optional)</Label>
                  <div className="border-dashed border-2 border-input rounded-md p-6 flex flex-col items-center justify-center">
                    <div className="space-y-2 text-center">
                      <div>Drag and drop certificate, or</div>
                      <Button size="sm">
                        <Upload className="h-4 w-4 mr-2" /> Browse Files
                      </Button>
                      <div className="text-xs text-muted-foreground">
                        PDF, JPEG or PNG, max 10MB
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => handleNextStep("address")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="bg-ethiopia-green hover:bg-ethiopia-green/90"
                >
                  Complete Registration
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewResidentPage;
