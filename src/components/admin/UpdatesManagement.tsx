
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, CheckCircle, XCircle, Plus, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UpdatesManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pendingUpdates } = useQuery({
    queryKey: ['pending-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('law_updates')
        .select(`
          *,
          laws(name),
          law_articles(title, article_number),
          profiles(full_name)
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: allUpdates } = useQuery({
    queryKey: ['all-updates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('law_updates')
        .select(`
          *,
          laws(name),
          law_articles(title, article_number),
          profiles(full_name)
        `)
        .order('submitted_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    }
  });

  const reviewUpdateMutation = useMutation({
    mutationFn: async ({ id, status, comments }: { id: string; status: string; comments?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('law_updates')
        .update({
          status,
          review_comments: comments,
          reviewed_by: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-updates'] });
      queryClient.invalidateQueries({ queryKey: ['all-updates'] });
      toast({
        title: "تم بنجاح",
        description: "تم مراجعة التحديث بنجاح",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
          <Clock className="h-3 w-3 ml-1" />معلق
        </Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 ml-1" />موافق عليه
        </Badge>;
      case 'rejected':
        return <Badge variant="destructive">
          <XCircle className="h-3 w-3 ml-1" />مرفوض
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const UpdateCard = ({ update, showActions = false }: { update: any; showActions?: boolean }) => (
    <Card className="mb-4 shadow-sm border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800">{update.laws?.name || update.law_articles?.title}</h3>
            </div>
            <div className="space-y-1 text-sm text-slate-600">
              <p><span className="font-medium">نوع التحديث:</span> {update.update_type}</p>
              <p><span className="font-medium">مقدم من:</span> {update.profiles?.full_name}</p>
              <p className="text-xs text-slate-500">
                {new Date(update.submitted_at).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(update.status)}
            {showActions && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reviewUpdateMutation.mutate({ id: update.id, status: 'approved' })}
                  className="border-green-300 text-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reviewUpdateMutation.mutate({ id: update.id, status: 'rejected' })}
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="font-medium text-slate-700 mb-1">سبب التحديث:</p>
            <p className="text-slate-600">{update.update_reason}</p>
          </div>
          
          {update.old_content && (
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="font-medium text-red-700 mb-1">المحتوى القديم:</p>
              <p className="text-red-600 text-xs">{update.old_content}</p>
            </div>
          )}
          
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="font-medium text-green-700 mb-1">المحتوى الجديد:</p>
            <p className="text-green-600 text-xs">{update.new_content}</p>
          </div>
          
          {update.review_comments && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-700 mb-1">تعليقات المراجعة:</p>
              <p className="text-blue-600 text-xs">{update.review_comments}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">إدارة التحديثات</h2>
            <p className="text-slate-600">مراجعة وإدارة تحديثات القوانين</p>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md">
          <Plus className="h-4 w-4 ml-2" />
          إضافة تحديث جديد
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">التحديثات المعلقة</p>
                <p className="text-2xl font-bold text-yellow-800">{pendingUpdates?.length || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">التحديثات المعتمدة</p>
                <p className="text-2xl font-bold text-green-800">
                  {allUpdates?.filter(u => u.status === 'approved').length || 0}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">التحديثات المرفوضة</p>
                <p className="text-2xl font-bold text-red-800">
                  {allUpdates?.filter(u => u.status === 'rejected').length || 0}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
          <TabsTrigger value="pending" className="flex items-center gap-2 data-[state=active]:bg-yellow-500 data-[state=active]:text-white">
            <Clock className="h-4 w-4" />
            المعلقة ({pendingUpdates?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
            <Eye className="h-4 w-4" />
            جميع التحديثات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-yellow-200">
              <CardTitle className="text-yellow-800">التحديثات المعلقة</CardTitle>
              <CardDescription className="text-yellow-600">تحديثات تحتاج إلى مراجعة وموافقة</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {pendingUpdates?.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p>لا توجد تحديثات معلقة</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUpdates?.map((update) => (
                    <UpdateCard key={update.id} update={update} showActions={true} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
              <CardTitle className="text-slate-800">جميع التحديثات</CardTitle>
              <CardDescription className="text-slate-600">سجل شامل بجميع التحديثات</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {allUpdates?.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                  <p>لا توجد تحديثات</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {allUpdates?.map((update) => (
                    <UpdateCard key={update.id} update={update} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
