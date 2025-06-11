
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, CheckCircle, XCircle, Plus, Eye } from 'lucide-react';
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
        return <Badge variant="secondary"><Clock className="h-3 w-3 ml-1" />معلق</Badge>;
      case 'approved':
        return <Badge variant="default"><CheckCircle className="h-3 w-3 ml-1" />موافق عليه</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 ml-1" />مرفوض</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const UpdateCard = ({ update, showActions = false }: { update: any; showActions?: boolean }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold">{update.laws?.name || update.law_articles?.title}</h3>
            <p className="text-sm text-gray-600">نوع التحديث: {update.update_type}</p>
            <p className="text-sm text-gray-500">مقدم من: {update.profiles?.full_name}</p>
            <p className="text-xs text-gray-400">
              {new Date(update.submitted_at).toLocaleDateString('ar-SA')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(update.status)}
            {showActions && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reviewUpdateMutation.mutate({ id: update.id, status: 'approved' })}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => reviewUpdateMutation.mutate({ id: update.id, status: 'rejected' })}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="text-sm">
          <p className="mb-2"><strong>سبب التحديث:</strong> {update.update_reason}</p>
          {update.old_content && (
            <div className="mb-2">
              <strong>المحتوى القديم:</strong>
              <div className="bg-red-50 p-2 rounded mt-1 text-xs">{update.old_content}</div>
            </div>
          )}
          <div>
            <strong>المحتوى الجديد:</strong>
            <div className="bg-green-50 p-2 rounded mt-1 text-xs">{update.new_content}</div>
          </div>
          {update.review_comments && (
            <div className="mt-2">
              <strong>تعليقات المراجعة:</strong>
              <div className="bg-blue-50 p-2 rounded mt-1 text-xs">{update.review_comments}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة التحديثات</h2>
          <p className="text-gray-600">مراجعة وإدارة تحديثات القوانين</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 ml-2" />
          إضافة تحديث جديد
        </Button>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            المعلقة ({pendingUpdates?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            جميع التحديثات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle>التحديثات المعلقة</CardTitle>
              <CardDescription>تحديثات تحتاج إلى مراجعة وموافقة</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingUpdates?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">لا توجد تحديثات معلقة</div>
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
          <Card>
            <CardHeader>
              <CardTitle>جميع التحديثات</CardTitle>
              <CardDescription>سجل شامل بجميع التحديثات</CardDescription>
            </CardHeader>
            <CardContent>
              {allUpdates?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">لا توجد تحديثات</div>
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
