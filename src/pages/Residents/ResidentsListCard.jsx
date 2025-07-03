import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
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

const ResidentCard = ({ resident, onClick }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <Card
      className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border rounded-lg overflow-hidden group"
      onClick={onClick}
    >
      {/* Avatar Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent h-24 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl shadow-md">
          {resident.name.charAt(0).toUpperCase()}
        </div>
      </div>

      {/* Card Content */}
      <CardContent className="p-5 space-y-4">
        <h3 className="font-semibold text-lg truncate">{resident.name}</h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge variant={resident.is_active ? "success" : "destructive"}>
            {resident.is_active ? t("active") : t("inactive")}
          </Badge>
          <Badge variant="outline">{resident.gender}</Badge>
          <Badge variant="secondary">{resident.maritalStatus}</Badge>
        </div>

        {/* ID Number */}
        <p className="text-sm text-muted-foreground truncate">
          {t("id_number")}: {resident.idNumber}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-2 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            {t("view")}
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/residents/edit/${resident.id}`);
            }}
          >
            {t("edit")}
          </Button>
        </div>
      </CardContent>
    </Card>
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
  });

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

  // Filter Logic
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

  const tabFilteredResidents = useMemo(() => {
    if (activeTab === "all") return filteredResidents;
    return filteredResidents.filter((resident) =>
      activeTab === "active" ? resident.is_active : !resident.is_active
    );
  }, [filteredResidents, activeTab]);

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
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t("residents")}</h1>
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

      {/* Filters Section */}
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
          <Select onValueChange={(v) =>
            handleFilterChange("maritalStatus", v)
          }>
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
          <Select onValueChange={(v) =>
            handleFilterChange("isActive", v)
          }>
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

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : tabFilteredResidents.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground">{t("no_residents_found")}</p>
            <Button onClick={() => navigate("/residents/new")}>
              {t("add_new_resident")}
            </Button>
          </div>
        ) : (
          <TabsContent value={activeTab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {tabFilteredResidents.map((resident) => (
                <ResidentCard
                  key={resident.id}
                  resident={resident}
                  onClick={() => navigate(`/residents/${resident.id}`)}
                />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default ResidentsPage;