
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  MessageSquare, 
  FileText, 
  Calendar, 
  TrendingUp, 
  Star,
  Clock,
  Download,
  Share2,
  Edit
} from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'أحمد محمد الأحمد',
    email: 'ahmed@example.com',
    phone: '+963912345678',
    organization: 'مكتب المحاماة الأول',
    joinDate: 'مارس 2024',
    plan: 'المتقدم',
    avatar: ''
  });

  const stats = {
    totalConsultations: 47,
    successfulCases: 42,
    rating: 4.8,
    responseTime: '< 2 دقيقة',
    documentsAnalyzed: 23,
    lawsSearched: 156
  };

  const recentConsultations = [
    {
      id: 1,
      type: 'استشارة عقود',
      date: '2024-12-10',
      status: 'مكتملة',
      rating: 5
    },
    {
      id: 2,
      type: 'تحليل وثائق',
      date: '2024-12-08',
      status: 'مكتملة',
      rating: 4
    },
    {
      id: 3,
      type: 'بحث قانوني',
      date: '2024-12-05',
      status: 'مكتملة',
      rating: 5
    }
  ];

  const achievements = [
    {
      title: 'مستخدم متميز',
      description: 'أكمل 50 استشارة بنجاح',
      icon: '🏆',
      earned: true,
      progress: 94
    },
    {
      title: 'خبير القوانين',
      description: 'بحث في أكثر من 100 قانون',
      icon: '📚',
      earned: true,
      progress: 100
    },
    {
      title: 'محلل الوثائق',
      description: 'حلل 25 وثيقة قانونية',
      icon: '📋',
      earned: false,
      progress: 92
    },
    {
      title: 'نشط دائماً',
      description: 'استخدم النظام لمدة 30 يوم متتالي',
      icon: '⚡',
      earned: false,
      progress: 67
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-xl bg-blue-100 text-blue-600">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-gray-600">{profile.organization}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="default">{profile.plan}</Badge>
                    <span className="text-sm text-gray-500">عضو منذ {profile.joinDate}</span>
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit className="h-4 w-4 ml-2" />
                تعديل الملف
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{stats.totalConsultations}</div>
                <div className="text-sm text-gray-600">إجمالي الاستشارات</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Star className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{stats.rating}</div>
                <div className="text-sm text-gray-600">التقييم العام</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FileText className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{stats.documentsAnalyzed}</div>
                <div className="text-sm text-gray-600">وثائق محللة</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">{stats.responseTime}</div>
                <div className="text-sm text-gray-600">متوسط الاستجابة</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="consultations">الاستشارات</TabsTrigger>
            <TabsTrigger value="achievements">الإنجازات</TabsTrigger>
            <TabsTrigger value="settings">الإعدادات</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Activity Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>ملخص النشاط</CardTitle>
                  <CardDescription>إحصائيات استخدامك للنظام</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">الاستشارات المكتملة</span>
                    <span className="font-bold">{stats.successfulCases}/{stats.totalConsultations}</span>
                  </div>
                  <Progress value={(stats.successfulCases / stats.totalConsultations) * 100} />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">القوانين المبحوثة</span>
                    <span className="font-bold">{stats.lawsSearched}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">نسبة النجاح</span>
                    <Badge variant="default">{Math.round((stats.successfulCases / stats.totalConsultations) * 100)}%</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>النشاط الأخير</CardTitle>
                  <CardDescription>آخر الاستشارات والأنشطة</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{consultation.type}</p>
                          <p className="text-sm text-gray-600">{consultation.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{consultation.status}</Badge>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${i < consultation.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Consultations Tab */}
          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle>سجل الاستشارات</CardTitle>
                <CardDescription>جميع استشاراتك القانونية</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentConsultations.map((consultation) => (
                    <div key={consultation.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{consultation.type}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{consultation.status}</Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">التاريخ: {consultation.date}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">التقييم:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < consultation.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements">
            <Card>
              <CardHeader>
                <CardTitle>الإنجازات والشارات</CardTitle>
                <CardDescription>إنجازاتك في استخدام النظام</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`border rounded-lg p-4 ${achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div>
                          <h3 className={`font-semibold ${achievement.earned ? 'text-green-800' : 'text-gray-700'}`}>
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-gray-600">{achievement.description}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>التقدم</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <Progress value={achievement.progress} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الملف الشخصي</CardTitle>
                <CardDescription>إدارة معلوماتك الشخصية</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">الاسم الكامل</Label>
                    <Input 
                      id="name"
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">البريد الإلكتروني</Label>
                    <Input 
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">رقم الهاتف</Label>
                    <Input 
                      id="phone"
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="organization">المؤسسة</Label>
                    <Input 
                      id="organization"
                      value={profile.organization}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, organization: e.target.value})}
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-2 pt-4">
                    <Button onClick={() => setIsEditing(false)}>
                      حفظ التغييرات
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      إلغاء
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
