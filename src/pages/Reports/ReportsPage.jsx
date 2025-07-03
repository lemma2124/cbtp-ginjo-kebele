import React, { useState, useEffect } from "react";
import axios from "axios";

// UI Components
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Alert, AlertDescription } from "../../components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Chart Libraries
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ReportsPage = () => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("demographic");
  const [period, setPeriod] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Report options
  const reportTypes = [
    { value: "demographic", label: "Demographic Distribution" },
    { value: "service", label: "Service Requests" },
    { value: "document", label: "Document Issued" },
    { value: "registration", label: "Resident Registration" },
    { value: "certificate", label: "Certificate Issued" },
    { value: "family", label: "Family Registration" },
  ];

  const timePeriods = [
    { value: "all", label: "All Time" },
    { value: "lastMonth", label: "Last Month" },
    { value: "last3Months", label: "Last 3 Months" },
    { value: "last6Months", label: "Last 6 Months" },
    { value: "lastYear", label: "Last Year" },
  ];

  const COLORS_GENDER = ["#4A90E2", "#F76B6A"];
  const COLORS_DOCUMENTS = ["#4CAF50", "#FFC107", "#F44336"];

  // Fetch report data
  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost/krfs-api/api/reports/generate_report.php`,
        {
          params: { type, period },
        }
      );
      setData(response.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Failed to load report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [type, period]);

  // Transform data for charts
  const getGenderChartData = () => {
    const genderCounts = {};
    data.forEach((item) => {
      const key = item.gender || "Unknown";
      genderCounts[key] = (genderCounts[key] || 0) + parseInt(item.Count || 1);
    });
    return Object.entries(genderCounts).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const getDocumentChartData = () => {
    const docCounts = {};
    data.forEach((item) => {
      const key = item.category_id || "Other";
      docCounts[key] = (docCounts[key] || 0) + parseInt(item.Documents || 1);
    });
    return Object.entries(docCounts).map(([name, value]) => ({ name, value }));
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-3xl font-bold">Reports</h2>
        <p className="text-muted-foreground">
          Generate and view kebele reports and analytics
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="space-y-2 w-full md:w-1/3">
          <Label htmlFor="reportType">Report Type</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              {reportTypes.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 w-full md:w-1/3">
          <Label htmlFor="timePeriod">Time Period</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              {timePeriods.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={fetchReportData}
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? "Loading..." : "Generate Report"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Charts and Table Tabs */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid grid-cols-2 md:w-[400px] mb-6">
          <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
          <TabsTrigger value="table">Raw Data</TabsTrigger>
        </TabsList>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          {type === "demographic" && (
            <Card>
              <CardHeader>
                <CardTitle>Demographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart width={600} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="AgeGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Count" fill="#4A90E2" />
                </BarChart>
              </CardContent>
            </Card>
          )}

          {type === "document" && (
            <Card>
              <CardHeader>
                <CardTitle>Document Types Issued</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart width={400} height={300}>
                  <Pie
                    data={getDocumentChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getDocumentChartData().map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_DOCUMENTS[index % COLORS_DOCUMENTS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>
          )}

          {(type === "service" ||
            type === "registration" ||
            type === "family") && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {reportTypes.find((r) => r.value === type)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart width={600} height={300} data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={type === "service" ? "Month" : "Month"} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Requests" fill="#4CAF50" />
                </BarChart>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Raw Data Tab */}
        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Raw Report Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-muted text-left">
                      {data.length > 0 &&
                        Object.keys(data[0]).map((key) => (
                          <th key={key} className="px-4 py-2">
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, i) => (
                      <tr key={i} className="border-t hover:bg-muted/20">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="px-4 py-2">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
