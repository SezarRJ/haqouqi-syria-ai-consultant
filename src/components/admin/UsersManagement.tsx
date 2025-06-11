
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, UserX, Shield, Users as UsersIcon, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UsersManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', searchTerm, roleFilter],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }

      if (roleFilter !== 'all') {
        query = query.eq('role', roleFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات المستخدم",
      });
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">
          <Activity className="h-3 w-3 ml-1" />نشط
        </Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">غير نشط</Badge>;
      case 'blocked':
        return <Badge variant="destructive">محظور</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleLabels: { [key: string]: string } = {
      individual: 'فرد',
      company: 'شركة',
      lawyer: 'محامي',
      judge: 'قاضي'
    };
    
    const getColorByRole = (role: string) => {
      switch(role) {
        case 'lawyer': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'judge': return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'company': return 'bg-orange-100 text-orange-800 border-orange-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
      }
    };

    return <Badge className={getColorByRole(role)}>{roleLabels[role] || role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <UsersIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">إدارة المستخدمين</h2>
            <p className="text-slate-600">مراقبة وإدارة حسابات المستخدمين</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-blue-800">{users?.length || 0}</p>
              </div>
              <UsersIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">المستخدمون النشطون</p>
                <p className="text-2xl font-bold text-green-800">
                  {users?.filter(u => u.status === 'active').length || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-medium">المحامون</p>
                <p className="text-2xl font-bold text-purple-800">
                  {users?.filter(u => u.role === 'lawyer').length || 0}
                </p>
              </div>
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">الشركات</p>
                <p className="text-2xl font-bold text-orange-800">
                  {users?.filter(u => u.role === 'company').length || 0}
                </p>
              </div>
              <UsersIcon className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-sm border-slate-200">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="البحث في المستخدمين..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48 border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="جميع الأدوار" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأدوار</SelectItem>
                <SelectItem value="individual">فرد</SelectItem>
                <SelectItem value="company">شركة</SelectItem>
                <SelectItem value="lawyer">محامي</SelectItem>
                <SelectItem value="judge">قاضي</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
          <CardTitle className="text-slate-800">قائمة المستخدمين</CardTitle>
          <CardDescription className="text-slate-600">
            إجمالي المستخدمين: {users?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-600">جارٍ التحميل...</p>
            </div>
          ) : users?.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <UsersIcon className="h-12 w-12 mx-auto mb-4 text-slate-400" />
              <p>لا توجد نتائج</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {users?.map((user) => (
                <div key={user.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-slate-400 to-slate-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium">
                            {user.full_name?.charAt(0) || user.email?.charAt(0) || '؟'}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800">{user.full_name || 'لا يوجد اسم'}</h3>
                          <p className="text-sm text-slate-600">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                      <div className="text-sm text-slate-500 space-y-1">
                        <p>تاريخ التسجيل: {new Date(user.created_at).toLocaleDateString('ar-SA')}</p>
                        {user.last_login && (
                          <p>آخر دخول: {new Date(user.last_login).toLocaleDateString('ar-SA')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.status === 'active' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserMutation.mutate({
                            id: user.id,
                            updates: { status: 'blocked' }
                          })}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <UserX className="h-4 w-4 ml-1" />
                          حظر
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserMutation.mutate({
                            id: user.id,
                            updates: { status: 'active' }
                          })}
                          className="border-green-300 text-green-600 hover:bg-green-50"
                        >
                          <UserCheck className="h-4 w-4 ml-1" />
                          تفعيل
                        </Button>
                      )}
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => updateUserMutation.mutate({
                          id: user.id,
                          updates: { role: newRole }
                        })}
                      >
                        <SelectTrigger className="w-32 border-slate-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">فرد</SelectItem>
                          <SelectItem value="company">شركة</SelectItem>
                          <SelectItem value="lawyer">محامي</SelectItem>
                          <SelectItem value="judge">قاضي</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
