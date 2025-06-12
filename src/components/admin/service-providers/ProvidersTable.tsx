
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star, Eye, CheckCircle, XCircle, Clock, Shield } from 'lucide-react';
import { ServiceProvider } from './types';

interface ProvidersTableProps {
  providers: ServiceProvider[];
  loading: boolean;
  onToggleVerification: (providerId: string, currentStatus: boolean) => void;
  onToggleStatus: (providerId: string, currentStatus: boolean) => void;
  onApproveProvider: (providerId: string) => void;
  onRejectProvider: (providerId: string) => void;
  onRefresh: () => void;
  language: 'ar' | 'en';
}

export const ProvidersTable = ({
  providers,
  loading,
  onToggleVerification,
  onToggleStatus,
  onApproveProvider,
  onRejectProvider,
  onRefresh,
  language
}: ProvidersTableProps) => {
  const texts = {
    ar: {
      title: 'مقدمو الخدمات',
      refresh: 'تحديث',
      provider: 'مقدم الخدمة',
      type: 'النوع',
      experience: 'الخبرة',
      rate: 'التعرفة/ساعة',
      rating: 'التقييم',
      consultations: 'الاستشارات',
      verified: 'موثق',
      active: 'نشط',
      approval: 'الموافقة',
      actions: 'الإجراءات',
      details: 'التفاصيل',
      approve: 'موافقة',
      reject: 'رفض',
      pending: 'قيد الانتظار',
      approved: 'تمت الموافقة',
      rejected: 'مرفوض',
      years: 'سنوات',
      loading: 'جاري التحميل...'
    },
    en: {
      title: 'Service Providers',
      refresh: 'Refresh',
      provider: 'Provider',
      type: 'Type',
      experience: 'Experience',
      rate: 'Rate/Hour',
      rating: 'Rating',
      consultations: 'Consultations',
      verified: 'Verified',
      active: 'Active',
      approval: 'Approval',
      actions: 'Actions',
      details: 'Details',
      approve: 'Approve',
      reject: 'Reject',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      years: 'years',
      loading: 'Loading...'
    }
  };

  const t = texts[language];

  const getApprovalStatus = (provider: ServiceProvider) => {
    if (provider.requires_approval === false) {
      return { status: 'approved', icon: CheckCircle, color: 'text-green-600' };
    } else if (provider.approved_at) {
      return { status: 'approved', icon: CheckCircle, color: 'text-green-600' };
    } else {
      return { status: 'pending', icon: Clock, color: 'text-yellow-600' };
    }
  };

  const maskSensitiveData = (data: string) => {
    if (!data) return 'N/A';
    if (data.length <= 4) return data;
    return `${data.substring(0, 4)}***`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          {t.title}
        </h3>
        <Button onClick={onRefresh} disabled={loading} variant="outline">
          {loading ? t.loading : t.refresh}
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.provider}</TableHead>
              <TableHead>{t.type}</TableHead>
              <TableHead>{t.experience}</TableHead>
              <TableHead>{t.rate}</TableHead>
              <TableHead>{t.rating}</TableHead>
              <TableHead>{t.consultations}</TableHead>
              <TableHead>{t.approval}</TableHead>
              <TableHead>{t.verified}</TableHead>
              <TableHead>{t.active}</TableHead>
              <TableHead>{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {providers.map((provider) => {
              const approvalInfo = getApprovalStatus(provider);
              const ApprovalIcon = approvalInfo.icon;
              
              return (
                <TableRow key={provider.id} className={
                  provider.requires_approval !== false ? 'bg-yellow-50' : ''
                }>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {provider.first_name} {provider.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {maskSensitiveData(provider.id)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {provider.specialties?.slice(0, 2).join(', ')}
                        {(provider.specialties?.length || 0) > 2 && '...'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {provider.provider_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {provider.experience_years} {t.years}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {provider.hourly_rate} {provider.currency}
                    </div>
                    <div className="text-xs text-gray-500">
                      Bank: {maskSensitiveData(provider.bank_name)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span>{provider.rating?.toFixed(1) || '0.0'}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {provider.total_consultations || 0}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ApprovalIcon className={`h-4 w-4 ${approvalInfo.color}`} />
                      <span className="text-sm capitalize">
                        {approvalInfo.status === 'approved' ? t.approved : t.pending}
                      </span>
                    </div>
                    {provider.requires_approval !== false && (
                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onApproveProvider(provider.id)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {t.approve}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRejectProvider(provider.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          {t.reject}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={provider.is_verified || false}
                      onCheckedChange={() => 
                        onToggleVerification(provider.id, provider.is_verified || false)
                      }
                      disabled={provider.requires_approval !== false}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={provider.is_active || false}
                      onCheckedChange={() => 
                        onToggleStatus(provider.id, provider.is_active || false)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {t.details}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
