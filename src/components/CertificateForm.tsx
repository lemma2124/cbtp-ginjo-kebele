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
import ImageUpload from "./ImageUpload";

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

interface CertificateFormProps {
  certificateData: CertificateData;
  setCertificateData: (data: CertificateData) => void;
  selectedTemplate: string;
  setSelectedTemplate: (template: string) => void;
}

const CertificateForm: React.FC<CertificateFormProps> = ({
  certificateData,
  setCertificateData,
  selectedTemplate,
  setSelectedTemplate,
}) => {
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
        "http://localhost/certificate-generator/generate.php",
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

  const templates = [
    {
      id: "modern",
      name: "Modern Blue",
      description: "Clean and professional",
      icon: "🔷",
    },
    {
      id: "elegant",
      name: "Elegant Gold",
      description: "Classic and sophisticated",
      icon: "✨",
    },
    {
      id: "creative",
      name: "Creative Purple",
      description: "Vibrant and artistic",
      icon: "🎨",
    },
    {
      id: "ethiopian",
      name: "Ethiopian Official",
      description: "Government style with flag and stamps",
      icon: "🇪🇹",
    },
  ];

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
    <div className="space-y-6">
      <Tabs defaultValue="template" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="template">Template</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
          <TabsTrigger value="generate">Generate</TabsTrigger>
        </TabsList>

        <TabsContent value="template" className="space-y-4">
          <div>
            <Label className="text-lg font-semibold text-gray-800 mb-4 block">
              Choose Template
            </Label>
            <div className="grid grid-cols-1 gap-3">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer border-2 transition-all hover:shadow-lg ${
                    selectedTemplate === template.id
                      ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{template.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {template.description}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        selectedTemplate === template.id
                          ? "bg-blue-500 border-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedTemplate === template.id && (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

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
                  {isResidentCertificate ? "Full Name" : "Recipient Name"}
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
                          handleInputChange("fatherName", e.target.value)
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
                          handleInputChange("motherName", e.target.value)
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
                          handleInputChange("kebeleNumber", e.target.value)
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
                          handleInputChange("birthPlace", e.target.value)
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
                          handleInputChange("spouseName", e.target.value)
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
                            handleInputChange("deathPlace", e.target.value)
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
                            handleInputChange("deathCause", e.target.value)
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
                        handleInputChange("nationality", e.target.value)
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
                        handleInputChange("courseName", e.target.value)
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
                        handleInputChange("instructorName", e.target.value)
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
                        handleInputChange("organizationName", e.target.value)
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
                    handleInputChange("completionDate", e.target.value)
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ImageUpload
                label="Ethiopian Flag"
                onImageUpload={(file) =>
                  handleImageUpload("ethiopianFlag", file)
                }
              />
              <ImageUpload
                label="Oromia Flag"
                onImageUpload={(file) => handleImageUpload("oromiaFlag", file)}
              />
              <ImageUpload
                label="Kebele Stamp"
                onImageUpload={(file) => handleImageUpload("kebeleStamp", file)}
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
              Your certificate is ready to be generated. Choose your preferred
              format below.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  );
};

export default CertificateForm;
