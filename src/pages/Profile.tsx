
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  Briefcase, 
  Star,
  FileText,
  Clock,
  Settings as SettingsIcon
} from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'محمد أحمد السعد',
    email: 'mohammed.ahmed@example.com',
    phone: '+966501234567',
    location: 'الرياض، المملكة العربية السعودية',
    profession: 'محامي متخصص في القانون التجاري',
    experience: '8 سنوات',
    bio: 'محامي معتمد مع خبرة واسعة في القانون التجاري والشركات. متخصص في العقود التجارية وقانون الاستثمار.',
    joinDate: '2020-03-15',
    consultations: 156,
    rating: 4.8,
    specializations: ['القانون التجاري', 'قانون الشركات', 'العقود', 'الاستثمار']
  });

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "تم الحفظ",
      description: "تم تحديث معلومات الملف الشخصي بنجاح",
    });
  };

  const recentActivity = [
    {
      id: 1,
      type: 'consultation',
      description: 'استشارة قانونية حول عقد شراكة',
      date: '2024-01-20',
      status: 'مكتملة'
    },
    {
      id: 2,
      type: 'document',
      description: 'تحليل وثيقة قانونية',
      date: '2024-01-19',
      status: 'مكتملة'
    },
    {
      id: 3,
      type: 'search',
      description: 'بحث في قانون العمل',
      date: '2024-01-18',
      status: 'مكتملة'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">الملف الشخصي</h1>
            <p className="text-gray-600">إدارة معلوماتك الشخصية والمهنية</p>
          </div>
          <BackButton />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <User className="h-12 w-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold mb-2">{profile.fullName}</h2>
                <p className="text-gray-600 mb-4">{profile.profession}</p>
                
                <div className="flex justify-center items-center gap-2 mb-4">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{profile.rating}</span>
                  <span className="text-gray-500">({profile.consultations} استشارة)</span>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {profile.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  className="w-full"
                  variant={isEditing ? "outline" : "default"}
                >
                  {isEditing ? 'إلغاء التعديل' : 'تعديل الملف الشخصي'}
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">إحصائيات سريعة</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">الاستشارات</span>
                  </div>
                  <span className="font-medium">{profile.consultations}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">التقييم</span>
                  </div>
                  <span className="font-medium">{profile.rating}/5.0</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-500" />
                    <span className="text-sm">تاريخ الانضمام</span>
                  </div>
                  <span className="font-medium">
                    {new Date(profile.joinDate).toLocaleDateString('ar-SA')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">المعلومات الشخصية</TabsTrigger>
                <TabsTrigger value="professional">المعلومات المهنية</TabsTrigger>
                <TabsTrigger value="activity">النشاط الأخير</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="personal">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات الشخصية</CardTitle>
                    <CardDescription>إدارة معلوماتك الشخصية الأساسية</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          الاسم الكامل
                        </Label>
                        <Input
                          id="fullName"
                          value={profile.fullName}
                          onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          البريد الإلكتروني
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          رقم الهاتف
                        </Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          الموقع
                        </Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSave}>
                          حفظ التغييرات
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Professional Information */}
              <TabsContent value="professional">
                <Card>
                  <CardHeader>
                    <CardTitle>المعلومات المهنية</CardTitle>
                    <CardDescription>إدارة معلوماتك المهنية والتخصصات</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="profession" className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        المهنة
                      </Label>
                      <Input
                        id="profession"
                        value={profile.profession}
                        onChange={(e) => setProfile(prev => ({ ...prev, profession: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="experience" className="flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        سنوات الخبرة
                      </Label>
                      <Input
                        id="experience"
                        value={profile.experience}
                        onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="bio">نبذة تعريفية</Label>
                      <Textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                        disabled={!isEditing}
                        rows={4}
                      />
                    </div>

                    {isEditing && (
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          إلغاء
                        </Button>
                        <Button onClick={handleSave}>
                          حفظ التغييرات
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Recent Activity */}
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle>النشاط الأخير</CardTitle>
                    <CardDescription>آخر الأنشطة والاستشارات</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              {activity.type === 'consultation' && <FileText className="h-4 w-4 text-blue-600" />}
                              {activity.type === 'document' && <FileText className="h-4 w-4 text-green-600" />}
                              {activity.type === 'search' && <SettingsIcon className="h-4 w-4 text-purple-600" />}
                            </div>
                            <div>
                              <p className="font-medium">{activity.description}</p>
                              <p className="text-sm text-gray-600 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(activity.date).toLocaleDateString('ar-SA')}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
