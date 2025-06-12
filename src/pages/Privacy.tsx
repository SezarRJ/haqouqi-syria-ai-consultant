
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Database, Users, Save, ArrowLeft } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    dataSharing: false,
    analyticsTracking: true,
    marketingEmails: false,
    publicProfile: false,
    searchIndexing: true,
    contactPermission: true,
    locationTracking: false
  });

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSave = () => {
    // Save privacy settings to localStorage or backend
    localStorage.setItem('privacySettings', JSON.stringify(privacySettings));
    toast({
      title: language === 'ar' ? "تم الحفظ" : "Saved",
      description: language === 'ar' ? "تم حفظ إعدادات الخصوصية بنجاح" : "Privacy settings saved successfully",
    });
  };

  const updateSetting = (key: string, value: boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const texts = {
    ar: {
      title: 'الخصوصية والأمان',
      description: 'تحكم في خصوصية بياناتك وأمان حسابك',
      backToHome: 'العودة للرئيسية',
      profilePrivacy: 'خصوصية الملف الشخصي',
      dataPrivacy: 'خصوصية البيانات',
      communicationPrivacy: 'خصوصية التواصل',
      profileVisibility: 'رؤية الملف الشخصي',
      profileVisibilityDesc: 'السماح للآخرين برؤية ملفك الشخصي',
      publicProfile: 'الملف الشخصي العام',
      publicProfileDesc: 'جعل ملفك الشخصي متاحاً للعامة',
      searchIndexing: 'فهرسة البحث',
      searchIndexingDesc: 'السماح بظهور ملفك في نتائج البحث',
      dataSharing: 'مشاركة البيانات',
      dataSharingDesc: 'مشاركة البيانات مع الشركاء الموثوقين',
      analyticsTracking: 'تتبع التحليلات',
      analyticsTrackingDesc: 'المساعدة في تحسين الخدمة من خلال التحليلات',
      locationTracking: 'تتبع الموقع',
      locationTrackingDesc: 'السماح بتتبع موقعك لتحسين الخدمات',
      marketingEmails: 'رسائل البريد التسويقية',
      marketingEmailsDesc: 'استلام رسائل تسويقية وعروض خاصة',
      contactPermission: 'إذن التواصل',
      contactPermissionDesc: 'السماح للمستخدمين الآخرين بالتواصل معك',
      save: 'حفظ التغييرات'
    },
    en: {
      title: 'Privacy & Security',
      description: 'Control your data privacy and account security',
      backToHome: 'Back to Home',
      profilePrivacy: 'Profile Privacy',
      dataPrivacy: 'Data Privacy',
      communicationPrivacy: 'Communication Privacy',
      profileVisibility: 'Profile Visibility',
      profileVisibilityDesc: 'Allow others to see your profile',
      publicProfile: 'Public Profile',
      publicProfileDesc: 'Make your profile publicly available',
      searchIndexing: 'Search Indexing',
      searchIndexingDesc: 'Allow your profile to appear in search results',
      dataSharing: 'Data Sharing',
      dataSharingDesc: 'Share data with trusted partners',
      analyticsTracking: 'Analytics Tracking',
      analyticsTrackingDesc: 'Help improve service through analytics',
      locationTracking: 'Location Tracking',
      locationTrackingDesc: 'Allow location tracking to improve services',
      marketingEmails: 'Marketing Emails',
      marketingEmailsDesc: 'Receive marketing emails and special offers',
      contactPermission: 'Contact Permission',
      contactPermissionDesc: 'Allow other users to contact you',
      save: 'Save Changes'
    }
  };

  const t = texts[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className={`flex items-center gap-4 mb-6 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backToHome}
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-gray-600">{t.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Profile Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-blue-600" />
                {t.profilePrivacy}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="profile-visibility" className="text-base font-medium">
                    {t.profileVisibility}
                  </Label>
                  <p className="text-sm text-gray-600">{t.profileVisibilityDesc}</p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={privacySettings.profileVisibility}
                  onCheckedChange={(checked) => updateSetting('profileVisibility', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="public-profile" className="text-base font-medium">
                    {t.publicProfile}
                  </Label>
                  <p className="text-sm text-gray-600">{t.publicProfileDesc}</p>
                </div>
                <Switch
                  id="public-profile"
                  checked={privacySettings.publicProfile}
                  onCheckedChange={(checked) => updateSetting('publicProfile', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="search-indexing" className="text-base font-medium">
                    {t.searchIndexing}
                  </Label>
                  <p className="text-sm text-gray-600">{t.searchIndexingDesc}</p>
                </div>
                <Switch
                  id="search-indexing"
                  checked={privacySettings.searchIndexing}
                  onCheckedChange={(checked) => updateSetting('searchIndexing', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="h-5 w-5 text-purple-600" />
                {t.dataPrivacy}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="data-sharing" className="text-base font-medium">
                    {t.dataSharing}
                  </Label>
                  <p className="text-sm text-gray-600">{t.dataSharingDesc}</p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={privacySettings.dataSharing}
                  onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="analytics-tracking" className="text-base font-medium">
                    {t.analyticsTracking}
                  </Label>
                  <p className="text-sm text-gray-600">{t.analyticsTrackingDesc}</p>
                </div>
                <Switch
                  id="analytics-tracking"
                  checked={privacySettings.analyticsTracking}
                  onCheckedChange={(checked) => updateSetting('analyticsTracking', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="location-tracking" className="text-base font-medium">
                    {t.locationTracking}
                  </Label>
                  <p className="text-sm text-gray-600">{t.locationTrackingDesc}</p>
                </div>
                <Switch
                  id="location-tracking"
                  checked={privacySettings.locationTracking}
                  onCheckedChange={(checked) => updateSetting('locationTracking', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Communication Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Users className="h-5 w-5 text-orange-600" />
                {t.communicationPrivacy}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="marketing-emails" className="text-base font-medium">
                    {t.marketingEmails}
                  </Label>
                  <p className="text-sm text-gray-600">{t.marketingEmailsDesc}</p>
                </div>
                <Switch
                  id="marketing-emails"
                  checked={privacySettings.marketingEmails}
                  onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
                />
              </div>

              <Separator />

              <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="space-y-1">
                  <Label htmlFor="contact-permission" className="text-base font-medium">
                    {t.contactPermission}
                  </Label>
                  <p className="text-sm text-gray-600">{t.contactPermissionDesc}</p>
                </div>
                <Switch
                  id="contact-permission"
                  checked={privacySettings.contactPermission}
                  onCheckedChange={(checked) => updateSetting('contactPermission', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-center">
            <Button onClick={handleSave} className="flex items-center gap-2 px-8 py-3">
              <Save className="h-4 w-4" />
              {t.save}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
