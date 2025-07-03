
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Home, Users, FileText, BarChart2, Bell, Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { use } from 'react';

export const Sidebar = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const navigation = [
    {
      title: t("dashboard"),
      href: "/",
      icon: Home,
      roles: [
        useAuth().ROLES.ADMIN,
        useAuth().ROLES.OFFICER,
        useAuth().ROLES.RESIDENT,
        useAuth().ROLES.STAFF,
      ],
    },
    {
      title: t("residentsALL"),
      href: "/residentsALL",
      icon: Users,
      roles: [useAuth().ROLES.ADMIN],
    },
    {
      title: t("Certificate"),
      href: "/CertificateList",
      icon: Users,
      roles: [useAuth().ROLES.RESIDENT],
    },
    {
      title: t("residents"),
      href: "/residents",
      icon: Users,
      roles: [useAuth().ROLES.OFFICER, useAuth().ROLES.STAFF],
    },
    {
      title: t("Register"),
      href: "/RegisterResident",
      icon: Users,
      roles: [useAuth().ROLES.STAFF],
    },
    {
      title: t("documents"),
      href: "/documents/request",
      icon: FileText,
      //RegisterResident
      roles: [
        useAuth().ROLES.ADMIN,
        useAuth().ROLES.OFFICER,

        useAuth().ROLES.STAFF,
      ],
    },
    {
      title: t("reports"),
      href: "/reports",
      icon: BarChart2,
      roles: [useAuth().ROLES.ADMIN, useAuth().ROLES.OFFICER],
    },
    {
      title: t("notifications"),
      href: "/notifications",
      icon: Bell,
      roles: [
        useAuth().ROLES.ADMIN
      
      ],
    },

    {
      title: t("ManageRequests"),
      href: "/ManageRequests",
      icon: FileText,
      roles: [useAuth().ROLES.STAFF],
    },
    {
      title: t("settings"),
      href: "/settings",
      icon: Settings,
      roles: [
        useAuth().ROLES.ADMIN,
        useAuth().ROLES.OFFICER,
        useAuth().ROLES.RESIDENT,
        useAuth().ROLES.STAFF,
      ],
    },
  ];
  //
  const filteredNavigation = user
    ? navigation.filter((item) => item.roles.includes(user.role))
    : navigation;

  const isActiveRoute = (href) => {
    if (href === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="h-full flex flex-col bg-sidebar py-4 border-r">
      <div className="px-3 py-2">
        <div className="mb-10 flex items-center px-4">
          <div className="h-8 w-8 rounded-full ethiopia-flag-gradient" />
          <h2 className="ml-2 text-lg font-semibold tracking-tight">KRFMS</h2>
        </div>
        <div className="space-y-1">
          {filteredNavigation.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              asChild
              className={cn(
                "w-full justify-start",
                isActiveRoute(item.href) && "bg-accent"
              )}
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
