// components/ReportsPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
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

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

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
import { FileText, Download, Calendar, ChevronDown } from "lucide-react";

const ReportsPage = () => {
  const [timePeriod, setTimePeriod] = useState("last6Months");
  const [reportType, setReportType] = useState("demographic");

  const [demographicData, setDemographicData] = useState([]);
  const [genderData, setGenderData] = useState([]);
  const [documentTrendData, setDocumentTrendData] = useState([]);
  const [serviceRequestData, setServiceRequestData] = useState([]);

  // Mock reports list
  const recentReports = [
    {
      id: 1,
      title: "Annual Demographic Report 2023",
      type: "Demographic",
      date: "2023-12-15",
      author: "Admin User",
    },
    {
      id: 2,
      title: "Service Request Analysis Q3 2023",
      type: "Service",
      date: "2023-10-05",
      author: "Officer User",
    },
    {
      id: 3,
      title: "Monthly Document Issuance Report - Nov 2023",
      type: "Document",
      date: "2023-12-01",
      author: "Admin User",
    },
    {
      id: 4,
      title: "Quarterly Resident Registration - Q4 2023",
      type: "Registration",
      date: "2023-12-10",
      author: "Admin User",
    },
  ];

  // Fetch real data based on filters

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost/krfs-api/api/reports/generate_report.php?type=${reportType}&period=${timePeriod}`
        );

        // Ensure data is always an array
        if (reportType === "demographic") {
          setDemographicData(Array.isArray(res.data) ? res.data : []);
        } else if (reportType === "service") {
          setServiceRequestData(Array.isArray(res.data) ? res.data : []);
        } else if (reportType === "document") {
          setDocumentTrendData(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Error fetching report data", err);
        // Set fallback empty arrays
        setDemographicData([]);
        setServiceRequestData([]);
        setDocumentTrendData([]);
      }
    };
    fetchData();
  }, [reportType, timePeriod]);

  // Chart colors for consistency
  const COLORS_GENDER = ["#4A90E2", "#F76B6A"];
  const COLORS_DOCUMENTS = ["#4CAF50", "#FFC107", "#F44336"];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Generate and view kebele reports and analytics
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="space-y-2 w-full sm:w-auto">
            <Label htmlFor="timePeriod">Time Period</Label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last3Months">Last 3 Months</SelectItem>
                <SelectItem value="last6Months">Last 6 Months</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 w-full sm:w-auto">
            <Label htmlFor="reportType">Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="demographic">Demographic Report</SelectItem>
                <SelectItem value="service">Service Report</SelectItem>
                <SelectItem value="document">Document Report</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="w-full md:w-auto">
          <FileText className="mr-2 h-4 w-4" />
          Generate New Report
        </Button>
      </div>

      {/* Tabs for Analytics vs Reports */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid grid-cols-2 md:w-[400px] mb-4">
          <TabsTrigger value="charts">Charts & Analytics</TabsTrigger>
          <TabsTrigger value="reports">Generated Reports</TabsTrigger>
        </TabsList>

        {/* Charts Tab */}
        <TabsContent value="charts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demographic Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Demographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={demographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="AgeGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Count" fill="#4A90E2" />
                </BarChart>
              </CardContent>
            </Card>

            {/* Gender Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Gender Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <PieChart width={400} height={300}>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_GENDER[index % COLORS_GENDER.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </CardContent>
            </Card>

            {/* Service Requests Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Service Requests Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={serviceRequestData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Requests" fill="#764ba2" />
                </BarChart>
              </CardContent>
            </Card>

            {/* Document Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Document Issuance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart width={500} height={300} data={documentTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="Month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="BirthCertificates" stackId="a" fill="#4CAF50" />
                  <Bar dataKey="IDCards" stackId="a" fill="#FFC107" />
                  <Bar
                    dataKey="ResidencyCertificates"
                    stackId="a"
                    fill="#F44336"
                  />
                </BarChart>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 border rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="bg-primary/10 p-3 rounded-full mr-4">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{report.title}</h3>
                        <div className="flex text-sm text-muted-foreground">
                          <span className="mr-4">Type: {report.type}</span>
                          <span className="mr-4">Date: {report.date}</span>
                          <span>By: {report.author}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download PDF
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Report Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Custom Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="demographic">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demographic">
                        Demographic Report
                      </SelectItem>
                      <SelectItem value="service">Service Requests</SelectItem>
                      <SelectItem value="document">
                        Document Issuance
                      </SelectItem>
                      <SelectItem value="registration">
                        Resident Registration
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Time Period</Label>
                  <Select defaultValue="last6Months">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lastMonth">Last Month</SelectItem>
                      <SelectItem value="last3Months">Last 3 Months</SelectItem>
                      <SelectItem value="last6Months">Last 6 Months</SelectItem>
                      <SelectItem value="lastYear">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsPage;
