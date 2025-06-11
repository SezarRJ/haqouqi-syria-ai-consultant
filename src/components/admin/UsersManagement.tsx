
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, UserCheck, UserX, Shield } from 'lucide-react';
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
        return <Badge variant="default">نشط</Badge>;
      case 'inactive':
        return <Badge variant="secondary">غير نشط</Badge>;
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
    return <Badge variant="outline">{roleLabels[role] || role}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
          <p className="text-gray-600">مراقبة وإدارة حسابات المستخدمين</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث في المستخدمين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48">
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة المستخدمين</CardTitle>
          <CardDescription>
            إجمالي المستخدمين: {users?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">جارٍ التحميل...</div>
          ) : users?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد نتائج</div>
          ) : (
            <div className="space-y-4">
              {users?.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{user.full_name || 'لا يوجد اسم'}</h3>
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">البريد الإلكتروني: {user.email}</p>
                      <p className="text-sm text-gray-500">
                        تاريخ التسجيل: {new Date(user.created_at).toLocaleDateString('ar-SA')}
                      </p>
                      {user.last_login && (
                        <p className="text-sm text-gray-500">
                          آخر دخول: {new Date(user.last_login).toLocaleDateString('ar-SA')}
                        </p>
                      )}
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
                        >
                          <UserX className="h-4 w-4" />
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
                        >
                          <UserCheck className="h-4 w-4" />
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
                        <SelectTrigger className="w-32">
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
