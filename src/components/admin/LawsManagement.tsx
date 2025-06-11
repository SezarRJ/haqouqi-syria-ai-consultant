
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Law {
  id: string;
  name: string;
  number: string;
  year: number;
  category: string;
  description: string;
  status: string;
  created_at: string;
}

export const LawsManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingLaw, setEditingLaw] = useState<Law | null>(null);

  const { data: laws, isLoading } = useQuery({
    queryKey: ['laws', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('laws')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`name.ilike.%${searchTerm}%,number.ilike.%${searchTerm}%`);
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const addLawMutation = useMutation({
    mutationFn: async (lawData: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('laws')
        .insert([{ ...lawData, created_by: user?.id }]);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laws'] });
      setIsAddDialogOpen(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة القانون بنجاح",
      });
    }
  });

  const updateLawMutation = useMutation({
    mutationFn: async ({ id, ...updates }: any) => {
      const { data, error } = await supabase
        .from('laws')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laws'] });
      setEditingLaw(null);
      toast({
        title: "تم بنجاح",
        description: "تم تحديث القانون بنجاح",
      });
    }
  });

  const deleteLawMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('laws')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['laws'] });
      toast({
        title: "تم بنجاح",
        description: "تم حذف القانون بنجاح",
      });
    }
  });

  const LawForm = ({ law, onSubmit }: { law?: Law | null; onSubmit: (data: any) => void }) => {
    const [formData, setFormData] = useState({
      name: law?.name || '',
      number: law?.number || '',
      year: law?.year || new Date().getFullYear(),
      category: law?.category || '',
      description: law?.description || '',
      status: law?.status || 'active'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">اسم القانون</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="number">رقم القانون</Label>
            <Input
              id="number"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="year">سنة الإصدار</Label>
            <Input
              id="year"
              type="number"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="category">الفئة</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="اختر الفئة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="civil">مدني</SelectItem>
              <SelectItem value="criminal">جنائي</SelectItem>
              <SelectItem value="commercial">تجاري</SelectItem>
              <SelectItem value="administrative">إداري</SelectItem>
              <SelectItem value="constitutional">دستوري</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">الوصف</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <Label htmlFor="status">الحالة</Label>
          <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">نشط</SelectItem>
              <SelectItem value="inactive">غير نشط</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="submit">
            {law ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">إدارة القوانين</h2>
          <p className="text-gray-600">إضافة وتعديل وإدارة القوانين في النظام</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 ml-2" />
              إضافة قانون جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>إضافة قانون جديد</DialogTitle>
              <DialogDescription>أدخل تفاصيل القانون الجديد</DialogDescription>
            </DialogHeader>
            <LawForm onSubmit={(data) => addLawMutation.mutate(data)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="البحث في القوانين..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="جميع الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            <SelectItem value="civil">مدني</SelectItem>
            <SelectItem value="criminal">جنائي</SelectItem>
            <SelectItem value="commercial">تجاري</SelectItem>
            <SelectItem value="administrative">إداري</SelectItem>
            <SelectItem value="constitutional">دستوري</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Laws Table */}
      <Card>
        <CardHeader>
          <CardTitle>قائمة القوانين</CardTitle>
          <CardDescription>
            إجمالي القوانين: {laws?.length || 0}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">جارٍ التحميل...</div>
          ) : laws?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">لا توجد قوانين</div>
          ) : (
            <div className="space-y-4">
              {laws?.map((law) => (
                <div key={law.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{law.name}</h3>
                        <Badge variant={law.status === 'active' ? 'default' : 'secondary'}>
                          {law.status === 'active' ? 'نشط' : 'غير نشط'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        رقم القانون: {law.number} | السنة: {law.year} | الفئة: {law.category}
                      </p>
                      <p className="text-sm text-gray-500">{law.description}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        تاريخ الإضافة: {new Date(law.created_at).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Dialog open={editingLaw?.id === law.id} onOpenChange={(open) => setEditingLaw(open ? law : null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>تعديل القانون</DialogTitle>
                            <DialogDescription>تعديل تفاصيل القانون</DialogDescription>
                          </DialogHeader>
                          <LawForm 
                            law={editingLaw} 
                            onSubmit={(data) => updateLawMutation.mutate({ id: law.id, ...data })} 
                          />
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          if (confirm('هل أنت متأكد من حذف هذا القانون؟')) {
                            deleteLawMutation.mutate(law.id);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      {editingLaw && (
        <Dialog open={!!editingLaw} onOpenChange={() => setEditingLaw(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل القانون</DialogTitle>
              <DialogDescription>تعديل تفاصيل القانون</DialogDescription>
            </DialogHeader>
            <LawForm 
              law={editingLaw} 
              onSubmit={(data) => updateLawMutation.mutate({ id: editingLaw.id, ...data })} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
