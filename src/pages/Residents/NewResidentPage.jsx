import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

const CreateResidentForm = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Form state
  const [resident, setResident] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    place_of_birth: "",
    nationality: "Ethiopian",
    marital_status: "",
    occupation: "",
    education_level: "",
    phone_number: "",
    email_address: "",
    national_id: "",
    is_active: true,
    deceased: false,
    house_number: "",
    street_name: "",
    subcity: "",
    city: "",
    postal_code: "",
    kebele_id: "",
    region_id: "",
    woreda_id: "",
    zone_id: "",
    address_id: "",
    family_id: "",
    photo_path: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null); // New state for photo preview
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Reference data
  const [kebeles, setKebeles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [zones, setZones] = useState([]);
  const [woredas, setWoredas] = useState([]);

  // Load reference data when component mounts
  useEffect(() => {
    const fetchReferenceData = async () => {
      setIsLoading(true);
      try {
        const [kebeleRes, regionRes, zoneRes, woredaRes] = await Promise.all([
          fetch("http://localhost/krfs-api/api/residents/kebeles.php"),
          fetch("http://localhost/krfs-api/api/residents/regions.php"),
          fetch("http://localhost/krfs-api/api/residents/zones.php"),
          fetch("http://localhost/krfs-api/api/residents/woredas.php"),
        ]);
        const [kebeleData, regionData, zoneData, woredaData] =
          await Promise.all([
            kebeleRes.json(),
            regionRes.json(),
            zoneRes.json(),
            woredaRes.json(),
          ]);
        setKebeles(kebeleData.data || []);
        setRegions(regionData.data || []);
        setZones(zoneData.data || []);
        setWoredas(woredaData.data || []);
      } catch (error) {
        toast.error("Failed to load reference data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReferenceData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setResident((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (field, value) => {
    setResident((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle photo file input with preview
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  // Reset form to initial state
  const handleReset = () => {
    setResident({
      first_name: "",
      middle_name: "",
      last_name: "",
      gender: "",
      date_of_birth: "",
      place_of_birth: "",
      nationality: "Ethiopian",
      marital_status: "",
      occupation: "",
      education_level: "",
      phone_number: "",
      email_address: "",
      national_id: "",
      is_active: true,
      deceased: false,
      house_number: "",
      street_name: "",
      subcity: "",
      city: "",
      postal_code: "",
      kebele_id: "",
      region_id: "",
      woreda_id: "",
      zone_id: "",
      address_id: "",
      family_id: "",
      photo_path: "",
    });
    setPhotoFile(null);
    setPhotoPreview(null);
    setValidationErrors({});
    toast.info("Form has been reset");
  };

  const validateForm = () => {
    const errors = {};
    if (!resident.first_name?.trim())
      errors.first_name = "First name is required";
    if (!resident.last_name?.trim()) errors.last_name = "Last name is required";
    if (!resident.gender) errors.gender = "Gender is required";
    if (!resident.date_of_birth)
      errors.date_of_birth = "Date of birth is required";
    if (!resident.national_id) errors.national_id = "National ID is required";
    if (!resident.kebele_id) errors.kebele_id = "Kebele is required";
    if (!resident.region_id) errors.region_id = "Region is required";
    if (!resident.zone_id) errors.zone_id = "Zone is required";
    if (!resident.woreda_id) errors.woreda_id = "Woreda is required";
    if (
      resident.email_address &&
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(resident.email_address)
    )
      errors.email_address = "Invalid email address";
    if (
      resident.phone_number &&
      !/^(\+251|0)?9\d{8}$/.test(resident.phone_number)
    )
      errors.phone_number = "Invalid phone number";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix form errors");
      return;
    }
    setIsSubmitting(true);
    let photoPath = resident.photo_path;
    if (photoFile) {
      const formData = new FormData();
      formData.append("file", photoFile);
      try {
        const uploadRes = await fetch(
          "http://localhost/krfs-api/api/upload_photo.php",
          {
            method: "POST",
            body: formData,
          }
        );
        const uploadData = await uploadRes.json();
        if (uploadData.success) {
          photoPath = uploadData.file_path;
        } else {
          toast.error("Photo upload failed");
          setIsSubmitting(false);
          return;
        }
      } catch (err) {
        toast.error("Photo upload failed");
        setIsSubmitting(false);
        return;
      }
    }
    try {
      const response = await fetch(
        `http://localhost/krfs-api/api/residents/create.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 1",
          },
          body: JSON.stringify({ ...resident, photo_path: photoPath }),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (result.success) {
        toast.success(t("resident_created"));
        setTimeout(() => navigate(`/residents/${result.resident_id}`), 2000);
      } else {
        throw new Error(result.error || "Creation failed");
      }
    } catch (err) {
      toast.error(err.message, { type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegionChange = (regionId) => {
    handleSelectChange("region_id", regionId);
    handleSelectChange("zone_id", "");
    handleSelectChange("woreda_id", "");
  };

  const handleZoneChange = (zoneId) => {
    handleSelectChange("zone_id", zoneId);
    handleSelectChange("woreda_id", "");
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            disabled={isSubmitting}
            aria-label={t("back")}
          >
            ← {t("back")}
          </Button>
          <h2 className="text-2xl font-bold">{t("add_resident")}</h2>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("resident_information")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">{t("personal")}</TabsTrigger>
                <TabsTrigger value="contact">{t("contact")}</TabsTrigger>
                <TabsTrigger value="address">{t("address")}</TabsTrigger>
              </TabsList>
              <form onSubmit={handleSubmit}>
                {/* Personal Information Tab */}
                <TabsContent value="personal">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {t("personal_information")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first_name">
                          {t("first_name")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={resident.first_name}
                          onChange={handleChange}
                          placeholder={t("first_name")}
                          className={
                            validationErrors.first_name ? "border-red-500" : ""
                          }
                          aria-invalid={!!validationErrors.first_name}
                          aria-describedby={
                            validationErrors.first_name
                              ? "first_name-error"
                              : undefined
                          }
                        />
                        {validationErrors.first_name && (
                          <p
                            id="first_name-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.first_name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="middle_name">{t("middle_name")}</Label>
                        <Input
                          id="middle_name"
                          name="middle_name"
                          value={resident.middle_name}
                          onChange={handleChange}
                          placeholder={t("middle_name")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last_name">
                          {t("last_name")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={resident.last_name}
                          onChange={handleChange}
                          placeholder={t("last_name")}
                          className={
                            validationErrors.last_name ? "border-red-500" : ""
                          }
                          aria-invalid={!!validationErrors.last_name}
                          aria-describedby={
                            validationErrors.last_name
                              ? "last_name-error"
                              : undefined
                          }
                        />
                        {validationErrors.last_name && (
                          <p
                            id="last_name-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.last_name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="gender">
                          {t("gender")} <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("gender", value)
                          }
                          value={resident.gender}
                        >
                          <SelectTrigger
                            className={
                              validationErrors.gender ? "border-red-500" : ""
                            }
                            aria-invalid={!!validationErrors.gender}
                            aria-describedby={
                              validationErrors.gender
                                ? "gender-error"
                                : undefined
                            }
                          >
                            <SelectValue placeholder={t("select_gender")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">{t("male")}</SelectItem>
                            <SelectItem value="Female">
                              {t("female")}
                            </SelectItem>
                            <SelectItem value="Other">{t("other")}</SelectItem>
                          </SelectContent>
                        </Select>
                        {validationErrors.gender && (
                          <p id="gender-error" className="text-red-500 text-sm">
                            {validationErrors.gender}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date_of_birth">
                          {t("date_of_birth")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="date_of_birth"
                          name="date_of_birth"
                          type="date"
                          value={resident.date_of_birth}
                          onChange={handleChange}
                          className={
                            validationErrors.date_of_birth
                              ? "border-red-500"
                              : ""
                          }
                          aria-invalid={!!validationErrors.date_of_birth}
                          aria-describedby={
                            validationErrors.date_of_birth
                              ? "date_of_birth-error"
                              : undefined
                          }
                        />
                        {validationErrors.date_of_birth && (
                          <p
                            id="date_of_birth-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.date_of_birth}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="place_of_birth">
                          {t("place_of_birth")}
                        </Label>
                        <Input
                          id="place_of_birth"
                          name="place_of_birth"
                          value={resident.place_of_birth}
                          onChange={handleChange}
                          placeholder={t("place_of_birth")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nationality">{t("nationality")}</Label>
                        <Input
                          id="nationality"
                          name="nationality"
                          value={resident.nationality}
                          onChange={handleChange}
                          defaultValue="Ethiopian"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="marital_status">
                          {t("marital_status")}
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("marital_status", value)
                          }
                          value={resident.marital_status}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("select_marital_status")}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Single">
                              {t("single")}
                            </SelectItem>
                            <SelectItem value="Married">
                              {t("married")}
                            </SelectItem>
                            <SelectItem value="Divorced">
                              {t("divorced")}
                            </SelectItem>
                            <SelectItem value="Widowed">
                              {t("widowed")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="national_id">
                          {t("national_id")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="national_id"
                          name="national_id"
                          value={resident.national_id}
                          onChange={handleChange}
                          placeholder={t("national_id")}
                          className={
                            validationErrors.national_id ? "border-red-500" : ""
                          }
                          aria-invalid={!!validationErrors.national_id}
                          aria-describedby={
                            validationErrors.national_id
                              ? "national_id-error"
                              : undefined
                          }
                        />
                        {validationErrors.national_id && (
                          <p
                            id="national_id-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.national_id}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="occupation">{t("occupation")}</Label>
                        <Input
                          id="occupation"
                          name="occupation"
                          value={resident.occupation}
                          onChange={handleChange}
                          placeholder={t("occupation")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="education_level">
                          {t("education_level")}
                        </Label>
                        <Input
                          id="education_level"
                          name="education_level"
                          value={resident.education_level}
                          onChange={handleChange}
                          placeholder={t("education_level")}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="photo_path">{t("photo")}</Label>
                      <Input
                        id="photo_path"
                        name="photo_path"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        aria-describedby="photo_path-description"
                      />
                      <p
                        id="photo_path-description"
                        className="text-sm text-gray-500"
                      >
                        {t("upload_photo_description")}
                      </p>
                      {photoPreview && (
                        <div className="mt-4">
                          <img
                            src={photoPreview}
                            alt="Photo preview"
                            className="w-32 h-32 object-cover rounded-md border"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                {/* Contact Information Tab */}
                <TabsContent value="contact">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {t("contact_information")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone_number">
                          {t("phone_number")}
                        </Label>
                        <Input
                          id="phone_number"
                          name="phone_number"
                          value={resident.phone_number}
                          onChange={handleChange}
                          placeholder="+2519XXXXXXXX"
                          className={
                            validationErrors.phone_number
                              ? "border-red-500"
                              : ""
                          }
                          aria-invalid={!!validationErrors.phone_number}
                          aria-describedby={
                            validationErrors.phone_number
                              ? "phone_number-error"
                              : undefined
                          }
                        />
                        {validationErrors.phone_number && (
                          <p
                            id="phone_number-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.phone_number}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email_address">
                          {t("email_address")}
                        </Label>
                        <Input
                          id="email_address"
                          name="email_address"
                          type="email"
                          value={resident.email_address}
                          onChange={handleChange}
                          placeholder={t("email_address")}
                          className={
                            validationErrors.email_address
                              ? "border-red-500"
                              : ""
                          }
                          aria-invalid={!!validationErrors.email_address}
                          aria-describedby={
                            validationErrors.email_address
                              ? "email_address-error"
                              : undefined
                          }
                        />
                        {validationErrors.email_address && (
                          <p
                            id="email_address-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.email_address}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Address Information Tab */}
                <TabsContent value="address">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      {t("address_information")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="house_number">
                          {t("house_number")}
                        </Label>
                        <Input
                          id="house_number"
                          name="house_number"
                          value={resident.house_number}
                          onChange={handleChange}
                          placeholder={t("house_number")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street_name">
                          {t("street_name")}
                        </Label>
                        <Input
                          id="street_name"
                          name="street_name"
                          value={resident.street_name}
                          onChange={handleChange}
                          placeholder={t("street_name")}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="subcity">{t("subcity")}</Label>
                        <Input
                          id="subcity"
                          name="subcity"
                          value={resident.subcity}
                          onChange={handleChange}
                          placeholder={t("subcity")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input
                          id="city"
                          name="city"
                          value={resident.city}
                          onChange={handleChange}
                          placeholder={t("city")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postal_code">
                          {t("postal_code")}
                        </Label>
                        <Input
                          id="postal_code"
                          name="postal_code"
                          value={resident.postal_code}
                          onChange={handleChange}
                          placeholder={t("postal_code")}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="region_id">
                          {t("region")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={handleRegionChange}
                          value={String(resident.region_id)}
                        >
                          <SelectTrigger
                            className={
                              validationErrors.region_id ? "border-red-500" : ""
                            }
                            aria-invalid={!!validationErrors.region_id}
                            aria-describedby={
                              validationErrors.region_id
                                ? "region_id-error"
                                : undefined
                            }
                          >
                            <SelectValue placeholder={t("select_region")} />
                          </SelectTrigger>
                          <SelectContent>
                            {regions.map((region) => (
                              <SelectItem
                                key={region.region_id}
                                value={String(region.region_id)}
                              >
                                {region.region_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {validationErrors.region_id && (
                          <p
                            id="region_id-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.region_id}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zone_id">
                          {t("zone")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={handleZoneChange}
                          value={String(resident.zone_id)}
                          disabled={!resident.region_id}
                        >
                          <SelectTrigger
                            className={
                              validationErrors.zone_id ? "border-red-500" : ""
                            }
                            aria-invalid={!!validationErrors.zone_id}
                            aria-describedby={
                              validationErrors.zone_id
                                ? "zone_id-error"
                                : undefined
                            }
                          >
                            <SelectValue
                              placeholder={
                                resident.region_id
                                  ? t("select_zone")
                                  : t("select_region_first")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {zones
                              .filter(
                                (zone) =>
                                  String(zone.region_id) ===
                                  String(resident.region_id)
                              )
                              .map((zone) => (
                                <SelectItem
                                  key={zone.zone_id}
                                  value={String(zone.zone_id)}
                                >
                                  {zone.zone_name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {validationErrors.zone_id && (
                          <p
                            id="zone_id-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.zone_id}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="woreda_id">
                          {t("woreda")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("woreda_id", value)
                          }
                          value={String(resident.woreda_id)}
                          disabled={!resident.zone_id}
                        >
                          <SelectTrigger
                            className={
                              validationErrors.woreda_id ? "border-red-500" : ""
                            }
                            aria-invalid={!!validationErrors.woreda_id}
                            aria-describedby={
                              validationErrors.woreda_id
                                ? "woreda_id-error"
                                : undefined
                            }
                          >
                            <SelectValue
                              placeholder={
                                resident.zone_id
                                  ? t("select_woreda")
                                  : t("select_zone_first")
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {woredas
                              .filter(
                                (woreda) =>
                                  String(woreda.zone_id) ===
                                  String(resident.zone_id)
                              )
                              .map((woreda) => (
                                <SelectItem
                                  key={woreda.woreda_id}
                                  value={String(woreda.woreda_id)}
                                >
                                  {woreda.woreda_name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {validationErrors.woreda_id && (
                          <p
                            id="woreda_id-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.woreda_id}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="kebele_id">
                          {t("kebele")}{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          onValueChange={(value) =>
                            handleSelectChange("kebele_id", value)
                          }
                          value={String(resident.kebele_id)}
                        >
                          <SelectTrigger
                            className={
                              validationErrors.kebele_id ? "border-red-500" : ""
                            }
                            aria-invalid={!!validationErrors.kebele_id}
                            aria-describedby={
                              validationErrors.kebele_id
                                ? "kebele_id-error"
                                : undefined
                            }
                          >
                            <SelectValue placeholder={t("select_kebele")} />
                          </SelectTrigger>
                          <SelectContent>
                            {kebeles
                              .filter(
                                (kebele) =>
                                  String(kebele.woreda_id) ===
                                  String(resident.woreda_id)
                              )
                              .map((kebele) => (
                                <SelectItem
                                  key={kebele.kebele_id}
                                  value={String(kebele.kebele_id)}
                                >
                                  {kebele.kebele_name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        {validationErrors.kebele_id && (
                          <p
                            id="kebele_id-error"
                            className="text-red-500 text-sm"
                          >
                            {validationErrors.kebele_id}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Additional Information Section */}
                <div className="space-y-4 mt-6">
                  <h3 className="text-lg font-semibold">
                    {t("additional_information")}
                  </h3>
                  <div className="flex flex-wrap gap-6 pt-2 pb-4">
                    <div className="flex items-center space-x-2">
                      <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        checked={resident.is_active}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        aria-checked={resident.is_active}
                      />
                      <Label htmlFor="is_active">{t("is_active")}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        id="deceased"
                        name="deceased"
                        type="checkbox"
                        checked={resident.deceased}
                        onChange={handleChange}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                        aria-checked={resident.deceased}
                      />
                      <Label htmlFor="deceased">{t("deceased")}</Label>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="flex-1"
                    aria-label={t("create_resident")}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("creating")}...
                      </span>
                    ) : (
                      t("create_resident")
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="flex-1"
                    aria-label={t("reset")}
                  >
                    {t("reset")}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => navigate("/residents")}
                    disabled={isSubmitting}
                    className="flex-1"
                    aria-label={t("cancel")}
                  >
                    {t("cancel")}
                  </Button>
                </div>
              </form>
            </Tabs>
          </CardContent>
        </Card>
      )}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default CreateResidentForm;