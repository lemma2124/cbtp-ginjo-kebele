import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Search,
  Download,
  CheckCircle,
  Clock,
  XCircle,
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

const Certificates = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [residentSearch, setResidentSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState({});

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost/krfs-api/api/certificates/read.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch documents`);
        }
        const data = await response.json();
        setDocuments(Array.isArray(data) ? data : []);
      } catch (error) {
        setError(error.message || "Failed to fetch documents");
      } finally {
        setLoading(false);
      }
    };

    const fetchResidents = async () => {
      try {
        const response = await fetch(
          "http://localhost/krfs-api/api/residents/read.php"
        );
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch residents`);
        }
        const data = await response.json();
        const validResidents = Array.isArray(data)
          ? data
              .map((resident) => ({
                ...resident,
                id: resident.resident_id,
                resident_id: resident.resident_id.toString(),
              }))
              .filter((resident) => resident.id)
          : [];
        setResidents(validResidents);
      } catch (error) {
        setError(error.message || "Failed to fetch residents");
      }
    };

    fetchDocuments();
    fetchResidents();
  }, []);

  const handleGenerateCertificate = async (residentId, certificateType) => {
    const resident = residents.find((r) => r.id === residentId);
    if (!resident) {
      setError("Resident not found");
      return;
    }

    if (
      !window.confirm(
        `Generate ${certificateType} for ${resident.first_name} ${resident.last_name}?`
      )
    ) {
      return;
    }

    setGenerating(residentId);
    setError(null);

    try {
      const response = await fetch(
        "http://localhost/krfs-api/api/documents/generate_certificate.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resident_id: resident.id,
            certificate_type: certificateType,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate certificate");
      }

      // Create download link
      const link = document.createElement("a");
      link.href = data.download_url;
      link.download = `${certificateType.replace(/\s+/g, "_")}_${
        resident.id
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update UI with new document
      setDocuments((prev) => [
        ...prev,
        {
          id: data.certificate_id,
          title: `${certificateType} for ${resident.first_name} ${resident.last_name}`,
          category: "certificate",
          file_path: data.file_path,
          status: "approved",
          issue_date: new Date().toISOString().split("T")[0],
          resident_name: `${resident.first_name} ${resident.last_name}`,
        },
      ]);
    } catch (error) {
      setError(error.message || "Failed to generate certificate");
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
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "approved":
        return <span className="text-green-500">Approved</span>;
      case "pending":
        return <span className="text-yellow-500">Pending</span>;
      case "rejected":
        return <span className="text-red-500">Rejected</span>;
      default:
        return null;
    }
  };

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.resident_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.certificate_type?.toLowerCase().includes(searchQuery.toLowerCase())
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
        <span className="ml-2 text-muted-foreground">
          Loading certificates...
        </span>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 space-y-6">
        {error && (
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Certificate Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Generate and manage official certificates
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border-primary/20 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full bg-primary/10">
            <TabsTrigger value="all">All Certificates</TabsTrigger>
            <TabsTrigger value="issued">Recently Issued</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="generate">Generate New</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc) => (
                  <Card
                    key={doc.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <div className="flex items-center">
                          {getStatusIcon(doc.status)}
                          <span className="ml-2 text-sm">
                            {getStatusText(doc.status)}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm">
                          <span className="font-medium">Resident:</span>{" "}
                          {doc.resident_name}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Issued:</span>{" "}
                          {doc.issue_date}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Certificate ID:</span>{" "}
                          {doc.certificate_number}
                        </p>

                        {doc.status === "approved" && doc.file_path && (
                          <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => handleDownload(doc.file_path)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download Certificate
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    No certificates found
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by generating a new certificate
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate New Certificate</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select a resident and certificate type to generate
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative">
                    <Input
                      placeholder="Search residents..."
                      value={residentSearch}
                      onChange={(e) => setResidentSearch(e.target.value)}
                      className="pl-10 w-full"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {filteredResidents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredResidents.map((resident) => (
                      <Card
                        key={resident.id}
                        className="relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-70"></div>
                        <CardContent className="relative z-10 p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                            <div>
                              <h3 className="text-lg font-semibold">
                                {resident.first_name} {resident.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                ID: {resident.resident_id}
                              </p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4">
                            <p className="text-sm">
                              <span className="font-medium">Address:</span>{" "}
                              {resident.house_number} {resident.street_name}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Kebele:</span>{" "}
                              {resident.kebele_name || "N/A"}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Phone:</span>{" "}
                              {resident.phone_number || "N/A"}
                            </p>
                          </div>

                          <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">
                              Certificate Type
                            </label>
                            <select
                              className="w-full p-2 border rounded-md bg-white"
                              value={
                                selectedTypes[resident.id] ||
                                "Residency Certificate"
                              }
                              onChange={(e) =>
                                setSelectedTypes((prev) => ({
                                  ...prev,
                                  [resident.id]: e.target.value,
                                }))
                              }
                            >
                              {/* <option>Residency Certificate</option> */}
                              <option>Birth Certificate</option>
                              <option>Marriage Certificate</option>
                              <option>Family Certificate</option>
                            </select>
                          </div>

                          <Button
                            className="w-full"
                            onClick={() =>
                              handleGenerateCertificate(
                                resident.id,
                                selectedTypes[resident.id] ||
                                  "Residency Certificate"
                              )
                            }
                            disabled={generating === resident.id}
                          >
                            {generating === resident.id ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FilePlus className="mr-2 h-4 w-4" />
                                Generate Certificate
                              </>
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No residents found
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try changing your search criteria
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default Certificates;
