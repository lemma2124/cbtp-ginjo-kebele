import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import apiClient from "../service/api";

// Get API base URL from environment variables
const API_BASE_URL = "http://localhost/krfs-api";

const ResidentCard = ({ resident, onClick, onStatusChange }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { token } = useAuth();

  const fullName = `${resident.first_name}${
    resident.middle_name ? ` ${resident.middle_name}` : ""
  } ${resident.last_name}`;

  const address = [
    resident.house_number,
    resident.street_name,
    resident.subcity,
    resident.city,
  ]
    .filter(Boolean)
    .join(", ");

  const handleStatusChange = async () => {
    try {
      const response = await apiClient.post(
        "/admin/active.php",
        { resident_id: resident.resident_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Status update failed");
      }

      // Update status locally to avoid full refresh
      const newStatus = !resident.is_active;
      onStatusChange(resident.resident_id, newStatus);

      toast({
        title: t("success"),
        description: t(
          `resident_status_updated_${newStatus ? "active" : "inactive"}`
        ),
        status: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: t("error"),
        description: t("status_update_success"),
        status: "error",
      });
    }
  };

  // Get image URL safely
  const getImageUrl = () => {
    if (!resident.photo_path) return null;
    if (resident.photo_path.startsWith("http")) return resident.photo_path;
    return `${API_BASE_URL}/${resident.photo_path.replace(/^\//, "")}`;
  };

  const imageUrl = getImageUrl();

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border rounded-lg overflow-hidden group">
      <div className="bg-gradient-to-b from-primary/10 to-transparent h-24 flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            className="h-16 w-16 rounded-full object-cover border-2 border-white"
            alt={fullName}
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
            {resident.first_name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <CardContent className="p-5 space-y-4">
        <h3 className="font-semibold text-lg truncate">{fullName}</h3>

        <div className="flex flex-wrap gap-2">
          <Badge variant={resident.is_active ? "success" : "destructive"}>
            {resident.is_active ? t("active") : t("inactive")}
          </Badge>
          <Badge variant="outline">{resident.gender}</Badge>
          {resident.family_name && (
            <Badge variant="secondary">
              {t("family")}: {resident.family_name}
            </Badge>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <p className="truncate">
            <span className="text-muted-foreground">{t("national_id")}: </span>
            {resident.national_id}
          </p>
          <p className="truncate">
            <span className="text-muted-foreground">{t("kebele")}: </span>
            {resident.kebele_name} ({resident.woreda_name})
          </p>
          <p className="truncate">
            <span className="text-muted-foreground">{t("address")}: </span>
            {address}
          </p>
        </div>

        <div className="flex gap-2 mt-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/residentsall/${resident.resident_id}`)}
          >
            {t("view_full_record")}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/residents/edit/${resident.resident_id}`)}
          >
            {t("edit")}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={handleStatusChange}
            variant={resident.is_active ? "destructive" : "default"}
          >
            {resident.is_active ? t("deactivate") : t("activate")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const SortableHeader = ({ label, sortKey, sortConfig, onSort }) => {
  const direction =
    sortConfig.key === sortKey
      ? sortConfig.direction === "asc"
        ? "↑"
        : "↓"
      : "";
  return (
    <button
      type="button"
      className="flex items-center gap-1 font-medium hover:underline"
      onClick={() => onSort(sortKey)}
    >
      {label} {direction}
    </button>
  );
};

const ResidentTable = ({ residents, sortConfig, onSort, onStatusChange }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const columns = [
    { key: "first_name", label: t("name") },
    { key: "gender", label: t("gender") },
    { key: "national_id", label: t("national_id") },
    { key: "kebele_name", label: t("kebele") },
    { key: "occupation", label: t("occupation") },
    { key: "education_level", label: t("education") },
    { key: "is_active", label: t("status") },
    { key: "actions", label: t("actions") },
  ];

  // Enhanced sorting function that handles booleans
  const getSortableValue = (value, key) => {
    if (key === "is_active") return value ? 1 : 0;
    return value;
  };

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 text-left">
                {col.key !== "actions" ? (
                  <SortableHeader
                    label={col.label}
                    sortKey={col.key}
                    sortConfig={sortConfig}
                    onSort={onSort}
                  />
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {residents.map((resident) => {
            const fullName = `${resident.first_name}${
              resident.middle_name ? ` ${resident.middle_name}` : ""
            } ${resident.last_name}`;

            return (
              <tr key={resident.resident_id} className="hover:bg-muted/30">
                <td className="px-4 py-3 whitespace-nowrap">{fullName}</td>
                <td className="px-4 py-3">{resident.gender}</td>
                <td className="px-4 py-3">{resident.national_id}</td>
                <td className="px-4 py-3">{resident.kebele_name}</td>
                <td className="px-4 py-3">{resident.occupation}</td>
                <td className="px-4 py-3">{resident.education_level}</td>

                <td className="px-4 py-3">
                  <Badge
                    variant={resident.is_active ? "success" : "destructive"}
                  >
                    {resident.is_active ? t("active") : t("inactive")}
                  </Badge>
                </td>
                <td className="px-4 py-3 space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      navigate(`/residents/${resident.resident_id}`)
                    }
                  >
                    {t("view")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() =>
                      navigate(`/residents/edit/${resident.resident_id}`)
                    }
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant={resident.is_active ? "destructive" : "default"}
                    onClick={() =>
                      onStatusChange(resident.resident_id, !resident.is_active)
                    }
                  >
                    {resident.is_active ? t("deactivate") : t("activate")}
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const ResidentsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated, token } = useAuth();
  const { toast } = useToast();

  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTableView, setIsTableView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [filters, setFilters] = useState({
    gender: "",
    maritalStatus: "",
    isActive: "",
    kebele: "",
    education: "",
    occupation: "",
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchResidents = async () => {
      try {
        const response = await apiClient.get("/admin/read.php", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const transformed = response.data.map((res) => ({
          ...res,
          is_active: Boolean(res.is_active),
          date_of_birth: new Date(res.date_of_birth).toLocaleDateString(),
        }));

        setResidents(transformed);
      } catch (err) {
        setError(t("failed_load_residents"));
        toast({
          title: t("error"),
          description: t("failed_load_residents"),
          status: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, [isAuthenticated, token, toast, t]);

  // Update resident status locally
  const updateResidentStatus = useCallback((residentId, isActive) => {
    setResidents((prev) =>
      prev.map((res) =>
        res.resident_id === residentId ? { ...res, is_active: isActive } : res
      )
    );
  }, []);

  // Filter and sort residents
  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      const matchesSearch = [
        resident.first_name,
        resident.last_name,
        resident.middle_name,
        resident.national_id,
        resident.kebele_name,
      ].some((val) => val?.toLowerCase().includes(searchQuery.toLowerCase()));

      return (
        matchesSearch &&
        (!filters.gender || resident.gender === filters.gender) &&
        (!filters.maritalStatus ||
          resident.marital_status === filters.maritalStatus) &&
        (filters.isActive === "" ||
          resident.is_active === (filters.isActive === "active")) &&
        (!filters.kebele || resident.kebele_name === filters.kebele) &&
        (!filters.education ||
          resident.education_level === filters.education) &&
        (!filters.occupation || resident.occupation === filters.occupation)
      );
    });
  }, [residents, searchQuery, filters]);

  const sortedResidents = useMemo(() => {
    const sortableItems = [...filteredResidents];
    if (!sortConfig.key) return sortableItems;

    return sortableItems.sort((a, b) => {
      // Handle different data types
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Special handling for status
      if (sortConfig.key === "is_active") {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }

      // Handle string comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Numeric/boolean comparison
      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredResidents, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value === "all" ? "" : value,
    }));
  }, []);

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    return {
      gender: Array.from(new Set(residents.map((r) => r.gender))).filter(
        Boolean
      ),
      maritalStatus: Array.from(
        new Set(residents.map((r) => r.marital_status))
      ).filter(Boolean),
      kebele: Array.from(new Set(residents.map((r) => r.kebele_name))).filter(
        Boolean
      ),
      education: Array.from(
        new Set(residents.map((r) => r.education_level))
      ).filter(Boolean),
      occupation: Array.from(
        new Set(residents.map((r) => r.occupation))
      ).filter(Boolean),
    };
  }, [residents]);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{t("residents")}</h1>
          <p className="text-muted-foreground">{t("manage_residents")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder={t("search_residents")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-72"
          />
          <Button onClick={() => navigate("/residents/new")}>
            + {t("add_resident")}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsTableView(!isTableView)}
          >
            {isTableView ? t("card_view") : t("table_view")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Filter Components */}
        {[
          { key: "gender", label: t("gender"), options: filterOptions.gender },
          {
            key: "maritalStatus",
            label: t("maritalStatus"),
            options: filterOptions.maritalStatus,
          },
          {
            key: "isActive",
            label: t("status"),
            options: [
              { value: "active", label: t("active") },
              { value: "inactive", label: t("inactive") },
            ],
          },
          { key: "kebele", label: t("kebele"), options: filterOptions.kebele },
          {
            key: "education",
            label: t("education"),
            options: filterOptions.education,
          },
          {
            key: "occupation",
            label: t("occupation"),
            options: filterOptions.occupation,
          },
        ].map((filter) => (
          <div key={filter.key} className="space-y-2">
            <Label>{filter.label}</Label>
            <Select
              onValueChange={(value) => handleFilterChange(filter.key, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t(`select_${filter.key}`)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {filter.options.map((option) => {
                  const value =
                    typeof option === "object" ? option.value : option;
                  const label =
                    typeof option === "object" ? option.label : option;
                  return (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : error ? (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : sortedResidents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            {t("no_residents_found")}
          </p>
          <Button onClick={() => navigate("/residents/new")}>
            {t("add_first_resident")}
          </Button>
        </div>
      ) : isTableView ? (
        <ResidentTable
          residents={sortedResidents}
          sortConfig={sortConfig}
          onSort={handleSort}
          onStatusChange={updateResidentStatus}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResidents.map((resident) => (
            <ResidentCard
              key={resident.resident_id}
              resident={resident}
              onClick={() => navigate(`/residents/${resident.resident_id}`)}
              onStatusChange={updateResidentStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResidentsPage;
