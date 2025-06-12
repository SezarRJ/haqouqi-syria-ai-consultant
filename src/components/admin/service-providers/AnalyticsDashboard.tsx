
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, Activity, FileText } from 'lucide-react';
import { ServiceProvider, Consultation } from './types';

interface AnalyticsDashboardProps {
  providers: ServiceProvider[];
  consultations: Consultation[];
}

export const AnalyticsDashboard = ({ providers, consultations }: AnalyticsDashboardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{providers.length}</div>
              <div className="text-sm text-gray-600">Total Providers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">
                {providers.filter(p => p.is_verified).length}
              </div>
              <div className="text-sm text-gray-600">Verified Providers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-orange-600" />
            <div>
              <div className="text-2xl font-bold">
                {providers.filter(p => p.is_active).length}
              </div>
              <div className="text-sm text-gray-600">Active Providers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <FileText className="h-8 w-8 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{consultations.length}</div>
              <div className="text-sm text-gray-600">Total Consultations</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
