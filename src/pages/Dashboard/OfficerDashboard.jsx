
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivityCard } from '@/components/dashboard/RecentActivityCard';
import { QuickActionsCard } from '@/components/dashboard/QuickActionsCard';
import { Users, FileText, AlertCircle } from 'lucide-react';

// This would be fetched from your backend in a real app
const mockActivities = [
  { title: "New resident registration submitted", time: "30 minutes ago", status: "completed" },
  { title: "Birth certificate request awaiting approval", time: "2 hours ago", status: "pending" },
  { title: "Address change verification completed", time: "4 hours ago", status: "completed" },
  { title: "ID card pickup ready for Resident Demeke", time: "Yesterday", status: "pending" },
];

const OfficerDashboard = () => {
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title={t('pendingRequests')} 
          value="18" 
          icon={<AlertCircle className="h-4 w-4" />} 
          description="Awaiting your approval"
          color="bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
        />
        <StatCard 
          title="Registrations Today" 
          value="5" 
          icon={<Users className="h-4 w-4" />} 
          description="New residents registered"
          color="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
        />
        <StatCard 
          title="Documents Processed" 
          value="43" 
          icon={<FileText className="h-4 w-4" />} 
          description="In the last 7 days"
          trend={{ type: 'increase', value: '8', label: 'from last week' }}
          color="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <RecentActivityCard activities={mockActivities} />
        <QuickActionsCard />
      </div>
      
      <div className="bg-card rounded-lg border p-4">
        <h3 className="font-semibold mb-4">Today's Tasks</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Resident Verifications</p>
              <p className="text-sm text-muted-foreground">5 pending verifications</p>
            </div>
            <div className="bg-ethiopia-yellow/20 text-ethiopia-yellow px-3 py-1 rounded-full text-xs font-medium">
              High Priority
            </div>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div>
              <p className="font-medium">Document Requests</p>
              <p className="text-sm text-muted-foreground">12 pending requests</p>
            </div>
            <div className="bg-ethiopia-green/20 text-ethiopia-green px-3 py-1 rounded-full text-xs font-medium">
              Medium Priority
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">ID Card Distribution</p>
              <p className="text-sm text-muted-foreground">8 cards ready for pickup</p>
            </div>
            <div className="bg-ethiopia-green/20 text-ethiopia-green px-3 py-1 rounded-full text-xs font-medium">
              Medium Priority
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;
