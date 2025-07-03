import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  ArrowLeft,
  FileText,
  Edit,
  Phone,
  Home,
  Calendar,
  Users,
  Clock,
} from "lucide-react";

const ResidentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();

  // State
  const [resident, setResident] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resident data
  useEffect(() => {
    const fetchResidentDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost/krfs-api/api/residents/getByIdResident.php?resident_id=${id}`
        );
        const result = await response.json();
        if (result.success) {
          // Resident
          setResident({
            ...result.resident,
            name: `${result.resident.first_name} ${
              result.resident.middle_name || ""
            } ${result.resident.last_name}`,
            idNumber: result.resident.national_id,
            phone: result.resident.phone_number,
            address: result.resident.house_number
              ? `${result.resident.house_number}, ${
                  result.resident.street_name || ""
                }, ${result.resident.subcity || ""}, ${
                  result.resident.city || ""
                }`
              : "",
            dateOfBirth: result.resident.date_of_birth,
            age: result.resident.date_of_birth
              ? new Date().getFullYear() -
                new Date(result.resident.date_of_birth).getFullYear()
              : "",
            maritalStatus: result.resident.marital_status,
            registrationDate: result.resident.registration_date,
            photo: result.resident.photo_path,
          });

          // Documents
          setDocuments(result.documents || []);

          // Service History
          setServiceHistory(
            (result.serviceHistory || []).map((s) => ({
              ...s,
              type: s.service_type || s.details || s.type,
              created_at: s.request_date || s.created_at,
              status: s.status,
              description: s.details || s.description,
              request_id: s.request_id,
            }))
          );

          // Family Members
          setFamilyMembers(
            (result.familyMembers || []).map((member) => ({
              name: `${member.first_name || ""} ${
                member.last_name || ""
              }`.trim(),
              relationship: member.relationship_type || "",
              membership_id: member.resident_id || "",
            }))
          );
        } else {
          throw new Error(result.error || "Failed to load resident");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };



    fetchResidentDetails();
  }, [id]);

    console.log("id"+id);
  // Form states
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [addDocumentOpen, setAddDocumentOpen] = useState(false);
  const [addServiceOpen, setAddServiceOpen] = useState(false);

  const [newMember, setNewMember] = useState({
    name: "",
    relationship: "",
    membership_id: "",
  });

  const [newDocument, setNewDocument] = useState({
    type: "",
    issue_date: "",
    expiry_date: "",
  });

  const [newService, setNewService] = useState({
    type: "",
    description: "",
  });

  // Dummy add functions (local only)
  const handleAddMember = () => {
    setFamilyMembers([...familyMembers, { ...newMember, id: Date.now() }]);
    setAddMemberOpen(false);
    setNewMember({ name: "", relationship: "", membership_id: "" });
  };

  const handleAddDocument = () => {
    setDocuments([
      ...documents,
      { ...newDocument, document_id: Date.now(), status: "active" },
    ]);
    setAddDocumentOpen(false);
    setNewDocument({ type: "", issue_date: "", expiry_date: "" });
  };

  const handleAddService = () => {
    const newRequest = {
      request_id: Date.now(),
      type: newService.type,
      created_at: new Date().toLocaleDateString(),
      status: "pending",
      description: newService.description,
    };
    setServiceHistory([...serviceHistory, newRequest]);
    setAddServiceOpen(false);
    setNewService({ type: "", description: "" });
  };

  // Loading / Error / Empty States
  if (loading) return <div className="p-6 text-center">{t("loading")}...</div>;
  if (error)
    return (
      <div className="p-6 text-red-500 text-center">
        <p>
          {t("error")}: {error}
        </p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          ← {t("back")}
        </Button>
      </div>
    );
  if (!resident)
    return (
      <div className="p-6 text-center">
        <p>{t("no_resident_found")}</p>
        <Button variant="outline" onClick={() => navigate("/residents")}>
          ← {t("go_to_list")}
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("resident_details")}
          </h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" onClick={() => window.print()}>
            <FileText className="mr-2 h-4 w-4" /> {t("print_profile")}
          </Button>
          { console.log("id"+id)}
          {id}
          <Button onClick={() => navigate(`/residents/edit/:${id}`)}>
            <Edit className="mr-2 h-4 w-4"  id={id}/> {t("edit_details")}
          </Button>
        </div>
      </div>

      {/* Main Info & Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Resident Summary */}
        <Card className="lg:col-span-1 shadow-md">
          <CardContent className="pt-6 pb-4 space-y-6">
            {/* Photo */}
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                <img
                  src={resident.photo || "/placeholder.svg"}
                  alt={resident.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {/* Name & ID */}
            <div className="text-center">
              <h3 className="text-xl font-semibold">{resident.name}</h3>
              <p className="text-sm text-muted-foreground">
                {t("id_number")}: {resident.idNumber}
              </p>
            </div>
            {/* Info List */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Phone className="h-4 w-4 text-primary" />
                <span>{resident.phone || t("not_specified")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Home className="h-4 w-4 text-primary" />
                <span>{resident.address || t("not_specified")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {resident.dateOfBirth}, {resident.age} {t("years")}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Users className="h-4 w-4 text-primary" />
                <span>{resident.maritalStatus || t("not_specified")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {t("registered_on")}:{" "}
                  {new Date(resident.registrationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Tabs Content */}
        <Card className="lg:col-span-3 shadow-md">
          <CardContent className="pt-6">
            <Tabs defaultValue="family">
              {/* Tab Navigation */}
              <TabsList className="mb-6 grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="family">{t("family_members")}</TabsTrigger>
                <TabsTrigger value="documents">
                  {t("identity_documents")}
                </TabsTrigger>
                <TabsTrigger value="services">
                  {t("service_history")}
                </TabsTrigger>
              </TabsList>

              {/* Family Members Tab */}
              <TabsContent value="family" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{t("family_members")}</h3>
                  <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <User className="mr-1 h-3 w-3" />
                        {t("add_member")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("add_new_family_member")}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="memberName">{t("name")}</Label>
                          <Input
                            id="memberName"
                            placeholder={t("name")}
                            value={newMember.name}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="relationship">
                            {t("relationship")}
                          </Label>
                          <Input
                            id="relationship"
                            placeholder={t("relationship")}
                            value={newMember.relationship}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                relationship: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="membershipId">
                            {t("membership_id")}
                          </Label>
                          <Input
                            id="membershipId"
                            placeholder={t("membership_id")}
                            value={newMember.membership_id}
                            onChange={(e) =>
                              setNewMember({
                                ...newMember,
                                membership_id: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddMember}>{t("save")}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {/* Family Members List */}
                <div className="space-y-3">
                  {familyMembers.length > 0 ? (
                    familyMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {member.relationship}, {member.membership_id}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {t("view")}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      {t("no_family_members")}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {t("identity_documents")}
                  </h3>
                  <Dialog
                    open={addDocumentOpen}
                    onOpenChange={setAddDocumentOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <FileText className="mr-1 h-3 w-3" />
                        {t("add_document")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t("add_new_document")}</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="documentType">{t("type")}</Label>
                          <Input
                            id="documentType"
                            placeholder={t("document_type")}
                            value={newDocument.type}
                            onChange={(e) =>
                              setNewDocument({
                                ...newDocument,
                                type: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="issueDate">{t("issue_date")}</Label>
                          <Input
                            id="issueDate"
                            type="date"
                            value={newDocument.issue_date}
                            onChange={(e) =>
                              setNewDocument({
                                ...newDocument,
                                issue_date: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiryDate">{t("expiry_date")}</Label>
                          <Input
                            id="expiryDate"
                            type="date"
                            value={newDocument.expiry_date}
                            onChange={(e) =>
                              setNewDocument({
                                ...newDocument,
                                expiry_date: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddDocument}>{t("save")}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {/* Document List */}
                <div className="space-y-3">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <div
                        key={doc.document_id}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("issued")}: {doc.issue_date}, {t("expires")}:{" "}
                            {doc.expiry_date || t("never")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            {t("view")}
                          </Button>
                          <Button variant="ghost" size="sm">
                            {t("renew")}
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      {t("no_documents_found")}
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Service History Tab */}
              <TabsContent value="services" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">
                    {t("service_requests")}
                  </h3>
                  <Dialog
                    open={addServiceOpen}
                    onOpenChange={setAddServiceOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Clock className="mr-1 h-3 w-3" />
                        {t("add_service")}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {t("submit_new_service_request")}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="serviceType">{t("type")}</Label>
                          <Input
                            id="serviceType"
                            placeholder={t("service_type")}
                            value={newService.type}
                            onChange={(e) =>
                              setNewService({
                                ...newService,
                                type: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">
                            {t("description")}
                          </Label>
                          <Input
                            id="description"
                            placeholder={t("enter_description")}
                            value={newService.description}
                            onChange={(e) =>
                              setNewService({
                                ...newService,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddService}>
                          {t("submit")}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                {/* Service Request List */}
                <div className="space-y-3">
                  {serviceHistory.length > 0 ? (
                    serviceHistory.map((service) => (
                      <div
                        key={service.request_id}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div>
                          <p className="font-medium">{service.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("date")}: {service.created_at}, {t("status")}:{" "}
                            <span
                              className={`${
                                service.status === "completed"
                                  ? "text-green-600"
                                  : "text-yellow-600"
                              }`}
                            >
                              {service.status}
                            </span>
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          {t("details")}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-sm text-muted-foreground">
                      {t("no_service_requests")}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResidentDetailPage;
