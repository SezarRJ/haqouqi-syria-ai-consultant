import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, FileText, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { ServiceProvider, Consultation } from './service-providers/types';
import { ProvidersTable } from './service-providers/ProvidersTable';
import { ConsultationsTable } from './service-providers/ConsultationsTable';
import { AnalyticsDashboard } from './service-providers/AnalyticsDashboard';

export const ServiceProvidersManagement = () => {
  const { toast } = useToast();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('providers');

  useEffect(() => {
    if (activeTab === 'providers') {
      fetchProviders();
    } else if (activeTab === 'consultations') {
      fetchConsultations();
    }
  }, [activeTab]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type cast the data to match our ServiceProvider interface
      const typedProviders = (data || []).map(provider => ({
        ...provider,
        provider_type: provider.provider_type as 'lawyer' | 'judge'
      })) as ServiceProvider[];

      setProviders(typedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch service providers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchConsultations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('paid_consultations')
        .select(`
          *,
          service_providers:provider_id (
            first_name,
            last_name,
            provider_type
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Type cast the data to match our Consultation interface
      const typedConsultations = (data || []).map(consultation => ({
        ...consultation,
        service_providers: consultation.service_providers ? {
          ...consultation.service_providers,
          provider_type: consultation.service_providers.provider_type as string
        } : undefined
      })) as Consultation[];

      setConsultations(typedConsultations);
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch consultations',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleProviderVerification = async (providerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ is_verified: !currentStatus })
        .eq('id', providerId);

      if (error) throw error;

      setProviders(prev => 
        prev.map(p => 
          p.id === providerId 
            ? { ...p, is_verified: !currentStatus }
            : p
        )
      );

      toast({
        title: 'Success',
        description: `Provider ${!currentStatus ? 'verified' : 'unverified'} successfully`,
      });
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        title: 'Error',
        description: 'Failed to update verification status',
        variant: 'destructive',
      });
    }
  };

  const toggleProviderStatus = async (providerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('service_providers')
        .update({ is_active: !currentStatus })
        .eq('id', providerId);

      if (error) throw error;

      setProviders(prev => 
        prev.map(p => 
          p.id === providerId 
            ? { ...p, is_active: !currentStatus }
            : p
        )
      );

      toast({
        title: 'Success',
        description: `Provider ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update provider status',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Service Providers Management</CardTitle>
              <CardDescription>
                Manage lawyers and judges providing consultation services
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="providers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Providers
              </TabsTrigger>
              <TabsTrigger value="consultations" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Consultations
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="providers" className="mt-6">
              <ProvidersTable
                providers={providers}
                loading={loading}
                onToggleVerification={toggleProviderVerification}
                onToggleStatus={toggleProviderStatus}
                onRefresh={fetchProviders}
              />
            </TabsContent>

            <TabsContent value="consultations" className="mt-6">
              <ConsultationsTable
                consultations={consultations}
                loading={loading}
                onRefresh={fetchConsultations}
              />
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
              <AnalyticsDashboard
                providers={providers}
                consultations={consultations}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
