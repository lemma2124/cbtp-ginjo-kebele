import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";

const ResidentsPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const [residents, setResidents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  // Load residents from API
  useEffect(() => {
    if (!isAuthenticated) return;

    fetch("http://localhost/krfs-api/api/residents/get_all.php", {
      method: "GET",
      credentials: "include", // 🔐 Send session cookies
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return await res.json();
      })
      .then((data) => {
        if (data.success) {
          setResidents(data.residents || []);
        } else {
          throw new Error(data.error || "Failed to load residents");
        }
      })
      .catch((err) => {
        console.error("Error fetching residents:", err.message);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  // Filter residents by name or ID number
  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.idNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) return null;
  if (loading) return <div>{t("loading")}...</div>;
  if (error)
    return (
      <div className="p-6 text-red-500">
        {t("error")}: {error}
      </div>
    );
  if (filteredResidents.length === 0)
    return (
      <div className="container mx-auto p-6 text-center">
        <h3 className="text-xl font-medium">{t("no_residents_found")}</h3>
        <Button
          className="mt-4"
          onClick={() => navigate("/residents/new")}
        >
          + {t("add_new_resident")}
        </Button>
      </div>
    );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("residents")}</h1>
          <p className="text-muted-foreground">{t("manage_and_view_all_residents")}</p>
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button onClick={() => navigate("/residents/new")}>
          + {t("addResident")}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 gap-4 w-full max-w-md">
          <TabsTrigger value="all">{t("all")}</TabsTrigger>
          <TabsTrigger value="active">{t("active")}</TabsTrigger>
          <TabsTrigger value="inactive">{t("inactive")}</TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResidents.map((resident) => (
              <Card
                key={resident.id}
                className="hover:bg-muted/50 transition cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700"
                onClick={() => navigate(`/residents/${resident.id}`)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  {/* Avatar */}
                  <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                    <span className="text-green-600 font-medium">
                      {resident.name.charAt(0).toUpperCase()}
                    </span>
                  </div>

                  {/* Name & ID */}
                  <h3 className="font-semibold text-lg">{resident.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {resident.idNumber}
                  </p>
                  <p className="text-sm mt-2">{resident.address}</p>

                  {/* Actions */}
                  <div className="mt-4 flex gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/residents/${resident.id}`);
                      }}
                      className="flex-1"
                    >
                      {t("view")}
                    </Button>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/residents/edit/${resident.id}`);
                      }}
                      className="flex-1"
                    >
                      {t("edit")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResidents
              .filter((r) => r.is_active)
              .map((resident) => (
                <Card
                  key={resident.id}
                  className="hover:bg-muted/50 transition cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700"
                  onClick={() => navigate(`/residents/${resident.id}`)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <span className="text-green-600 font-medium">
                        {resident.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{resident.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resident.idNumber}
                    </p>
                    <p className="text-sm mt-2">{resident.address}</p>
                    <div className="mt-4 flex gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/residents/${resident.id}`);
                        }}
                        className="flex-1"
                      >
                        {t("view")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/residents/edit/${resident.id}`);
                        }}
                        className="flex-1"
                      >
                        {t("edit")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResidents
              .filter((r) => !r.is_active)
              .map((resident) => (
                <Card
                  key={resident.id}
                  className="hover:bg-muted/50 transition cursor-pointer shadow-sm border border-gray-200 dark:border-gray-700"
                  onClick={() => navigate(`/residents/${resident.id}`)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center opacity-80">
                    <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <span className="text-gray-600 font-medium">
                        {resident.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg">{resident.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resident.idNumber}
                    </p>
                    <p className="text-sm mt-2">{resident.address}</p>
                    <div className="mt-4 flex gap-2 w-full">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/residents/${resident.id}`);
                        }}
                        className="flex-1"
                      >
                        {t("view")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/residents/edit/${resident.id}`);
                        }}
                        className="flex-1"
                      >
                        {t("edit")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResidentsPage;