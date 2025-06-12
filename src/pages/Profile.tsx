
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Mail, Phone, MapPin, Calendar, Save, Trash2, AlertTriangle } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const Profile = () => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [profile, setProfile] = useState({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    joinDate: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile({
          displayName: user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: user.user_metadata?.phone || '',
          location: user.user_metadata?.location || '',
          bio: user.user_metadata?.bio || '',
          joinDate: new Date(user.created_at).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.displayName,
          phone: profile.phone,
          location: profile.location,
          bio: profile.bio
        }
      });

      if (error) throw error;

      toast({
        title: language === 'ar' ? "تم الحفظ" : "Saved",
        description: language === 'ar' ? "تم حفظ الملف الشخصي بنجاح" : "Profile saved successfully",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "فشل في حفظ الملف الشخصي" : "Failed to save profile",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleDeleteAccount = async () => {
    try {
      // Note: Supabase doesn't have a direct method to delete user accounts from client-side
      // This would typically require an admin function or direct database operation
      toast({
        title: language === 'ar' ? "طلب حذف الحساب" : "Account Deletion Request",
        description: language === 'ar' ? "تم إرسال طلب حذف الحساب. سيتم التواصل معك قريباً" : "Account deletion request has been sent. We will contact you shortly",
      });
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "فشل في حذف الحساب" : "Failed to delete account",
        variant: "destructive",
      });
    }
  };

  const texts = {
    ar: {
      title: 'الملف الشخصي',
      description: 'إدارة معلوماتك الشخصية وإعدادات الحساب',
      personalInfo: 'المعلومات الشخصية',
      displayName: 'الاسم المعروض',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      location: 'الموقع',
      bio: 'نبذة تعريفية',
      joinDate: 'تاريخ الانضمام',
      save: 'حفظ التغييرات',
      dangerZone: 'المنطقة الخطرة',
      deleteAccount: 'حذف الحساب',
      deleteAccountDesc: 'حذف حسابك نهائياً. هذا الإجراء لا يمكن التراجع عنه.',
      deleteConfirmTitle: 'تأكيد حذف الحساب',
      deleteConfirmDesc: 'هل أنت متأكد من رغبتك في حذف حسابك؟ سيتم حذف جميع بياناتك نهائياً ولا يمكن استردادها.',
      cancel: 'إلغاء',
      delete: 'حذف',
      member: 'عضو منذ'
    },
    en: {
      title: 'Profile',
      description: 'Manage your personal information and account settings',
      personalInfo: 'Personal Information',
      displayName: 'Display Name',
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      bio: 'Bio',
      joinDate: 'Join Date',
      save: 'Save Changes',
      dangerZone: 'Danger Zone',
      deleteAccount: 'Delete Account',
      deleteAccountDesc: 'Permanently delete your account. This action cannot be undone.',
      deleteConfirmTitle: 'Confirm Account Deletion',
      deleteConfirmDesc: 'Are you sure you want to delete your account? All your data will be permanently removed and cannot be recovered.',
      cancel: 'Cancel',
      delete: 'Delete',
      member: 'Member since'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gray-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.description}</p>
          </div>
          <BackButton />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header */}
          <Card>
            <CardContent className="pt-6">
              <div className={`flex items-center gap-6 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="h-20 w-20">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">
                    {profile.displayName ? profile.displayName.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.displayName || profile.email?.split('@')[0]}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {t.member} {profile.joinDate}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="h-5 w-5 text-blue-600" />
                {t.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="displayName">{t.displayName}</Label>
                  <Input
                    id="displayName"
                    value={profile.displayName}
                    onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.email}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.phone}</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">{t.location}</Label>
                  <Input
                    id="location"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">{t.bio}</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  rows={4}
                />
              </div>
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {t.save}
              </Button>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                {t.dangerZone}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h3 className="font-medium text-red-900">{t.deleteAccount}</h3>
                  <p className="text-sm text-red-700">{t.deleteAccountDesc}</p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      {t.deleteAccount}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t.deleteConfirmDesc}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {t.delete}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
