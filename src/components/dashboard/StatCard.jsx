
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const StatCard = ({ title, value, icon, description, trend, color }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-md p-2 ${color ? color : 'bg-muted'}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className={`mt-2 text-xs ${trend.type === 'increase' ? 'text-green-500' : 'text-red-500'} flex items-center`}>
            {trend.type === 'increase' ? '↑' : '↓'} {trend.value}% {trend.label}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
