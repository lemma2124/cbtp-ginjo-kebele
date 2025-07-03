
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/LanguageContext';
import { UserPlus, ClipboardCheck, FileText, Map } from 'lucide-react';

export const QuickActionsCard = () => {
  const { t } = useLanguage();
  
  const actions = [
    {
      title: t('newRegistration'),
      icon: <UserPlus className="h-4 w-4" />,
      href: '/residents/new'
    },
    {
      title: t('approvals'),
      icon: <ClipboardCheck className="h-4 w-4" />,
      href: '/documents/approvals'
    },
    {
      title: t('generateCertificate'),
      icon: <FileText className="h-4 w-4" />,
      href: '/documents/generate'
    },
    {
      title: t('map'),
      icon: <Map className="h-4 w-4" />,
      href: '/map'
    }
  ];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('quickActions')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2"
              asChild
            >
              <a href={action.href}>
                {action.icon}
                <span>{action.title}</span>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
