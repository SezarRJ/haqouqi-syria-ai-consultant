// src/pages/ServiceProviderListPage.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { HomeHeader } from '@/components/home/HomeHeader'; // Re-use HomeHeader
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, User, Briefcase, DollarSign, ExternalLink } from 'lucide-react';
import { BackButton } from '@/components/BackButton';

// Define a simple type for a provider (adjust based on your service_providers table)
interface ServiceProvider {
  id: string;
  first_name: string;
  last_name: string;
  provider_type: 'lawyer' | 'judge';
  specialties: string[];
  hourly_rate: number;
  rating: number;
  total_consultations: number;
  bio?: string;
  // Add other fields you want to display on the card
}

const ServiceProviderListPage = () => {
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProviders = async () => {
      setIsLoading(true);
      // Fetch only verified and active providers
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, first_name, last_name, provider_type, specialties, hourly_rate, rating, total_consultations, bio')
        .eq('is_verified', true)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching service providers:', error);
        // Handle error (e.g., show a toast)
      } else {
        setProviders(data as ServiceProvider[]);
      }
      setIsLoading(false);
    };

    fetchProviders();

    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const t = {
    ar: {
      title: 'مقدمو الخدمات القانونية',
      description: 'ابحث عن محامين وقضاة خبراء.',
      loading: 'جاري تحميل مقدمي الخدمات...',
      noProviders: 'لا يوجد مقدمو خدمات متاحون حاليًا.',
      hourlyRate: 'الرسوم بالساعة',
      consultations: 'استشارة',
      rating: 'التقييم',
      viewProfile: 'عرض الملف الشخصي',
      lawyer: 'محامي',
      judge: 'قاضي',
      specialties: 'التخصصات'
    },
    en: {
      title: 'Legal Service Providers',
      description: 'Find expert lawyers and judges.',
      loading: 'Loading service providers...',
      noProviders: 'No service providers currently available.',
      hourlyRate: 'Hourly Rate',
      consultations: 'Consultations',
      rating: 'Rating',
      viewProfile: 'View Profile',
      lawyer: 'Lawyer',
      judge: 'Judge',
      specialties: 'Specialties'
    }
  }[language];

  const handleViewProfile = (providerId: string) => {
    navigate(`/providers/${providerId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <HomeHeader user={null} language={language} /> {/* Pass null user as this page might be public */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{t.description}</p>
          </div>
          <BackButton />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            <span>{t.loading}</span>
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-10 text-gray-600 dark:text-gray-400">
            <p>{t.noProviders}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    <User className="inline-block mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
                    {provider.first_name} {provider.last_name}
                  </CardTitle>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    {provider.provider_type === 'lawyer' ? t.lawyer : t.judge}
                  </span>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{provider.rating.toFixed(2)} ({provider.total_consultations} {t.consultations})</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <Briefcase className="inline-block mr-1 h-4 w-4 text-gray-500" />
                    {t.specialties}: {provider.specialties?.join(', ') || 'N/A'}
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    <DollarSign className="inline-block mr-1 h-5 w-5" />
                    {provider.hourly_rate.toFixed(2)} SAR/{t.hourlyRate}
                  </p>
                  <Button
                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white"
                    onClick={() => handleViewProfile(provider.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    {t.viewProfile}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderListPage;
