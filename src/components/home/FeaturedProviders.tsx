
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Star, UserCheck, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface FeaturedProvidersProps {
  language: 'ar' | 'en';
}

export const FeaturedProviders = ({ language }: FeaturedProvidersProps) => {
  const navigate = useNavigate();
  const [featuredProviders, setFeaturedProviders] = useState<any[]>([]);

  const texts = {
    ar: {
      featuredProviders: "مقدمو الخدمات المميزون",
      viewAllProviders: "عرض جميع مقدمي الخدمات",
      yearsExperience: "سنوات خبرة"
    },
    en: {
      featuredProviders: "Featured Service Providers",
      viewAllProviders: "View All Providers",
      yearsExperience: "years experience"
    }
  };

  const t = texts[language];

  useEffect(() => {
    fetchFeaturedProviders();
  }, []);

  const fetchFeaturedProviders = async () => {
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_verified', true)
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(3);

      if (error) throw error;
      setFeaturedProviders(data || []);
    } catch (error) {
      console.error('Error fetching featured providers:', error);
    }
  };

  if (featuredProviders.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.featuredProviders}</h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {featuredProviders.map((provider) => (
          <Card 
            key={provider.id}
            className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-200 overflow-hidden"
            onClick={() => navigate('/service-providers')}
          >
            <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 pb-4">
              <div className={`flex items-start gap-4 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <UserCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className={`text-lg text-gray-900 font-bold leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {provider.first_name} {provider.last_name}
                  </CardTitle>
                  <p className={`text-sm text-blue-600 capitalize ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {provider.provider_type}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-4 pb-6">
              <div className="space-y-3">
                <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{provider.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-xs text-gray-500">({provider.total_consultations || 0} {language === 'ar' ? 'استشارة' : 'consultations'})</span>
                </div>
                
                {provider.specialties && provider.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {provider.specialties.slice(0, 2).map((specialty: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {provider.specialties.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.specialties.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-lg font-bold text-blue-600">
                    {provider.hourly_rate} {provider.currency || 'SAR'}
                  </span>
                  <span className="text-xs text-gray-500">
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
          onClick={() => navigate('/service-providers')}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3"
        >
          {t.viewAllProviders}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
