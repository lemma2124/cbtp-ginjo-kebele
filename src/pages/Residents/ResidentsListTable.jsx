import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
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

// Sortable Header Component
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
      className="flex items-center gap-1 font-medium text-left hover:underline focus:outline-none"
      onClick={() => onSort(sortKey)}
    >
      {label} <span className="font-large">{direction}</span>
    </button>
  );
};

// ResidentTable Component
const ResidentTable = ({ residents, onView, onEdit, sortConfig, onSort }) => {
  const { t } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left">
              <SortableHeader
                label={t("name")}
                sortKey="name"
                sortConfig={sortConfig}
                onSort={onSort}
              />
            </th>
            <th className="px-4 py-3 text-left">
              <SortableHeader
                label={t("gender")}
                sortKey="gender"
                sortConfig={sortConfig}
                onSort={onSort}
              />
            </th>
            <th className="px-4 py-3 text-left">
              <SortableHeader
                label={t("marital_status")}
                sortKey="maritalStatus"
                sortConfig={sortConfig}
                onSort={onSort}
              />
            </th>
            <th className="px-4 py-3 text-left">
              <SortableHeader
                label={t("id_number")}
                sortKey="idNumber"
                sortConfig={sortConfig}
                onSort={onSort}
              />
            </th>
            <th className="px-4 py-3 text-left">
              <SortableHeader
                label={t("status")}
                sortKey="is_active"
                sortConfig={sortConfig}
                onSort={onSort}
              />
            </th>
            <th className="px-4 py-3 text-right">{t("actions")}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {residents.map((resident) => (
            <tr
              key={resident.id}
              className="hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap">{resident.name}</td>
              <td className="px-4 py-3 whitespace-nowrap">{resident.gender}</td>
              <td className="px-4 py-3 whitespace-nowrap">
                {resident.maritalStatus}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                {resident.idNumber}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <Badge variant={resident.is_active ? "success" : "destructive"}>
                  {resident.is_active ? t("active") : t("inactive")}
                </Badge>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onView(resident)}
                >
                  {t("view")}
                </Button>
                <Button size="sm" onClick={() => onEdit(resident)}>
                  {t("edit")}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main ResidentsPage Component
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
  });

  // Sorting State
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch data
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchResidents = async () => {
      try {
        const response = await fetch(
          "http://localhost/krfs-api/api/residents/get_all.php",
          { credentials: "include" }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        if (data.success) {
          setResidents(data.residents || []);
        } else {
          throw new Error(data.error || "Failed to load residents");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResidents();
  }, [isAuthenticated]);

  // Filter logic
  const filteredResidents = useMemo(() => {
    return residents.filter((resident) => {
      const matchesSearch = [resident.name, resident.idNumber].some((value) =>
        value?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const matchesGender =
        !filters.gender || resident.gender === filters.gender;
      const matchesMaritalStatus =
        !filters.maritalStatus ||
        resident.maritalStatus === filters.maritalStatus;
      const matchesActive =
        !filters.isActive ||
        (filters.isActive === "active"
          ? resident.is_active
          : !resident.is_active);

      return (
        matchesSearch && matchesGender && matchesMaritalStatus && matchesActive
      );
    });
  }, [residents, searchQuery, filters]);

  // Tab filtering
  const tabFilteredResidents = useMemo(() => {
    if (activeTab === "all") return filteredResidents;
    return filteredResidents.filter((resident) =>
      activeTab === "active" ? resident.is_active : !resident.is_active
    );
  }, [filteredResidents, activeTab]);

  // Sorted list
  const sortedFilteredResidents = useMemo(() => {
    let result = [...tabFilteredResidents];

    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [tabFilteredResidents, sortConfig]);

  const handleFilterChange = useCallback((filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value === "all" ? "" : value,
    }));
  }, []);

  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(Boolean).length;
  }, [filters]);

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">{t("residents")}</h1>
          <p className="text-muted-foreground">
            {t("manage_and_view_all_residents")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="md:w-72"
          />
          <Button
            onClick={() => navigate("/residents/new")}
            className="whitespace-nowrap flex-shrink-0"
          >
            + {t("addResident")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>{t("gender")}</Label>
          <Select onValueChange={(v) => handleFilterChange("gender", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("select_gender")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="male">{t("male")}</SelectItem>
              <SelectItem value="female">{t("female")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("marital_status")}</Label>
          <Select onValueChange={(v) => handleFilterChange("maritalStatus", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("select_marital_status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="single">{t("single")}</SelectItem>
              <SelectItem value="married">{t("married")}</SelectItem>
              <SelectItem value="divorced">{t("divorced")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>{t("active_status")}</Label>
          <Select onValueChange={(v) => handleFilterChange("isActive", v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("select_active_status")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="inactive">{t("inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(filters).map(([key, val]) =>
            val && val !== "all" ? (
              <Badge key={key} variant="outline" className="px-2 py-1 text-sm">
                {t(key)}: {t(val)}
              </Badge>
            ) : null
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setFilters({ gender: "", maritalStatus: "", isActive: "" })
            }
          >
            {t("clear_filters")}
          </Button>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="active">{t("active")}</TabsTrigger>
          <TabsTrigger value="inactive">{t("inactive")}</TabsTrigger>
        </TabsList>

        {loading ? (
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-8 w-full mb-3" />
              <Skeleton className="h-8 w-full mb-3" />
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : sortedFilteredResidents.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">{t("no_residents_found")}</p>
            <Button onClick={() => navigate("/residents/new")}>
              {t("add_new_resident")}
            </Button>
          </div>
        ) : (
          <TabsContent value={activeTab}>
            <Card>
              <CardHeader>
                <CardTitle>{t("residents_list")}</CardTitle>
              </CardHeader>
              <CardContent>
                <ResidentTable
                  residents={sortedFilteredResidents}
                  sortConfig={sortConfig}
                  onSort={(key) => {
                    let direction = "asc";
                    if (
                      sortConfig.key === key &&
                      sortConfig.direction === "asc"
                    ) {
                      direction = "desc";
                    }
                    setSortConfig({ key, direction });
                  }}
                  onView={(resident) => navigate(`/residents/${resident.id}`)}
                  onEdit={(resident) =>
                    navigate(`/residents/edit/${resident.id}`)
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ResidentsPage;
