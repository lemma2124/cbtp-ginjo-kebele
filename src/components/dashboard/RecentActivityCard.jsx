
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';

export const RecentActivityCard = ({ activities }) => {
  const { t } = useLanguage();
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>{t('recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className={`rounded-full w-2 h-2 mt-2 ${
                activity.status === 'completed' ? 'bg-ethiopia-green' :
                activity.status === 'pending' ? 'bg-ethiopia-yellow' : 'bg-ethiopia-red'
              }`} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  {t('view')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
