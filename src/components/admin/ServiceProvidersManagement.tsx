
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Star, DollarSign, FileText, Eye, Shield, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ServiceProvider {
  id: string;
  user_id: string;
  provider_type: 'lawyer' | 'judge';
  first_name: string;
  last_name: string;
  specialties: string[];
  activities: string[];
  bio: string;
  experience_years: number;
  hourly_rate: number;
  currency: string;
  account_number: string;
  bank_name: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_consultations: number;
  created_at: string;
}

interface Consultation {
  id: string;
  client_id: string;
  provider_id: string;
  subject: string;
  status: string;
  total_amount: number;
  platform_fee: number;
  provider_amount: number;
  payment_status: string;
  created_at: string;
}

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
      setProviders(data || []);
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
          service_providers!inner(first_name, last_name, provider_type)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConsultations(data || []);
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
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Service Providers</h3>
                  <Button onClick={fetchProviders} disabled={loading}>
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
                                toggleProviderVerification(provider.id, provider.is_verified)
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Switch
                              checked={provider.is_active}
                              onCheckedChange={() => 
                                toggleProviderStatus(provider.id, provider.is_active)
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
            </TabsContent>

            <TabsContent value="consultations" className="mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Consultation Management</h3>
                  <Button onClick={fetchConsultations} disabled={loading}>
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
            </TabsContent>

            <TabsContent value="analytics" className="mt-6">
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
