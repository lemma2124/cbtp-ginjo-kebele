// components/auth/NewResidentForm.jsx

// src/NewResidentForm.jsx

// Local UI components (relative paths)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

import {useLanguage} from './context/LanguageContext'

import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

import { Tabs, TabsList, TabsTrigger, TabsContent } from './components/ui/tabs';
import { Input } from './components/ui/Input';
import { Label } from './components/ui/Label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './components/ui/Select';
import { Button } from './components/ui/Button';

const NewResidentForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("personal");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    maritalStatus: "",
    occupation: "",
    educationLevel: "",
    kebele: "",
    zone: "",
    woreda: "",
    houseNumber: "",
    phoneNumber: "",
    email: "",
    photoPath: null,
    idCardFront: null,
    idCardBack: null,
    birthCertificate: null,
  });

  const [errors, setErrors] = useState({});

  const { t } = useLanguage();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const validatePersonalStep = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = t("first_name_required");
    if (!formData.lastName.trim()) newErrors.lastName = t("last_name_required");
    if (!formData.gender) newErrors.gender = t("gender_required");
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = t("date_of_birth_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressStep = () => {
    const newErrors = {};
    if (!formData.kebele.trim()) newErrors.kebele = t("kebele_required");
    if (!formData.zone.trim()) newErrors.zone = t("zone_required");
    if (!formData.woreda.trim()) newErrors.woreda = t("woreda_required");
    if (!formData.houseNumber.trim())
      newErrors.houseNumber = t("house_number_required");
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = t("phone_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === "personal" && !validatePersonalStep()) return;
    if (step === "address" && !validateAddressStep()) return;

    if (step === "documents") {
      // Final step - send to backend
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) data.append(key, value);
      });

      try {
        const response = await fetch("/api/residents/create.php", {
          method: "POST",
          body: data,
          credentials: "include",
        });

        const result = await response.json();

        if (result.success) {
          toast({
            title: t("success"),
            description: t("resident_registered_successfully"),
          });
          navigate("/residents");
        } else {
          throw new Error(result.error || "Registration failed");
        }
      } catch (err) {
        toast({
          variant: "destructive",
          title: t("error"),
          description: err.message,
        });
      }
    }

    // Move to next step
    switch (step) {
      case "personal":
        if (validatePersonalStep()) setStep("address");
        break;
      case "address":
        if (validateAddressStep()) setStep("documents");
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => navigate("/residents")}
          className="text-green-600 hover:text-green-800 text-sm font-medium"
        >
          ← {t("back")}
        </button>
        <h1 className="text-3xl font-bold">{t("new_resident_registration")}</h1>
      </div>

      {/* Step Tabs */}
      <Tabs value={step} onValueChange={setStep} className="w-full">
        <TabsList className="mb-6 flex space-x-8 border-b border-gray-200 pb-2">
          <TabsTrigger
            value="personal"
            onClick={() => setStep("personal")}
            className={`py-3 cursor-pointer ${
              step === "personal"
                ? "border-green-500 text-green-600 border-b-2 font-semibold"
                : "text-gray-600"
            }`}
          >
            {t("personal_information")}
          </TabsTrigger>
          <TabsTrigger
            value="address"
            onClick={() => setStep("address")}
            className={`py-3 cursor-pointer ${
              step === "address"
                ? "border-green-500 text-green-600 border-b-2 font-semibold"
                : "text-gray-600"
            }`}
          >
            {t("address_and_contact")}
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            onClick={() => setStep("documents")}
            className={`py-3 cursor-pointer ${
              step === "documents"
                ? "border-green-500 text-green-600 border-b-2 font-semibold"
                : "text-gray-600"
            }`}
          >
            {t("documents")}
          </TabsTrigger>
        </TabsList>

        {/* STEP 1: Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("personal_information")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">{t("first_name")}</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder={t("john")}
                  className={`w-full ${
                    errors.firstName ? "border-red-500" : ""
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">{t("last_name")}</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder={t("doe")}
                  className={`w-full ${
                    errors.lastName ? "border-red-500" : ""
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-2">
                <Label>{t("gender")}</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(val) => handleSelectChange("gender", val)}
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.gender ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder={t("select_gender")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t("male")}</SelectItem>
                    <SelectItem value="female">{t("female")}</SelectItem>
                    <SelectItem value="other">{t("other")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">{t("date_of_birth")}</Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`w-full ${
                    errors.dateOfBirth ? "border-red-500" : ""
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>
                )}
              </div>

              {/* Marital Status */}
              <div className="space-y-2">
                <Label>{t("marital_status")}</Label>
                <Select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onValueChange={(val) =>
                    handleSelectChange("maritalStatus", val)
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.maritalStatus ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder={t("select_marital_status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">{t("single")}</SelectItem>
                    <SelectItem value="married">{t("married")}</SelectItem>
                    <SelectItem value="divorced">{t("divorced")}</SelectItem>
                    <SelectItem value="widowed">{t("widowed")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.maritalStatus && (
                  <p className="text-red-500 text-sm">{errors.maritalStatus}</p>
                )}
              </div>

              {/* Occupation */}
              <div className="space-y-2">
                <Label htmlFor="occupation">{t("occupation")}</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder={t("teacher")}
                  className={`w-full ${
                    errors.occupation ? "border-red-500" : ""
                  }`}
                />
                {errors.occupation && (
                  <p className="text-red-500 text-sm">{errors.occupation}</p>
                )}
              </div>

              {/* Education Level */}
              <div className="space-y-2">
                <Label>{t("education_level")}</Label>
                <Select
                  name="educationLevel"
                  value={formData.educationLevel}
                  onValueChange={(val) =>
                    handleSelectChange("educationLevel", val)
                  }
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.educationLevel ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder={t("select_education_level")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="primary">
                      {t("primary_school")}
                    </SelectItem>
                    <SelectItem value="secondary">
                      {t("secondary_school")}
                    </SelectItem>
                    <SelectItem value="diploma">{t("diploma")}</SelectItem>
                    <SelectItem value="bachelors">
                      {t("bachelors_degree")}
                    </SelectItem>
                    <SelectItem value="masters">
                      {t("masters_degree")}
                    </SelectItem>
                    <SelectItem value="phd">{t("phd_or_higher")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.educationLevel && (
                  <p className="text-red-500 text-sm">
                    {errors.educationLevel}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STEP 2: Address & Contact */}
        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("address_and_contact")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Kebele */}
              <div className="space-y-2">
                <Label htmlFor="kebele">{t("kebele")}</Label>
                <Input
                  id="kebele"
                  name="kebele"
                  value={formData.kebele}
                  onChange={handleChange}
                  placeholder={t("bole")}
                  className={`w-full ${errors.kebele ? "border-red-500" : ""}`}
                />
                {errors.kebele && (
                  <p className="text-red-500 text-sm">{errors.kebele}</p>
                )}
              </div>

              {/* Zone */}
              <div className="space-y-2">
                <Label htmlFor="zone">{t("zone")}</Label>
                <Input
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  placeholder={t("addis_ababa")}
                  className={`w-full ${errors.zone ? "border-red-500" : ""}`}
                />
                {errors.zone && (
                  <p className="text-red-500 text-sm">{errors.zone}</p>
                )}
              </div>

              {/* Woreda */}
              <div className="space-y-2">
                <Label htmlFor="woreda">{t("woreda")}</Label>
                <Input
                  id="woreda"
                  name="woreda"
                  value={formData.woreda}
                  onChange={handleChange}
                  placeholder={t("woreda_06")}
                  className={`w-full ${errors.woreda ? "border-red-500" : ""}`}
                />
                {errors.woreda && (
                  <p className="text-red-500 text-sm">{errors.woreda}</p>
                )}
              </div>

              {/* House Number */}
              <div className="space-y-2">
                <Label htmlFor="houseNumber">{t("house_number")}</Label>
                <Input
                  id="houseNumber"
                  name="houseNumber"
                  value={formData.houseNumber}
                  onChange={handleChange}
                  placeholder="HNo. 123"
                  className={`w-full ${
                    errors.houseNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.houseNumber && (
                  <p className="text-red-500 text-sm">{errors.houseNumber}</p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t("phone_number")}</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+251911223344"
                  className={`w-full ${
                    errors.phoneNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-sm">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("email_optional")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@example.com"
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* STEP 3: Documents */}
        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("upload_documents")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Photo ID */}
              <div className="space-y-2">
                <Label>{t("photo_id")}</Label>
                <Input
                  type="file"
                  name="photoPath"
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`w-full ${
                    errors.photoPath ? "border-red-500" : ""
                  }`}
                />
                {errors.photoPath && (
                  <p className="text-red-500 text-sm">{errors.photoPath}</p>
                )}
              </div>

              {/* ID Card Front */}
              <div className="space-y-2">
                <Label>{t("id_card_front")}</Label>
                <Input
                  type="file"
                  name="idCardFront"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className={`w-full ${
                    errors.idCardFront ? "border-red-500" : ""
                  }`}
                />
                {errors.idCardFront && (
                  <p className="text-red-500 text-sm">{errors.idCardFront}</p>
                )}
              </div>

              {/* ID Card Back */}
              <div className="space-y-2">
                <Label>{t("id_card_back")}</Label>
                <Input
                  type="file"
                  name="idCardBack"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className={`w-full ${
                    errors.idCardBack ? "border-red-500" : ""
                  }`}
                />
                {errors.idCardBack && (
                  <p className="text-red-500 text-sm">{errors.idCardBack}</p>
                )}
              </div>

              {/* Birth Certificate */}
              <div className="space-y-2">
                <Label>{t("birth_certificate_optional")}</Label>
                <Input
                  type="file"
                  name="birthCertificate"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        {step !== "personal" && (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              step === "address" ? setStep("personal") : setStep("address")
            }
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
          >
            {t("previous")}
          </Button>
        )}

        {step !== "documents" ? (
          <Button
            type="button"
            onClick={() =>
              step === "personal" ? setStep("address") : setStep("documents")
            }
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            {t("next_step")}
          </Button>
        ) : (
          <Button
            type="submit"
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            {t("complete_registration")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default NewResidentForm;
