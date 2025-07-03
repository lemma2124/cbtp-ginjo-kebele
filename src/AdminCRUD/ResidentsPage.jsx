import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserPlus, Filter, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ResidentsPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load residents from PHP backend
  useEffect(() => {
    fetch("http://localhost/krfs-api/api/residents/get_all.php")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load residents");
        return await res.json();
      })
      .then((data) => {
        setResidents(data.residents || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filteredResidents = residents.filter(
    (resident) =>
      resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resident.idNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("residents")}</h2>
        <p className="text-muted-foreground">
          {t("manage_and_view_all_residents")}
        </p>
      </div>

      {/* Search & Add New */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Input
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Filter className="h-4 w-4" />
          </div>
        </div>
        <Button
          onClick={() => navigate("/residents/new")}
          className="w-full md:w-auto"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {t("add_new_resident")}
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t("all_residents")}</TabsTrigger>
          <TabsTrigger value="recent">{t("recently_added")}</TabsTrigger>
          <TabsTrigger value="household">{t("by_household")}</TabsTrigger>
        </TabsList>

        {/* Tab Content: All Residents */}
        <TabsContent value="all" className="space-y-4">
          {filteredResidents.length > 0 ? (
            filteredResidents.map((resident) => (
              <Card
                key={resident.id}
                className="hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/residents/${resident.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{resident.name}</h3>
                      <div className="flex text-sm text-muted-foreground">
                        <span className="mr-4">ID: {resident.idNumber}</span>
                        <span>Phone: {resident.phone}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Button variant="outline" size="sm" className="mr-2">
                      <FileText className="h-4 w-4 mr-1" />
                      {t("view")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">{t("no_residents_found")}</p>
            </div>
          )}
        </TabsContent>

        {/* Tab Content: Recently Added */}
        <TabsContent value="recent" className="space-y-4">
          {filteredResidents.slice(0, 3).map((resident) => (
            <Card
              key={resident.id}
              className="hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/residents/${resident.id}`)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{resident.name}</h3>
                    <div className="flex text-sm text-muted-foreground">
                      <span className="mr-4">ID: {resident.idNumber}</span>
                      <span>Phone: {resident.phone}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-green-600">{t("recent")}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tab Content: By Household */}
        <TabsContent value="household" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone 2, Kebele 08</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredResidents
                .filter((r) => r.address.includes("Zone 2"))
                .map((resident) => (
                  <div
                    key={resident.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                  >
                    <div>
                      <p className="font-medium">{resident.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {resident.address}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/residents/${resident.id}`)}
                    >
                      {t("view")}
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Zone 3, Kebele 05</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredResidents
                .filter((r) => r.address.includes("Zone 3"))
                .map((resident) => (
                  <div
                    key={resident.id}
                    className="flex items-center justify-between p-2 hover:bg-accent rounded-md"
                  >
                    <div>
                      <p className="font-medium">{resident.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {resident.address}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/residents/${resident.id}`)}
                    >
                      {t("view")}
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ResidentsPage;
