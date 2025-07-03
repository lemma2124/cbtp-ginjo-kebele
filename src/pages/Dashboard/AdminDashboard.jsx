
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { Users, FileText, AlertCircle, CreditCard } from 'lucide-react';

// This would be fetched from your backend in a real app
const mockActivities = [
  { title: "New resident registration submitted by Officer Abebe", time: "2 minutes ago", status: "pending" },
  { title: "Birth certificate request approved", time: "1 hour ago", status: "completed" },
  { title: "Address change request rejected - incomplete documents", time: "3 hours ago", status: "rejected" },
  { title: "System backup completed", time: "5 hours ago", status: "completed" },
  { title: "New document uploaded by Resident Kebede", time: "Yesterday", status: "pending" },
];

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h2>
        <p className="text-muted-foreground">
          {t('welcome')}, {user?.name}!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t('residents')} 
          value="12,543" 
          icon={<Users className="h-4 w-4" />} 
          description="Total registered residents"
          trend={{ type: 'increase', value: '12', label: 'from last month' }}
          color="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard 
          title={t('pendingRequests')} 
          value="42" 
          icon={<AlertCircle className="h-4 w-4" />} 
          description="Awaiting approval"
          color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        />
        <StatCard 
          title={t('documents')} 
          value="8,345" 
          icon={<FileText className="h-4 w-4" />} 
          description="Total documents stored"
          trend={{ type: 'increase', value: '8', label: 'from last month' }}
          color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        />
        <StatCard 
          title="Revenue" 
          value="63,582 ETB" 
          icon={<CreditCard className="h-4 w-4" />} 
          description="Total revenue collected"
          trend={{ type: 'increase', value: '10', label: 'from last month' }}
          color="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecentActivityCard activities={mockActivities} />
        <QuickActionsCard />
      </div>
      
      {/* Charts would go here - for a complete app we'd implement these with recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Demographic Distribution</h3>
          <div className="h-80 flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">Age & Gender Distribution Chart</p>
          </div>
        </div>
        <div className="bg-card rounded-lg border p-4">
          <h3 className="font-semibold mb-4">Service Requests Trend</h3>
          <div className="h-80 flex items-center justify-center border rounded-md">
            <p className="text-muted-foreground">Monthly Service Requests Chart</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
