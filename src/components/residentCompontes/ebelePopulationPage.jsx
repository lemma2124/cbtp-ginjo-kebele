import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const KebelePopulationPage = () => {
  const [kebeles, setKebeles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    sortBy: "total_residents",
    order: "desc",
    search: "",
  });

  const { toast } = useToast();

  const loadPopulationData = async () => {
    try {
      const url = new URL(
        "/api/reports/get_population_by_kebele.php",
        window.location.href
      );
      url.search = new URLSearchParams(filters).toString();

      const res = await fetch(url.toString());
      const data = await res.json();

      if (data.success) {
        setKebeles(data.population);
      } else {
        throw new Error("Failed to load population data");
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPopulationData();
  }, [filters.sortBy, filters.order, filters.search]);

  const handleSortChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({ ...prev, sortBy: value }));
  };

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Kebele Resident Population</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search + Sort Controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/3">
              <Label htmlFor="search">Search by Kebele Name</Label>
              <Input
                id="search"
                placeholder="Search kebele..."
                value={filters.search}
                onChange={handleSearchChange}
              />
            </div>
            <div className="w-full md:w-1/3">
              <Label>Sort By</Label>
              <Select onValueChange={handleSortChange} value={filters.sortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="total_residents">
                    Total Residents
                  </SelectItem>
                  <SelectItem value="active_residents">
                    Active Residents
                  </SelectItem>
                  <SelectItem value="family_count">Household Count</SelectItem>
                  <SelectItem value="avg_age">Average Age</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/3 flex items-end">
              <Button
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    order: prev.order === "asc" ? "desc" : "asc",
                  }))
                }
              >
                Sort Order:{" "}
                {filters.order === "asc" ? "Ascending" : "Descending"}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Kebele
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Total Residents
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Active Residents
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Families
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium">
                    Avg. Age
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {kebeles.length > 0 ? (
                  kebeles.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.kebele_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.total_residents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.active_residents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.family_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {Math.round(item.avg_age)} years
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KebelePopulationPage;
