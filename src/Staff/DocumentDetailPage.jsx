import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Download,
  Upload,
  CheckCircle,
  Clock,
  XCircle,
  FileUp,
  FilePlus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Load jsPDF via CDN
const script = document.createElement("script");
script.src =
  "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
script.async = true;
document.body.appendChild(script);

const DocumentsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [residentSearch, setResidentSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(null);

  // Fetch documents
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost/krfs-api/api/documents/read.php")
      .then((res) => {
        if (!res.ok) throw new Error(t("errors.network"));
        return res.json();
      })
      .then((data) => {
        setDocuments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        setError(t("errors.fetch_documents"));
        setDocuments([]);
        setLoading(false);
      });
  }, [t]);

  // Fetch residents
  useEffect(() => {
    fetch("http://localhost/krfs-api/api/residents/read.php")
      .then((res) => {
        if (!res.ok) throw new Error(t("errors.network"));
        return res.json();
      })
      .then((data) => {
        console.log("Fetched residents data:", data);

        const validResidents = Array.isArray(data)
          ? data
              .map((resident) => ({
                ...resident,
                id: Number(resident.resident_id) || null,
              }))
              .filter((resident) => resident && resident.id != null)
          : [];

        if (validResidents.length !== data.length) {
          console.warn(
            "Some residents were filtered out due to invalid or missing resident_ids:",
            data.filter(
              (resident) => !resident || Number(resident.resident_id) == null
            )
          );
        }

        console.log("Filtered valid residents:", validResidents);

        setResidents(validResidents);
      })
      .catch((error) => {
        console.error("Error fetching residents:", error);
        setError(t("errors.fetch_residents"));
      });
  }, [t]);

  // Generate certificate
  const handleGenerateCertificate = (residentId, certificateType) => {
    if (residentId == null || isNaN(residentId)) {
      setError(t("errors.invalid_resident_id"));
      console.error("Invalid residentId:", residentId);
      return;
    }

    const resident = residents.find((r) => r.id === Number(residentId));
    if (!resident) {
      setError(t("errors.resident_not_found"));
      console.error("Resident not found for ID:", residentId);
      return;
    }

    if (!window.confirm(t("confirm_generate_certificate"))) return;

    setGenerating(residentId);
    setError(null);

    try {
      // Create PDF using jsPDF
      const { jsPDF } = window.jspdf;
      if (!jsPDF) {
        throw new Error(t("errors.pdf_library_missing"));
      }

      const doc = new jsPDF();

      // Set up page dimensions and margins
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 10;
      let yPosition = margin;

      // Draw a border around the certificate
      doc.setLineWidth(0.5);
      doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

      // Certificate Title
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(0, 102, 204); // Blue color for title
      const titleText = `${certificateType}`;
      const titleWidth = doc.getTextWidth(titleText);
      doc.text(titleText, (pageWidth - titleWidth) / 2, yPosition + 10);
      yPosition += 20;

      // Certificate Subtitle
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Black color for body text
      const subtitleText = `This is to certify that the following information pertains to the resident.`;
      const subtitleWidth = doc.getTextWidth(subtitleText);
      doc.text(subtitleText, (pageWidth - subtitleWidth) / 2, yPosition + 5);
      yPosition += 15;

      // Horizontal line under title
      doc.setLineWidth(0.2);
      doc.line(margin + 10, yPosition, pageWidth - margin - 10, yPosition);
      yPosition += 10;

      // Resident Information
      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text("Resident Details", margin + 10, yPosition);
      yPosition += 8;

      doc.setFont("Helvetica", "normal");
      const fields = [
        {
          label: "Full Name",
          value: `${resident.first_name} ${resident.middle_name || ""} ${
            resident.last_name
          }`,
        },
        { label: "Resident ID", value: resident.resident_id },
        { label: "National ID", value: resident.national_id },
        { label: "Date of Birth", value: resident.date_of_birth || "N/A" },
        { label: "Gender", value: resident.gender || "N/A" },
        { label: "Nationality", value: resident.nationality || "N/A" },
        { label: "Marital Status", value: resident.marital_status || "N/A" },
        { label: "Occupation", value: resident.occupation || "N/A" },
        { label: "Education Level", value: resident.education_level || "N/A" },
        { label: "Phone Number", value: resident.phone_number || "N/A" },
        { label: "Email Address", value: resident.email_address || "N/A" },
        {
          label: "Address",
          value: `${resident.house_number || ""} ${
            resident.street_name || ""
          }, ${resident.subcity || ""}, ${resident.city || ""}, ${
            resident.region_name || ""
          }`,
        },
        { label: "Kebele", value: resident.kebele_name || "N/A" },
      ];

      fields.forEach((field) => {
        doc.setFont("Helvetica", "bold");
        doc.text(`${field.label}:`, margin + 10, yPosition);
        doc.setFont("Helvetica", "normal");
        const valueText = `${field.value}`;
        const maxWidth = pageWidth - 2 * margin - 50; // Adjust for margin and label width
        const splitText = doc.splitTextToSize(valueText, maxWidth);
        doc.text(splitText, margin + 50, yPosition);
        yPosition += 7 * splitText.length; // Adjust y position based on number of lines
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
          doc.rect(
            margin,
            margin,
            pageWidth - 2 * margin,
            pageHeight - 2 * margin
          );
        }
      });

      // Issuer Information
      yPosition += 10;
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
        doc.rect(
          margin,
          margin,
          pageWidth - 2 * margin,
          pageHeight - 2 * margin
        );
      }
      doc.setFont("Helvetica", "bold");
      doc.text("Issuer Information", margin + 10, yPosition);
      yPosition += 8;

      doc.setFont("Helvetica", "normal");
      doc.text(`Authority: Kebele 01 Administration`, margin + 10, yPosition);
      yPosition += 7;
      doc.text(
        `Woreda: ${resident.woreda_name || "N/A"}`,
        margin + 10,
        yPosition
      );
      yPosition += 7;
      doc.text(`Zone: ${resident.zone_name || "N/A"}`, margin + 10, yPosition);
      yPosition += 7;
      doc.text(
        `Region: ${resident.region_name || "N/A"}`,
        margin + 10,
        yPosition
      );
      yPosition += 7;
      doc.text(
        `Issued Date: ${new Date().toLocaleString("en-US", {
          timeZone: "Africa/Addis_Ababa",
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "long",
          year: "numeric",
          weekday: "long",
        })}`,
        margin + 10,
        yPosition
      );

      // Footer
      yPosition = pageHeight - 20;
      doc.setFontSize(10);
      doc.setTextColor(128, 128, 128); // Gray color for footer
      doc.text(
        "Generated by Kebele Resident File System",
        (pageWidth -
          doc.getTextWidth("Generated by Kebele Resident File System")) /
          2,
        yPosition
      );

      // Save the PDF
      const pdfBlob = doc.output("blob");
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
       console.log("dhan kun type ", certificateType)
      link.download = `${certificateType.replace(/\s+/g, "_")}_${
        resident.resident_id
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Add to documents state
      setDocuments((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: `${certificateType} for ${resident.first_name} ${resident.last_name}`,
          category: certificateType.toLowerCase().replace(/\s+/g, "_"),
          filepath: `${certificateType.replace(/\s+/g, "_")}_${
            resident.resident_id
          }.pdf`,
          status: "approved",
          issuedDate: new Date().toISOString().split("T")[0],
          requestedBy: `${resident.first_name} ${resident.last_name}`,
        },
      ]);

      alert(t("success_certificate_generated"));
    } catch (error) {
      console.error(
        "Error generating certificate for resident ID",
        residentId,
        ":",
        error
      );
      setError(error.message || t("errors.generate_certificate"));
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = (filePath) => {
    const downloadUrl = `http://localhost/krfs-api/${filePath}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-ethiopia-green" />;
      case "pending":
        return <Clock className="h-4 w-4 text-ethiopia-yellow" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-ethiopia-red" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="text-ethiopia-green">{t("status.approved")}</span>
        );
      case "pending":
        return (
          <span className="text-ethiopia-yellow">{t("status.pending")}</span>
        );
      case "rejected":
        return (
          <span className="text-ethiopia-red">{t("status.rejected")}</span>
        );
      default:
        return null;
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.requestedBy?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredResidents = residents.filter(
    (resident) =>
      resident.first_name
        ?.toLowerCase()
        .includes(residentSearch.toLowerCase()) ||
      resident.last_name
        ?.toLowerCase()
        .includes(residentSearch.toLowerCase()) ||
      resident.resident_id?.toLowerCase().includes(residentSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">{t("loading")}</span>
      </div>
    );
  }

  if (error && !documents.length && !residents.length) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{t("error")}</AlertTitle>
        <AlertDescription>
          {error}
          <Button
            variant="link"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            {t("retry")}
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 space-y-6">
        {error && (
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("error")}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            {t("documents")}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("documents_description")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder={t("search_documents")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border-primary/20 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                  <Upload className="mr-2 h-4 w-4" />
                  {t("upload_document")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t("tooltip.upload_document")}</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary/20"
                  onClick={() => navigate(`/documents/request`)}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  {t("request_certificate")}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {t("tooltip.request_certificate")}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full bg-primary/10">
            <TabsTrigger value="all">{t("tabs.all")}</TabsTrigger>
            <TabsTrigger value="certificates">
              {t("tabs.certificates")}
            </TabsTrigger>
            <TabsTrigger value="id-cards">{t("tabs.id_cards")}</TabsTrigger>
            <TabsTrigger value="verifications">
              {t("tabs.verifications")}
            </TabsTrigger>
            <TabsTrigger value="generate">{t("tabs.generate")}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <Card
                  key={doc.id}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">
                          {doc.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2">
                          <span>
                            {t("requested_by")}: {doc.requestedBy}
                          </span>
                          <span>
                            {t("date")}: {doc.issuedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center">
                        {getStatusIcon(doc.status)}
                        <span className="ml-1 text-sm">
                          {getStatusText(doc.status)}
                        </span>
                      </div>
                      {doc.status === "approved" && doc.filepath && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 border-primary/20"
                              onClick={() => handleDownload(doc.filepath)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {t("download")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("tooltip.download")}
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {doc.status === "pending" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 border-primary/20"
                            >
                              {t("view_details")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("tooltip.view_details")}
                          </TooltipContent>
                        </Tooltip>
                      )}
                      {doc.status === "rejected" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 border-primary/20"
                            >
                              <FileUp className="h-4 w-4 mr-1" />
                              {t("resubmit")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("tooltip.resubmit")}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">
                  {t("no_documents_found")}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="certificates" className="space-y-4 mt-4">
            {filteredDocuments
              .filter((doc) => doc.category === "certificate")
              .map((doc) => (
                <Card
                  key={doc.id}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">
                          {doc.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2">
                          <span>
                            {t("requested_by")}: {doc.requestedBy}
                          </span>
                          <span>
                            {t("date")}: {doc.issuedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center">
                        {getStatusIcon(doc.status)}
                        <span className="ml-1 text-sm">
                          {getStatusText(doc.status)}
                        </span>
                      </div>
                      {doc.status === "approved" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 border-primary/20"
                              onClick={() => handleDownload(doc.filepath)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {t("download")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("tooltip.download")}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="id-cards" className="space-y-4 mt-4">
            {filteredDocuments
              .filter((doc) => doc.category === "id")
              .map((doc) => (
                <Card
                  key={doc.id}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">
                          {doc.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2">
                          <span>
                            {t("requested_by")}: {doc.requestedBy}
                          </span>
                          <span>
                            {t("date")}: {doc.issuedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center">
                        {getStatusIcon(doc.status)}
                        <span className="ml-1 text-sm">
                          {getStatusText(doc.status)}
                        </span>
                      </div>
                      {doc.status === "approved" && doc.filepath && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 border-primary/20"
                              onClick={() => handleDownload(doc.filepath)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {t("download")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("tooltip.download")}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="verifications" className="space-y-4 mt-4">
            {filteredDocuments
              .filter((doc) => doc.category === "verification")
              .map((doc) => (
                <Card
                  key={doc.id}
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-primary">
                          {doc.title}
                        </h3>
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-2">
                          <span>
                            {t("requested_by")}: {doc.requestedBy}
                          </span>
                          <span>
                            {t("date")}: {doc.issuedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="flex items-center">
                        {getStatusIcon(doc.status)}
                        <span className="ml-1 text-sm">
                          {getStatusText(doc.status)}
                        </span>
                      </div>
                      {doc.status === "approved" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-shrink-0 border-primary/20"
                              onClick={() => handleDownload(doc.filepath)}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              {t("download")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {t("tooltip.download")}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>

          <TabsContent value="generate" className="space-y-4 mt-4">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>{t("generate_certificates")}</CardTitle>
                <div className="relative w-full sm:w-80">
                  <Input
                    placeholder={t("search_residents")}
                    value={residentSearch}
                    onChange={(e) => setResidentSearch(e.target.value)}
                    className="pl-10 w-full border-primary/20 focus:ring-primary"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                {filteredResidents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredResidents.map((resident, index) => (
                      <Card
                        key={`resident-${resident.id}-${index}`}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2">
                            <h3 className="font-medium text-primary">
                              {resident.first_name} {resident.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {t("id")}: {resident.resident_id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {t("kebele")}: {resident.kebele_name || "N/A"}
                            </p>
                            <select
                              className="w-full p-2 border border-primary/20 rounded mt-2"
                              defaultValue="Birth Certificate"
                            >
                              <option value="Birth Certificate">
                                Birth Certificate
                              </option>
                              <option value="Residency Certificate">
                                Residency Certificate
                              </option>
                              <option value="ID Verification Certificate">
                                ID Verification Certificate
                              </option>
                            </select>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2 border-primary/20 w-full"
                                  onClick={() => {
                                    const select = document.querySelector(
                                      `#resident-${resident.id}-${index} select`
                                    );
                                    const certificateType = select;
                                    handleGenerateCertificate(
                                      resident.id,
                                      certificateType
                                    );
                                  }}
                                  disabled={generating === resident.id}
                                >
                                  {generating === resident.id ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                  ) : (
                                    <FilePlus className="h-4 w-4 mr-1" />
                                  )}
                                  {t("generate_certificate")}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {t("tooltip.generate_certificate")}
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    {t("no_residents_found")}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default DocumentsPage;
