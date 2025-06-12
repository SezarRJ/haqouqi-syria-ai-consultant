
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Shield, Eye, Clock, User, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuditLogEntry {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  admin_user_id: string;
}

interface SecurityAuditLogProps {
  language: 'ar' | 'en';
}

export const SecurityAuditLog = ({ language }: SecurityAuditLogProps) => {
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const texts = {
    ar: {
      title: 'سجل التدقيق الأمني',
      description: 'مراقبة جميع الإجراءات الإدارية والأنشطة الحساسة',
      refresh: 'تحديث',
      action: 'الإجراء',
      resource: 'المورد',
      admin: 'المسؤول',
      timestamp: 'الوقت',
      details: 'التفاصيل',
      ipAddress: 'عنوان IP',
      noLogs: 'لا توجد سجلات تدقيق',
      loadError: 'خطأ في تحميل سجلات التدقيق'
    },
    en: {
      title: 'Security Audit Log',
      description: 'Monitor all administrative actions and sensitive activities',
      refresh: 'Refresh',
      action: 'Action',
      resource: 'Resource',
      admin: 'Admin',
      timestamp: 'Timestamp',
      details: 'Details',
      ipAddress: 'IP Address',
      noLogs: 'No audit logs found',
      loadError: 'Error loading audit logs'
    }
  };

  const t = texts[language];

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching audit logs:', error);
        toast({
          title: t.loadError,
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      setAuditLogs(data || []);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast({
        title: t.loadError,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const getActionBadgeColor = (action: string) => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      case 'approve':
        return 'bg-purple-100 text-purple-800';
      case 'login':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return language === 'ar' 
      ? date.toLocaleString('ar-SA')
      : date.toLocaleString('en-US');
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </div>
          </div>
          <Button onClick={fetchAuditLogs} disabled={loading} variant="outline">
            <Activity className="h-4 w-4 mr-2" />
            {loading ? '...' : t.refresh}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {auditLogs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t.noLogs}</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.action}</TableHead>
                  <TableHead>{t.resource}</TableHead>
                  <TableHead>{t.timestamp}</TableHead>
                  <TableHead>{t.ipAddress}</TableHead>
                  <TableHead>{t.details}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge className={getActionBadgeColor(log.action)}>
                        {log.action}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{log.resource_type}</span>
                        {log.resource_id && (
                          <span className="text-xs text-gray-500">
                            {log.resource_id.substring(0, 8)}...
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-sm">
                          {formatTimestamp(log.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-mono">
                        {log.ip_address || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-sm text-gray-600">
                        {JSON.stringify(log.details)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
