
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Eye } from 'lucide-react';
import { ServiceProvider } from './types';

interface ProvidersTableProps {
  providers: ServiceProvider[];
  loading: boolean;
  onToggleVerification: (providerId: string, currentStatus: boolean) => void;
  onToggleStatus: (providerId: string, currentStatus: boolean) => void;
  onRefresh: () => void;
}

export const ProvidersTable = ({
  providers,
  loading,
  onToggleVerification,
  onToggleStatus,
  onRefresh
}: ProvidersTableProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Service Providers</h3>
        <Button onClick={onRefresh} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Rate/Hour</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Consultations</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {provider.first_name} {provider.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {provider.specialties.slice(0, 2).join(', ')}
                      {provider.specialties.length > 2 && '...'}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {provider.provider_type}
                  </Badge>
                </TableCell>
                <TableCell>{provider.experience_years} years</TableCell>
                <TableCell>
                  {provider.hourly_rate} {provider.currency}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{provider.rating.toFixed(1)}</span>
                  </div>
                </TableCell>
                <TableCell>{provider.total_consultations}</TableCell>
                <TableCell>
                  <Switch
                    checked={provider.is_verified}
                    onCheckedChange={() => 
                      onToggleVerification(provider.id, provider.is_verified)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={provider.is_active}
                    onCheckedChange={() => 
                      onToggleStatus(provider.id, provider.is_active)
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
