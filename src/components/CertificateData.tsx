import React from "react";
import ModernTemplate from "./templates/ModernTemplate";
import ElegantTemplate from "./templates/ElegantTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import EthiopianTemplate from "./templates/EthiopianTemplate";

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

interface CertificatePreviewProps {
  certificateData: CertificateData;
  template: string;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  certificateData,
  template,
}) => {
  const renderTemplate = () => {
    switch (template) {
      case "modern":
        return <ModernTemplate data={certificateData} />;
      case "elegant":
        return <ElegantTemplate data={certificateData} />;
      case "creative":
        return <CreativeTemplate data={certificateData} />;
      case "ethiopian":
        return <EthiopianTemplate data={certificateData} />;
      default:
        return <ModernTemplate data={certificateData} />;
    }
  };

  return (
    <div className="w-full">
      <div className="transform scale-90 origin-top-left w-[111%]">
        {renderTemplate()}
      </div>
    </div>
  );
};

export default CertificatePreview;
