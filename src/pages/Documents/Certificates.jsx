import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useAuth } from "@/context/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Certificates = () => {
  const { user } = useAuth();
  let { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [residentSearch, setResidentSearch] = useState("");
  const [documents, setDocuments] = useState([]);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(null);



  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost/krfs-api/api/documents/read.php`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`HTTP ${res.status}: Failed to fetch documents`);
        return res.json();
      })
    
      .then((data) => {
        console.log("user ID from nw:", user);
        setDocuments(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching documents:", error);
        setError(error.message || "Failed to fetch documents");
        setDocuments([]);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost/krfs-api/api/residents/read.php`)
      .then((res) => {
        if (!res.ok)
          throw new Error(`HTTP ${res.status}: Failed to fetch residents`);
        return res.json();
      })
      .then((data) => {
        const validResidents = Array.isArray(data)
          ? data
              .map((resident) => ({
                ...resident,
                id: Number(resident.resident_id) || null,
                resident_id: resident.resident_id.toString(),
              }))
              .filter((resident) => resident && resident.id != null)
          : [];
        setResidents(validResidents);
      })
      .catch((error) => {
        console.error("Error fetching residents:", error);
        setError(error.message || "Failed to fetch residents");
      });
  }, []);

  const handleGenerateCertificate = async (residentId, certificateType) => {
    if (!residentId || isNaN(residentId)) {
      setError("Invalid resident ID");
      return;
    }

    const resident = residents.find((r) => r.id === Number(residentId));
    if (!resident) {
      setError("Resident not found");
      return;
    }

    if (!window.confirm("Generate certificate?")) return;

    setGenerating(residentId);
    setError(null);

  console.log("user ID from nw kkkkkk:", user);

    try {
      const response = await fetch(
        `http://localhost/krfs-api/api/documents/generate_certificate.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resident_id: resident.resident_id,
            certificate_type: certificateType,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `HTTP ${response.status}: Failed to generate certificate`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateType.replace(/\s+/g, "_")}_${
        resident.resident_id
      }.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDocuments((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: `${certificateType} for ${resident.first_name} ${resident.last_name}`,
          category: certificateType.toLowerCase().replace(/\s+/g, "_"),
          filepath: `/certificates/${certificateType.replace(/\s+/g, "_")}_${
            resident.resident_id
          }.pdf`,
          status: "approved",
          issuedDate: new Date().toISOString().split("T")[0],
          requestedBy: `${resident.first_name} ${resident.last_name}`,
        },
      ]);

      alert("Certificate generated and saved successfully");
    } catch (error) {
      console.error("Error generating certificate:", error);
      setError(error.message || "Failed to generate certificate");
    } finally {
      setGenerating(null);
    }
  };

  const handleDownload = (filePath) => {
    const downloadUrl = `http://localhost/krfs-api${filePath}`;
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
        <span className="ml-2 text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error && !documents.length && !residents.length) {
    return (
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error}
          <Button
            variant="link"
            className="mt-2"
            onClick={() => window.location.reload()}
          >
            Retry
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
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">
            Documents
          </h2>
          <p className="text-muted-foreground mt-1">
            Manage and generate certificates
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="relative w-full sm:w-80">
            <Input
              placeholder="Search documents"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full border-primary/20 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-primary/20"
                  onClick={() => navigate(`/documents/request`)}
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  Request Certificate
                </Button>
              </TooltipTrigger>
              <TooltipContent>Request a new certificate</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full bg-primary/10">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="id-cards">ID Cards</TabsTrigger>
            <TabsTrigger value="verifications">Verifications</TabsTrigger>
            <TabsTrigger value="generate">Generate</TabsTrigger>
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
                          <span>Requested by: {doc.requestedBy}</span>
                          <span>Date: {doc.issuedDate}</span>
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
                              Download
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download document</TooltipContent>
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
                              View Details
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View document details</TooltipContent>
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
                              <FileText className="h-4 w-4 mr-1" />
                              Resubmit
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Resubmit document</TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No documents found</p>
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
                          <span>Requested by: {doc.requestedBy}</span>
                          <span>Date: {doc.issuedDate}</span>
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
                              Download
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download certificate</TooltipContent>
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
                          <span>Requested by: {doc.requestedBy}</span>
                          <span>Date: {doc.issuedDate}</span>
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
                              Download
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download ID card</TooltipContent>
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
                          <span>Requested by: {doc.requestedBy}</span>
                          <span>Date: {doc.issuedDate}</span>
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
                              Download
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download verification</TooltipContent>
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
                <CardTitle>Generate Certificates</CardTitle>
                <div className="relative w-full sm:w-80">
                  <Input
                    placeholder="Search residents"
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
                        id={`resident-${resident.id}-${index}`}
                        className="shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-2">
                            <h3 className="font-medium text-primary">
                              {resident.first_name} {resident.last_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              ID: {resident.resident_id}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Kebele: {resident.kebele_name || "N/A"}
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
                                    if (!select) {
                                      console.error(
                                        `Select element not found for resident-${resident.id}-${index}`
                                      );
                                      setError("Select element not found");
                                      return;
                                    }
                                    const certificateType = select.value;
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
                                  Generate Certificate
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                Generate certificate for resident
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center">
                    No residents found
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

export default Certificates;
