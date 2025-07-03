
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import AdminDashboard from './AdminDashboard';
import OfficerDashboard from './OfficerDashboard';
import ResidentDashboard from './ResidentDashboard';
import { Spinner } from '@/components/ui/spinner';
import StaffDashboard from './StaffDashboard';

const DashboardPage = () => {
  const { user, isLoading, ROLES } = useAuth();

  console.log("User details:", user);
  console.log("Defined roles:", ROLES);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  switch (user?.role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.OFFICER:
      return <OfficerDashboard />;
    case ROLES.STAFF:
      return <StaffDashboard />;
    case ROLES.RESIDENT:
      return <ResidentDashboard />;
    default:
      return (
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Access Error</h2>
            <p className="text-muted-foreground">
              {user?.role}
              You don't have permission to access the dashboard.
            </p>
          </div>
        </div>
      );
  }
};

export default DashboardPage;
