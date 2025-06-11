
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, FileText, AlertCircle, TrendingUp, Settings, BookOpen } from 'lucide-react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { LawsManagement } from '@/components/admin/LawsManagement';
import { UpdatesManagement } from '@/components/admin/UpdatesManagement';
import { UsersManagement } from '@/components/admin/UsersManagement';
import { SystemSettings } from '@/components/admin/SystemSettings';
import { Analytics } from '@/components/admin/Analytics';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: adminCheck } = await supabase.rpc('is_admin', { user_id: user.id });
        setIsAdmin(adminCheck || false);
        
        if (!adminCheck) {
          toast({
            title: "غير مصرح",
            description: "ليس لديك صلاحية للوصول إلى لوحة الإدارة",
            variant: "destructive",
          });
        }
      }
    };

    checkAdmin();
  }, [toast]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">يرجى تسجيل الدخول للوصول إلى لوحة الإدارة</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">غير مصرح</h2>
            <p className="text-gray-600">ليس لديك صلاحية للوصول إلى لوحة الإدارة</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">لوحة إدارة المستشار القانوني</h1>
          <p className="text-gray-600">إدارة شاملة للنظام القانوني والمحتوى</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              لوحة التحكم
            </TabsTrigger>
            <TabsTrigger value="laws" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              إدارة القوانين
            </TabsTrigger>
            <TabsTrigger value="updates" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              التحديثات
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              المستخدمون
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              التحليلات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              الإعدادات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="laws">
            <LawsManagement />
          </TabsContent>

          <TabsContent value="updates">
            <UpdatesManagement />
          </TabsContent>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
