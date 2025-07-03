import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, X } from "lucide-react";

interface CertificateData {
  recipientName: string;
  courseName: string;
  completionDate: string;
  instructorName: string;
  organizationName: string;
  certificateType: string;
  fatherName: string;
  motherName: string;
  birthPlace: string;
  nationality: string;
  kebeleNumber: string;
  woreda: string;
  zone: string;
  region: string;
  spouseName: string;
  deathCause: string;
  deathPlace: string;
}

interface ImageUploadProps {
  label: string;
  onImageUpload: (file: File | null) => void;
  currentImage?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  onImageUpload,
  currentImage,
}) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageUpload(null);
  };

  return (
    <Card className="p-4 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
      <Label className="text-sm font-medium text-gray-700 mb-2 block">
        {label}
      </Label>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt={label}
            className="w-full h-32 object-cover rounded-lg"
          />
          <Button
            onClick={removeImage}
            size="sm"
            variant="destructive"
            className="absolute top-2 right-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <label
          htmlFor={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
          className="cursor-pointer"
        >
          <div className="flex flex-col items-center justify-center h-32 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              Click to upload {label}
            </p>
            <p className="text-xs text-gray-400">PNG, JPG up to 2MB</p>
          </div>
          <input
            id={`upload-${label.replace(/\s+/g, "-").toLowerCase()}`}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </Card>
  );
};

const EthiopianTemplate: React.FC<{ data: CertificateData }> = ({ data }) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isResidentCertificate = ["birth", "marriage", "death"].includes(
    data.certificateType
  );

  return (
    <div className="w-full h-[700px] bg-white border-4 border-gray-800 relative overflow-hidden">
      {/* Ethiopian Flag Header */}
      <div className="flex h-6">
        <div className="flex-1 bg-green-500"></div>
        <div className="flex-1 bg-yellow-400"></div>
        <div className="flex-1 bg-red-500"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            FEDERAL DEMOCRATIC REPUBLIC OF ETHIOPIA
          </h1>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-green-500 via-yellow-400 to-red-500 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-blue-800">
            {data.certificateType === "birth" &&
              "BIRTH CERTIFICATE / የልደት ምስክር ወረቀት"}
            {data.certificateType === "marriage" &&
              "MARRIAGE CERTIFICATE / የጋብቻ ምስክር ወረቀት"}
            {data.certificateType === "death" &&
              "DEATH CERTIFICATE / የሞት ምስክር ወረቀት"}
            {!isResidentCertificate &&
              "CERTIFICATE OF COMPLETION / የማጠናቀቂያ ምስክር ወረቀት"}
          </h3>
        </div>

        {/* Certificate Content */}
        <div className="flex-grow">
          {isResidentCertificate ? (
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 font-semibold">Full Name:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.recipientName}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Father's Name:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.fatherName}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Mother's Name:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.motherName}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Kebele No:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.kebeleNumber}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Woreda:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.woreda}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex">
                  <span className="w-32 font-semibold">Zone:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.zone}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Region:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.region}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Date:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {formatDate(data.completionDate)}
                  </span>
                </div>
                <div className="flex">
                  <span className="w-32 font-semibold">Nationality:</span>
                  <span className="border-b border-gray-400 flex-1 px-2">
                    {data.nationality}
                  </span>
                </div>
                {data.certificateType === "birth" && (
                  <div className="flex">
                    <span className="w-32 font-semibold">Birth Place:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">
                      {data.birthPlace}
                    </span>
                  </div>
                )}
                {data.certificateType === "marriage" && (
                  <div className="flex">
                    <span className="w-32 font-semibold">Spouse:</span>
                    <span className="border-b border-gray-400 flex-1 px-2">
                      {data.spouseName}
                    </span>
                  </div>
                )}
                {data.certificateType === "death" && (
                  <>
                    <div className="flex">
                      <span className="w-32 font-semibold">Death Place:</span>
                      <span className="border-b border-gray-400 flex-1 px-2">
                        {data.deathPlace}
                      </span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-semibold">Cause:</span>
                      <span className="border-b border-gray-400 flex-1 px-2">
                        {data.deathCause}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <p className="text-lg">This is to certify that</p>
              <h3 className="text-3xl font-bold text-blue-800 border-b-2 border-blue-300 pb-2 mx-8">
                {data.recipientName}
              </h3>
              <p className="text-lg">has successfully completed</p>
              <h4 className="text-2xl font-semibold text-blue-700">
                {data.courseName}
              </h4>
            </div>
          )}
        </div>

        {/* Footer with stamps */}
        <div className="flex justify-between items-end mt-8">
          <div className="text-center">
            <div className="w-24 h-24 border-2 border-gray-400 rounded-lg flex items-center justify-center bg-gray-50 mb-2">
              <span className="text-xs text-gray-600">Ethiopian Flag</span>
            </div>
            <p className="text-xs">Official Seal</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 border-2 border-gray-400 rounded-lg flex items-center justify-center bg-gray-50 mb-2">
              <span className="text-xs text-gray-600">Oromia Flag</span>
            </div>
            <p className="text-xs">Regional Seal</p>
          </div>

          <div className="text-center">
            <div className="w-24 h-24 border-2 border-gray-400 rounded-lg flex items-center justify-center bg-gray-50 mb-2">
              <span className="text-xs text-gray-600">Kebele Stamp</span>
            </div>
            <p className="text-xs">Kebele Authority</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateApp: React.FC = () => {
  const [certificateData, setCertificateData] = useState<CertificateData>({
    recipientName: "",
    courseName: "",
    completionDate: "",
    instructorName: "",
    organizationName: "Professional Learning Institute",
    certificateType: "birth",
    fatherName: "",
    motherName: "",
    birthPlace: "",
    nationality: "Ethiopian",
    kebeleNumber: "",
    woreda: "",
    zone: "",
    region: "Oromia",
    spouseName: "",
    deathCause: "",
    deathPlace: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState("ethiopian");
  const [uploadedImages, setUploadedImages] = useState({
    ethiopianFlag: null as File | null,
    oromiaFlag: null as File | null,
    kebeleStamp: null as File | null,
  });

  const handleInputChange = (field: keyof CertificateData, value: string) => {
    setCertificateData({
      ...certificateData,
      [field]: value,
    });
  };

  const handleImageUpload = (
    type: "ethiopianFlag" | "oromiaFlag" | "kebeleStamp",
    file: File | null
  ) => {
    setUploadedImages((prev) => ({
      ...prev,
      [type]: file,
    }));
  };

  const generateCertificate = async (format: "pdf" | "image") => {
    try {
      const formData = new FormData();
      formData.append("certificateData", JSON.stringify(certificateData));
      formData.append("template", selectedTemplate);
      formData.append("format", format);

      // Add uploaded images
      if (uploadedImages.ethiopianFlag) {
        formData.append("ethiopianFlag", uploadedImages.ethiopianFlag);
      }
      if (uploadedImages.oromiaFlag) {
        formData.append("oromiaFlag", uploadedImages.oromiaFlag);
      }
      if (uploadedImages.kebeleStamp) {
        formData.append("kebeleStamp", uploadedImages.kebeleStamp);
      }

      const response = await fetch(
        "http://localhost/certificate-generator/certificate.php",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate.${format === "pdf" ? "pdf" : "png"}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        console.error("Failed to generate certificate");
      }
    } catch (error) {
      console.error("Error generating certificate:", error);
    }
  };

  const certificateTypes = [
    {
      id: "completion",
      name: "Certificate of Completion",
      category: "education",
    },
    {
      id: "achievement",
      name: "Certificate of Achievement",
      category: "education",
    },
    {
      id: "appreciation",
      name: "Certificate of Appreciation",
      category: "education",
    },
    {
      id: "participation",
      name: "Certificate of Participation",
      category: "education",
    },
    { id: "birth", name: "Birth Certificate", category: "resident" },
    { id: "marriage", name: "Marriage Certificate", category: "resident" },
    { id: "death", name: "Death Certificate", category: "resident" },
  ];

  const isResidentCertificate = ["birth", "marriage", "death"].includes(
    certificateData.certificateType
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-4xl">🇪🇹</div>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">
                Ethiopian Certificate Generator
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Generate official certificates with Ethiopian government styling
              </p>
            </div>
            <div className="text-4xl">📜</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Form Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
                <h2 className="text-2xl font-bold">Certificate Builder</h2>
                <p className="opacity-90">
                  Fill in the details and customize your certificate
                </p>
              </div>
              <div className="p-6">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="images">Images</TabsTrigger>
                    <TabsTrigger value="generate">Generate</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6">
                    <div>
                      <Label
                        htmlFor="certificateType"
                        className="text-lg font-semibold text-gray-800"
                      >
                        Certificate Type
                      </Label>
                      <Select
                        value={certificateData.certificateType}
                        onValueChange={(value) =>
                          handleInputChange("certificateType", value)
                        }
                      >
                        <SelectTrigger className="mt-2 h-12">
                          <SelectValue placeholder="Select certificate type" />
                        </SelectTrigger>
                        <SelectContent>
                          <div className="font-semibold text-gray-600 px-2 py-1 text-sm">
                            Educational Certificates
                          </div>
                          {certificateTypes
                            .filter((type) => type.category === "education")
                            .map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                          <div className="font-semibold text-gray-600 px-2 py-1 text-sm mt-2">
                            Resident Certificates
                          </div>
                          {certificateTypes
                            .filter((type) => type.category === "resident")
                            .map((type) => (
                              <SelectItem key={type.id} value={type.id}>
                                {type.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Card className="p-6 bg-gradient-to-br from-gray-50 to-white">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        {isResidentCertificate
                          ? "Personal Information"
                          : "Certificate Information"}
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="recipientName"
                            className="text-base font-medium text-gray-700"
                          >
                            {isResidentCertificate
                              ? "Full Name"
                              : "Recipient Name"}
                          </Label>
                          <Input
                            id="recipientName"
                            type="text"
                            value={certificateData.recipientName}
                            onChange={(e) =>
                              handleInputChange("recipientName", e.target.value)
                            }
                            placeholder="Enter full name"
                            className="mt-2 h-12"
                          />
                        </div>

                        {isResidentCertificate && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor="fatherName"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Father's Name
                                </Label>
                                <Input
                                  id="fatherName"
                                  type="text"
                                  value={certificateData.fatherName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "fatherName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter father's name"
                                  className="mt-2 h-12"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="motherName"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Mother's Name
                                </Label>
                                <Input
                                  id="motherName"
                                  type="text"
                                  value={certificateData.motherName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "motherName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter mother's name"
                                  className="mt-2 h-12"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor="kebeleNumber"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Kebele Number
                                </Label>
                                <Input
                                  id="kebeleNumber"
                                  type="text"
                                  value={certificateData.kebeleNumber}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "kebeleNumber",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter kebele number"
                                  className="mt-2 h-12"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="woreda"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Woreda
                                </Label>
                                <Input
                                  id="woreda"
                                  type="text"
                                  value={certificateData.woreda}
                                  onChange={(e) =>
                                    handleInputChange("woreda", e.target.value)
                                  }
                                  placeholder="Enter woreda"
                                  className="mt-2 h-12"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label
                                  htmlFor="zone"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Zone
                                </Label>
                                <Input
                                  id="zone"
                                  type="text"
                                  value={certificateData.zone}
                                  onChange={(e) =>
                                    handleInputChange("zone", e.target.value)
                                  }
                                  placeholder="Enter zone"
                                  className="mt-2 h-12"
                                />
                              </div>
                              <div>
                                <Label
                                  htmlFor="region"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Region
                                </Label>
                                <Input
                                  id="region"
                                  type="text"
                                  value={certificateData.region}
                                  onChange={(e) =>
                                    handleInputChange("region", e.target.value)
                                  }
                                  placeholder="Enter region"
                                  className="mt-2 h-12"
                                />
                              </div>
                            </div>

                            {certificateData.certificateType === "birth" && (
                              <div>
                                <Label
                                  htmlFor="birthPlace"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Place of Birth
                                </Label>
                                <Input
                                  id="birthPlace"
                                  type="text"
                                  value={certificateData.birthPlace}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "birthPlace",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter place of birth"
                                  className="mt-2 h-12"
                                />
                              </div>
                            )}

                            {certificateData.certificateType === "marriage" && (
                              <div>
                                <Label
                                  htmlFor="spouseName"
                                  className="text-base font-medium text-gray-700"
                                >
                                  Spouse Name
                                </Label>
                                <Input
                                  id="spouseName"
                                  type="text"
                                  value={certificateData.spouseName}
                                  onChange={(e) =>
                                    handleInputChange(
                                      "spouseName",
                                      e.target.value
                                    )
                                  }
                                  placeholder="Enter spouse name"
                                  className="mt-2 h-12"
                                />
                              </div>
                            )}

                            {certificateData.certificateType === "death" && (
                              <>
                                <div>
                                  <Label
                                    htmlFor="deathPlace"
                                    className="text-base font-medium text-gray-700"
                                  >
                                    Place of Death
                                  </Label>
                                  <Input
                                    id="deathPlace"
                                    type="text"
                                    value={certificateData.deathPlace}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "deathPlace",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter place of death"
                                    className="mt-2 h-12"
                                  />
                                </div>
                                <div>
                                  <Label
                                    htmlFor="deathCause"
                                    className="text-base font-medium text-gray-700"
                                  >
                                    Cause of Death
                                  </Label>
                                  <Input
                                    id="deathCause"
                                    type="text"
                                    value={certificateData.deathCause}
                                    onChange={(e) =>
                                      handleInputChange(
                                        "deathCause",
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter cause of death"
                                    className="mt-2 h-12"
                                  />
                                </div>
                              </>
                            )}

                            <div>
                              <Label
                                htmlFor="nationality"
                                className="text-base font-medium text-gray-700"
                              >
                                Nationality
                              </Label>
                              <Input
                                id="nationality"
                                type="text"
                                value={certificateData.nationality}
                                onChange={(e) =>
                                  handleInputChange(
                                    "nationality",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter nationality"
                                className="mt-2 h-12"
                              />
                            </div>
                          </>
                        )}

                        {!isResidentCertificate && (
                          <>
                            <div>
                              <Label
                                htmlFor="courseName"
                                className="text-base font-medium text-gray-700"
                              >
                                Course/Program Name
                              </Label>
                              <Input
                                id="courseName"
                                type="text"
                                value={certificateData.courseName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "courseName",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter course or program name"
                                className="mt-2 h-12"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="instructorName"
                                className="text-base font-medium text-gray-700"
                              >
                                Instructor Name
                              </Label>
                              <Input
                                id="instructorName"
                                type="text"
                                value={certificateData.instructorName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "instructorName",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter instructor's name"
                                className="mt-2 h-12"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="organizationName"
                                className="text-base font-medium text-gray-700"
                              >
                                Organization Name
                              </Label>
                              <Input
                                id="organizationName"
                                type="text"
                                value={certificateData.organizationName}
                                onChange={(e) =>
                                  handleInputChange(
                                    "organizationName",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter organization name"
                                className="mt-2 h-12"
                              />
                            </div>
                          </>
                        )}

                        <div>
                          <Label
                            htmlFor="completionDate"
                            className="text-base font-medium text-gray-700"
                          >
                            {isResidentCertificate ? "Date" : "Completion Date"}
                          </Label>
                          <Input
                            id="completionDate"
                            type="date"
                            value={certificateData.completionDate}
                            onChange={(e) =>
                              handleInputChange(
                                "completionDate",
                                e.target.value
                              )
                            }
                            className="mt-2 h-12"
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="images" className="space-y-6">
                    <Card className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Upload Official Images
                      </h3>
                      <div className="grid grid-cols-1 gap-6">
                        <ImageUpload
                          label="Ethiopian Flag"
                          onImageUpload={(file) =>
                            handleImageUpload("ethiopianFlag", file)
                          }
                        />
                        <ImageUpload
                          label="Oromia Flag"
                          onImageUpload={(file) =>
                            handleImageUpload("oromiaFlag", file)
                          }
                        />
                        <ImageUpload
                          label="Kebele Stamp"
                          onImageUpload={(file) =>
                            handleImageUpload("kebeleStamp", file)
                          }
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="generate" className="space-y-6">
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-yellow-50">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Generate Certificate
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Your certificate is ready to be generated. Choose your
                        preferred format below.
                      </p>

                      <div className="grid grid-cols-1 gap-4">
                        <Button
                          onClick={() => generateCertificate("pdf")}
                          className="h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-lg font-semibold"
                        >
                          📄 Download as PDF
                        </Button>
                        <Button
                          onClick={() => generateCertificate("image")}
                          className="h-16 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg font-semibold"
                        >
                          🖼️ Download as Image
                        </Button>
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-yellow-600 text-white p-6">
                <h2 className="text-2xl font-bold">Live Preview</h2>
                <p className="opacity-90">
                  See your certificate as you build it
                </p>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="bg-white rounded-lg shadow-inner p-4">
                  <div className="transform scale-90 origin-top-left w-[111%]">
                    <EthiopianTemplate data={certificateData} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateApp;
