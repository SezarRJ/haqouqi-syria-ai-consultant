
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye } from 'lucide-react';
import { Consultation } from './types';

interface ConsultationsTableProps {
  consultations: Consultation[];
  loading: boolean;
  onRefresh: () => void;
}

export const ConsultationsTable = ({
  consultations,
  loading,
  onRefresh
}: ConsultationsTableProps) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      accepted: { color: 'bg-blue-100 text-blue-800', label: 'Accepted' },
      in_progress: { color: 'bg-purple-100 text-purple-800', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-800', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      paid: { color: 'bg-green-100 text-green-800', label: 'Paid' },
      refunded: { color: 'bg-red-100 text-red-800', label: 'Refunded' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Consultation Management</h3>
        <Button onClick={onRefresh} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Consultation</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Platform Fee</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {consultations.map((consultation) => (
              <TableRow key={consultation.id}>
                <TableCell>
                  <div className="font-medium">{consultation.subject}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {consultation.service_providers?.first_name} {consultation.service_providers?.last_name}
                  </div>
                </TableCell>
                <TableCell>
                  {getStatusBadge(consultation.status)}
                </TableCell>
                <TableCell>{consultation.total_amount} SAR</TableCell>
                <TableCell>{consultation.platform_fee} SAR</TableCell>
                <TableCell>
                  {getPaymentStatusBadge(consultation.payment_status)}
                </TableCell>
                <TableCell>
                  {new Date(consultation.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                    View
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
