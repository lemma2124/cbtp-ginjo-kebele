

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { StatCard } from "@/components/dashboard/StatCard";
import RecentActivityCard from "@/components/dashboard/RecentActivityCard"; // Consistent alias
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { Users, FileText, AlertCircle } from "lucide-react";

// ... rest of the component remains unchanged

const AdminDashboard = () => {
  const [count, setCount] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchData() {
      try {
        const countRes = await fetch(
          "http://localhost/krfs-api/api/admin/count.php"
        );
        if (!countRes.ok) throw new Error("Failed to fetch counts");
        const countData = await countRes.json();
        setCount(countData);

        const activitiesRes = await fetch(
          "http://localhost/krfs-api/api/admin/activities.php"
        );
        if (!activitiesRes.ok) throw new Error("Failed to fetch activities");
        const activitiesData = await activitiesRes.json();
        setActivities(activitiesData);
      } catch (error) {
        console.error("Fetch error:", error);
        setCount({ error: "Failed to load data" });
        setActivities([
          { title: "Error loading activities", time: "", status: "error" },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  if (count?.error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-red-500">Error: {count.error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t("dashboard")}</h2>
        <p className="text-muted-foreground">
          {t("welcome")}, {user?.name || "User"}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("residents")}
          value={count && count[0]?.resident ? count[0].resident : "0"}
          icon={<Users className="h-4 w-4" />}
          description="Total registered residents"
          trend={{ type: "increase", value: "12", label: "from last year" }}
          color="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard
          title={t("pendingRequests")}
          value={count && count[0]?.pending ? count[0].pending : "0"}
          icon={<AlertCircle className="h-4 w-4" />}
          description="Awaiting approval"
          color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        />
        <StatCard
          title={t("documents")}
          value={count && count[0]?.documents ? count[0].documents : "0"}
          icon={<FileText className="h-4 w-4" />}
          description="Total documents stored"
          trend={{ type: "increase", value: "8", label: "from last month" }}
          color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecentActivityCard activities={activities} />
        <QuickActionsCard />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Demographic Distribution</h3>
          <div className="h-80 flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">
              Age & Gender Distribution Chart
            </p>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Service Requests Trend</h3>
          <div className="h-80 flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">
              Monthly Service Requests Chart
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
