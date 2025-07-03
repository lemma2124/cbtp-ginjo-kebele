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
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import apiClient from "../../service/api";
const ResidentCard = ({ resident, onClick }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

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

  return (
    <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border rounded-lg overflow-hidden group">
      <div className="bg-gradient-to-b from-primary/10 to-transparent h-24 flex items-center justify-center">
        {console.log(
          `http://localhost/krfs-api/uploads/photos/ ==` + resident.photo_path
        )}{" "}
        {console.log(
          `http://localhost/krfs-api/uploads/http://localhost/krfs-api/uploads/photos/photo_683658eb4ea586.33538599.jpg/ ==`
        )}
        {resident.photo_path ? (
          <img
            src={`http://localhost/krfs-api/${resident.photo_path}`}
            onLoad={() => console.log("Image loaded successfully")}
            onError={() => console.log("Image failed to load")}
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
            <span className="text-muted-foreground">{t("national_id")}:</span>
            {resident.national_id}
          </p>
          <p className="truncate">
            <span className="text-muted-foreground">{t("kebele")}:</span>
            {resident.kebele_name} ({resident.woreda_name})
          </p>
          <p className="truncate">
            <span className="text-muted-foreground">{t("address")}:</span>
            {address}
          </p>
        </div>

        <div className="flex gap-2 mt-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => navigate(`/residents/${resident.resident_id}`)}
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

const ResidentTable = ({ residents, sortConfig, onSort }) => {
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
                    <button
                      className={
                        resident.is_active
                          ? "bg-green-500" // Change this to your desired active color
                          : "bg-red-500" // Change this to your desired inactive color
                      }
                    >
                      {resident.is_active ? t("active") : t("inactive")}
                    </button>
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
  const { isAuthenticated } = useAuth();

  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState({
    gender: "",
    maritalStatus: "",
    isActive: "",
    kebele: "",
    education: "",
    occupation: "",
  });
  const [isTableView, setIsTableView] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        const response = await apiClient.get("/residents/readAdmin.php");
        const transformed = response.data.map((res) => ({
          ...res,
          is_active: Boolean(res.is_active),
          date_of_birth: new Date(res.date_of_birth).toLocaleDateString(),
        }));
        setResidents(transformed);
      } catch (err) {
        setError("Failed to load residents.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, []);

  const filteredResidents = useMemo(
    () =>
      residents.filter((resident) => {
        const searchMatches = [
          resident.first_name,
          resident.last_name,
          resident.national_id,
        ].some((val) => val?.toLowerCase().includes(searchQuery.toLowerCase()));

        return (
          searchMatches &&
          (!filters.gender || resident.gender === filters.gender) &&
          (!filters.maritalStatus ||
            resident.marital_status === filters.maritalStatus) &&
          (!filters.isActive ||
            resident.is_active === (filters.isActive === "active")) &&
          (!filters.kebele || resident.kebele_name === filters.kebele) &&
          (!filters.education ||
            resident.education_level === filters.education) &&
          (!filters.occupation || resident.occupation === filters.occupation)
        );
      }),
    [residents, searchQuery, filters]
  );

  const sortedResidents = useMemo(() => {
    const sorted = [...filteredResidents];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sorted;
  }, [filteredResidents, sortConfig]);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value === "all" ? "" : value,
    }));
  }, []);

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
          "gender",
          "maritalStatus",
          "isActive",
          "kebele",
          "education",
          "occupation",
        ].map((filterKey) => (
          <div key={filterKey} className="space-y-2">
            <Label>{t(filterKey)}</Label>
            <Select
              onValueChange={(value) => handleFilterChange(filterKey, value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t(`select_${filterKey}`)} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("all")}</SelectItem>
                {[
                  ...new Set(
                    residents.map(
                      (r) =>
                        r[filterKey === "kebele" ? "kebele_name" : filterKey]
                    )
                  ),
                ]
                  .filter((val) => val)
                  .map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
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
          onSort={(key) =>
            setSortConfig((prev) => ({
              key,
              direction:
                prev.key === key && prev.direction === "asc" ? "desc" : "asc",
            }))
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedResidents.map((resident) => (
            <ResidentCard
              key={resident.resident_id}
              resident={resident}
              onClick={() => navigate(`/residents/${resident.resident_id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResidentsPage;
