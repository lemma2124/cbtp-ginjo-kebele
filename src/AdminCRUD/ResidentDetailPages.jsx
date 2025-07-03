import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
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
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  Edit,
  Phone,
  Home,
  Calendar,
  Users,
  Clock,
  UserPlus,
  FilePlus,
  PlusCircle,
  Trash2,
} from "lucide-react";
import apiClient from "../service/api";
import { useToast } from "@/hooks/use-toast";

const ResidentDetailPages = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { token } = useAuth();
  const { toast } = useToast();

  // State
  const [resident, setResident] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fetch resident data
  useEffect(() => {
    const fetchResidentDetails = async () => {
      try {
        const mockResident = {
          resident_id: id,
          first_name: "Abdi",
          middle_name: "Kedir",
          last_name: "Tolera",
          national_id: "NID-1001",
          phone_number: "0912345678",
          house_number: "1234",
          street_name: "Main Street",
          subcity: "Djebel",
          city: "Jimma",
          date_of_birth: "1985-05-15",
          marital_status: "Married",
          registration_date: "2020-01-15",
          photo_path: "",
          gender: "Male",
          family_name: "Tolera Family",
          kebele_name: "Kebele 01",
          woreda_name: "Jimma Town",
          is_active: true,
        };

        setResident({
          ...mockResident,
          name: `${mockResident.first_name} ${mockResident.middle_name || ""} ${
            mockResident.last_name
          }`,
          idNumber: mockResident.national_id,
          phone: mockResident.phone_number,
          address: mockResident.house_number
            ? `${mockResident.house_number}, ${
                mockResident.street_name || ""
              }, ${mockResident.subcity || ""}, ${mockResident.city || ""}`
            : "",
          dateOfBirth: mockResident.date_of_birth,
          age: mockResident.date_of_birth
            ? new Date().getFullYear() -
              new Date(mockResident.date_of_birth).getFullYear()
            : "",
          maritalStatus: mockResident.marital_status,
          registrationDate: mockResident.registration_date,
          photo: mockResident.photo_path,
        });

        setDocuments([
          {
            document_id: 1,
            type: "National ID",
            issue_date: "2010-05-20",
            expiry_date: "2030-05-20",
            status: "active",
          },
          {
            document_id: 2,
            type: "Driver's License",
            issue_date: "2018-03-12",
            expiry_date: "2028-03-12",
            status: "active",
          },
        ]);

        setServiceHistory([
          {
            request_id: 1,
            type: "Water Connection",
            created_at: "2023-01-10",
            status: "completed",
            description: "New water line installation",
          },
          {
            request_id: 2,
            type: "Electricity Meter",
            created_at: "2023-03-15",
            status: "in progress",
            description: "Meter replacement",
          },
          {
            request_id: 3,
            type: "Garbage Collection",
            created_at: "2023-04-22",
            status: "pending",
            description: "Regular schedule request",
          },
        ]);

        setFamilyMembers([
          {
            name: "Alem Tolera",
            relationship: "Spouse",
            membership_id: "NID-1002",
          },
          {
            name: "Bereket Abdi",
            relationship: "Child",
            membership_id: "NID-1003",
          },
          {
            name: "Selam Abdi",
            relationship: "Child",
            membership_id: "NID-1004",
          },
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResidentDetails();
  }, [id]);

  // Delete resident
  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiClient.delete(
        `http://localhost/krfs-api/api/admin/delete.php?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: t("success"),
        description: t("resident_deleted_successfully"),
        status: "success",
      });
      navigate("/residents");
    } catch (err) {
      toast({
        title: t("error"),
        description: t("failed_to_delete_resident"),
        status: "error",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  // Add functions
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

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">
            {t("resident_details")}
          </h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" onClick={() => window.print()}>
            <FileText className="mr-2 h-4 w-4" /> {t("print_profile")}
          </Button>
          <Button onClick={() => navigate(`/residents/edit/${id}`)}>
            <Edit className="mr-2 h-4 w-4" /> {t("edit_details")}
          </Button>
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> {t("delete_resident")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("confirm_deletion")}</DialogTitle>
              </DialogHeader>
              <p>{t("are_you_sure_delete_resident")}</p>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? t("deleting") : t("delete")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Info & Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side - Resident Summary */}
        <Card className="lg:col-span-1 shadow-md">
          <CardContent className="pt-6 pb-4 space-y-6">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-muted flex items-center justify-center border-4 border-white shadow-lg">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-400">
                  <Users className="h-16 w-16" />
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">{resident.name}</h3>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                <Badge variant={resident.is_active ? "success" : "destructive"}>
                  {resident.is_active ? t("active") : t("inactive")}
                </Badge>
                <Badge variant="secondary">
                  {t("family")}: {resident.family_name}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {t("national_id")}: {resident.idNumber}
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Phone className="h-4 w-4 text-primary" />
                <span>{resident.phone || t("not_specified")}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Home className="h-4 w-4 text-primary" />
                <span>{resident.address}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {formatDate(resident.dateOfBirth)}, {resident.age}{" "}
                  {t("years")}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Users className="h-4 w-4 text-primary" />
                <span>{resident.maritalStatus}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                <Clock className="h-4 w-4 text-primary" />
                <span>
                  {t("registered_on")}: {formatDate(resident.registrationDate)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Side - Tabs Content */}
        <Card className="lg:col-span-3 shadow-md">
          <CardContent className="pt-6">
            <Tabs defaultValue="family">
              <TabsList className="mb-6 grid w-full grid-cols-3">
                <TabsTrigger value="family">{t("family_members")}</TabsTrigger>
                <TabsTrigger value="documents">
                  {t("identity_documents")}
                </TabsTrigger>
                <TabsTrigger value="services">
                  {t("service_history")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="family" className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">{t("family_members")}</h3>
                  <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <UserPlus className="mr-1 h-4 w-4" />
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
                <div className="space-y-3">
                  {familyMembers.length > 0 ? (
                    familyMembers.map((member, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("relationship")}: {member.relationship},{" "}
                            {t("membership_id")}: {member.membership_id}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log("View member", member)}
                        >
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
                      <Button size="sm">
                        <FilePlus className="mr-1 h-4 w-4" />
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
                <div className="space-y-3">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <div
                        key={doc.document_id}
                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{doc.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("issued")}: {formatDate(doc.issue_date)},{" "}
                            {t("expires")}:{" "}
                            {doc.expiry_date
                              ? formatDate(doc.expiry_date)
                              : t("never")}
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
                      <Button size="sm">
                        <PlusCircle className="mr-1 h-4 w-4" />
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
                <div className="space-y-3">
                  {serviceHistory.length > 0 ? (
                    serviceHistory.map((service) => (
                      <div
                        key={service.request_id}
                        className="flex justify-between items-center p-4 border rounded-lg hover:bg-muted/30 transition-colors"
                      >
                        <div>
                          <p className="font-medium">{service.type}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("date")}: {formatDate(service.created_at)}
                          </p>
                          <p className="text-sm mt-1">
                            {t("status")}:{" "}
                            <Badge
                              variant={
                                service.status === "completed"
                                  ? "success"
                                  : service.status === "in progress"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {service.status}
                            </Badge>
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <Button variant="ghost" size="sm">
                            {t("details")}
                          </Button>
                          <p className="text-xs text-muted-foreground mt-1 max-w-xs text-right">
                            {service.description}
                          </p>
                        </div>
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

export default ResidentDetailPages;
