
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, MessageSquare, FileText, ThumbsUp, ThumbsDown } from 'lucide-react';

export const Analytics = () => {
  const { data: dailyStats } = useQuery({
    queryKey: ['daily-stats'],
    queryFn: async () => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const statsPromises = last7Days.map(async (date) => {
        const { count } = await supabase
          .from('consultations')
          .select('id', { count: 'exact' })
          .gte('created_at', `${date}T00:00:00`)
          .lt('created_at', `${date}T23:59:59`);

        return {
          date: new Date(date).toLocaleDateString('ar-SA', { weekday: 'short' }),
          consultations: count || 0
        };
      });

      return Promise.all(statsPromises);
    }
  });

  const { data: consultationTypes } = useQuery({
    queryKey: ['consultation-types'],
    queryFn: async () => {
      const types = ['chat', 'document_analysis', 'search'];
      const typeStats = await Promise.all(
        types.map(async (type) => {
          const { count } = await supabase
            .from('consultations')
            .select('id', { count: 'exact' })
            .eq('consultation_type', type);

          return {
            name: type === 'chat' ? 'محادثة' : type === 'document_analysis' ? 'تحليل وثائق' : 'بحث',
            value: count || 0
          };
        })
      );

      return typeStats;
    }
  });

  const { data: userFeedback } = useQuery({
    queryKey: ['user-feedback'],
    queryFn: async () => {
      const [positive, negative] = await Promise.all([
        supabase.from('consultations').select('id', { count: 'exact' }).eq('user_feedback', 1),
        supabase.from('consultations').select('id', { count: 'exact' }).eq('user_feedback', -1)
      ]);

      return {
        positive: positive.count || 0,
        negative: negative.count || 0
      };
    }
  });

  const { data: topLaws } = useQuery({
    queryKey: ['top-laws'],
    queryFn: async () => {
      // This would require more complex querying in a real implementation
      // For now, return mock data
      return [
        { name: 'القانون المدني', searches: 245 },
        { name: 'قانون العقوبات', searches: 189 },
        { name: 'قانون التجارة', searches: 156 },
        { name: 'قانون العمل', searches: 134 },
        { name: 'القانون الإداري', searches: 98 }
      ];
    }
  });

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">التحليلات والإحصائيات</h2>
          <p className="text-gray-600">نظرة شاملة على أداء النظام واستخدامه</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">الاستشارات اليوم</p>
                <p className="text-2xl font-bold">{dailyStats?.[6]?.consultations || 0}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التقييم الإيجابي</p>
                <p className="text-2xl font-bold text-green-600">{userFeedback?.positive || 0}</p>
              </div>
              <ThumbsUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">التقييم السلبي</p>
                <p className="text-2xl font-bold text-red-600">{userFeedback?.negative || 0}</p>
              </div>
              <ThumbsDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">معدل الرضا</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userFeedback ? 
                    Math.round((userFeedback.positive / (userFeedback.positive + userFeedback.negative)) * 100) || 0
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Consultations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>الاستشارات اليومية</CardTitle>
            <CardDescription>عدد الاستشارات خلال آخر 7 أيام</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="consultations" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Consultation Types Chart */}
        <Card>
          <CardHeader>
            <CardTitle>أنواع الاستشارات</CardTitle>
            <CardDescription>توزيع أنواع الاستشارات</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={consultationTypes}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {consultationTypes?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Laws Chart */}
        <Card>
          <CardHeader>
            <CardTitle>أكثر القوانين بحثاً</CardTitle>
            <CardDescription>القوانين الأكثر استفساراً</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topLaws} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="searches" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card>
          <CardHeader>
            <CardTitle>صحة النظام</CardTitle>
            <CardDescription>مؤشرات أداء النظام</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">قاعدة البيانات</span>
                <Badge variant="default">متصلة</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">خدمة الذكاء الاصطناعي</span>
                <Badge variant="default">نشطة</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">زمن الاستجابة</span>
                <Badge variant="secondary">< 2 ثانية</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">استخدام الخادم</span>
                <Badge variant="secondary">65%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
