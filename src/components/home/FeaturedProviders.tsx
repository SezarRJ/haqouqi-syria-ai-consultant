import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, UserCheck, ArrowRight, Loader2 } from 'lucide-react'; // Added Loader2
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedProvidersProps {
  language: 'ar' | 'en';
}

interface FeaturedProvider {
  id: string;
  first_name: string;
  last_name: string;
  provider_type: 'lawyer' | 'judge';
  specialties: string[];
  hourly_rate: number;
  rating: number;
  total_consultations: number;
  experience_years: number; // Added this as it's used in rendering
}

export const FeaturedProviders = ({ language }: FeaturedProvidersProps) => {
  const navigate = useNavigate();
  const [featuredProviders, setFeaturedProviders] = useState<FeaturedProvider[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state

  const texts = {
    ar: {
      featuredProviders: "مقدمو الخدمات المميزون",
      viewAllProviders: "عرض جميع مقدمي الخدمات",
      yearsExperience: "سنوات خبرة",
      consultation: "استشارة",
      loading: 'جاري تحميل مقدمي الخدمات المميزين...',
      noProviders: 'لا يوجد مقدمو خدمات مميزون حاليًا.',
      lawyerType: "محامي",
      judgeType: "قاضي",
      specialtiesText: "التخصصات",
      hourlyRateText: "للساعة",
    },
    en: {
      featuredProviders: "Featured Service Providers",
      viewAllProviders: "View All Providers",
      yearsExperience: "years experience",
      consultation: "consultation",
      loading: 'Loading featured providers...',
      noProviders: 'No featured providers available.',
      lawyerType: "Lawyer",
      judgeType: "Judge",
      specialtiesText: "Specialties",
      hourlyRateText: "per hour",
    }
  };

  const t = texts[language];

  // Sample providers data (as fallback)
  const sampleProviders: FeaturedProvider[] = [
    {
      id: 'sample-1',
      first_name: language === 'ar' ? 'أحمد' : 'Ahmed',
      last_name: language === 'ar' ? 'السوري' : 'Al-Souri',
      provider_type: 'lawyer',
      rating: 4.8,
      total_consultations: 150,
      specialties: language === 'ar' ? ['القانون المدني', 'القانون التجاري'] : ['Civil Law', 'Commercial Law'],
      hourly_rate: 200,
      currency: 'SAR',
      experience_years: 10
    },
    {
      id: 'sample-2',
      first_name: language === 'ar' ? 'فاطمة' : 'Fatima',
      last_name: language === 'ar' ? 'الأحمد' : 'Al-Ahmad',
      provider_type: 'judge', // Changed to judge for variety
      rating: 4.9,
      total_consultations: 200,
      specialties: language === 'ar' ? ['قانون الأسرة', 'الأحوال الشخصية'] : ['Family Law', 'Personal Status'],
      hourly_rate: 180,
      currency: 'SAR',
      experience_years: 8
    },
    {
      id: 'sample-3',
      first_name: language === 'ar' ? 'محمد' : 'Mohammed',
      last_name: language === 'ar' ? 'الخليل' : 'Al-Khalil',
      provider_type: 'lawyer',
      rating: 4.7,
      total_consultations: 120,
      specialties: language === 'ar' ? ['القانون الجنائي', 'القانون الإداري'] : ['Criminal Law', 'Administrative Law'],
      hourly_rate: 250,
      currency: 'SAR',
      experience_years: 12
    }
  ];

  useEffect(() => {
    fetchFeaturedProviders();
  }, [language]); // Re-fetch if language changes to update sample data display

  const fetchFeaturedProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('id, first_name, last_name, provider_type, specialties, hourly_rate, rating, total_consultations, experience_years, currency')
        .eq('is_verified', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching featured providers:', error);
        setFeaturedProviders(sampleProviders); // Fallback to sample data on error
      } else {
        setFeaturedProviders((data as FeaturedProvider[]) || sampleProviders); // Use fetched data or fallback
      }
    } catch (error) {
      console.error('Unexpected error fetching featured providers:', error);
      setFeaturedProviders(sampleProviders); // Fallback on unexpected errors too
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t.featuredProviders}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-500 dark:text-gray-400">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          <span>{t.loading}</span>
        </div>
      ) : featuredProviders.length === 0 ? (
        <div className="text-center py-10 text-gray-600 dark:text-gray-400">
          <p>{t.noProviders}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {featuredProviders.map((provider) => (
            <Card
              key={provider.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-200 dark:border-gray-700 dark:bg-gray-800"
              onClick={() => navigate(`/providers/${provider.id}`)} // Navigate to individual profile
            >
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-900 pb-4">
                <div className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`text-lg text-gray-900 dark:text-gray-100 font-bold leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {provider.first_name} {provider.last_name}
                    </CardTitle>
                    <p className={`text-sm text-blue-600 dark:text-blue-400 capitalize ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {provider.provider_type === 'lawyer' ? t.lawyerType : t.judgeType}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 pb-6">
                <div className="space-y-3">
                  <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{provider.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">({provider.total_consultations || 0} {t.consultation})</span>
                  </div>

                  {provider.specialties && provider.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <p className={`text-sm font-semibold text-gray-800 dark:text-gray-100 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {t.specialtiesText}:
                      </p>
                      {provider.specialties.slice(0, 2).map((specialty: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                          {specialty}
                        </Badge>
                      ))}
                      {provider.specialties.length > 2 && (
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-200">
                          +{provider.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {provider.hourly_rate} {provider.currency || 'SAR'}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {provider.experience_years || 0} {t.yearsExperience}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            onClick={() => navigate('/providers')} // Navigate to the full list page
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600"
          >
            {t.viewAllProviders}
            <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'mr-2' : 'ml-2'}`} />
          </Button>
        </div>
      )}
    </div>
  );
};
