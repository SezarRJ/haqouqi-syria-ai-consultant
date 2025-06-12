
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ArrowLeft, Search, Star, UserCheck, Filter, Users, MessageSquare } from 'lucide-react';

interface ServiceProvider {
  id: string;
  first_name: string;
  last_name: string;
  provider_type: 'lawyer' | 'judge';
  specialties: string[];
  activities: string[];
  bio: string;
  experience_years: number;
  hourly_rate: number;
  currency: string;
  rating: number;
  total_consultations: number;
  is_verified: boolean;
  is_active: boolean;
}

const ServiceProvidersPage = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lawyer' | 'judge'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price_low' | 'price_high'>('rating');
  const [language] = useState<'ar' | 'en'>('ar');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('is_verified', true)
        .eq('is_active', true)
        .order('rating', { ascending: false });

      if (error) throw error;

      const typedProviders = (data || []).map(provider => ({
        ...provider,
        provider_type: provider.provider_type as 'lawyer' | 'judge'
      })) as ServiceProvider[];

      setProviders(typedProviders);
    } catch (error) {
      console.error('Error fetching providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProviders = providers
    .filter(provider => {
      const matchesSearch = searchTerm === '' || 
        provider.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesType = filterType === 'all' || provider.provider_type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience_years - a.experience_years;
        case 'price_low':
          return a.hourly_rate - b.hourly_rate;
        case 'price_high':
          return b.hourly_rate - a.hourly_rate;
        default:
          return 0;
      }
    });

  const texts = {
    ar: {
      title: "مقدمو الخدمات القانونية",
      subtitle: "اختر من بين أفضل المحامين والقضاة المتخصصين",
      search: "البحث عن مقدم خدمة...",
      filterAll: "الكل",
      filterLawyer: "محامي",
      filterJudge: "قاضي",
      sortByRating: "الأعلى تقييماً",
      sortByExperience: "الأكثر خبرة",
      sortByPriceLow: "السعر من الأقل للأعلى",
      sortByPriceHigh: "السعر من الأعلى للأقل",
      yearsExperience: "سنوات خبرة",
      consultations: "استشارة",
      hourlyRate: "الساعة",
      bookConsultation: "احجز استشارة",
      verified: "موثق",
      specialties: "التخصصات",
      services: "الخدمات",
      sortBy: "ترتيب حسب",
      filterBy: "تصفية حسب"
    },
    en: {
      title: "Legal Service Providers",
      subtitle: "Choose from the best specialized lawyers and judges",
      search: "Search for a provider...",
      filterAll: "All",
      filterLawyer: "Lawyer",
      filterJudge: "Judge",
      sortByRating: "Highest Rated",
      sortByExperience: "Most Experienced",
      sortByPriceLow: "Price: Low to High",
      sortByPriceHigh: "Price: High to Low",
      yearsExperience: "years experience",
      consultations: "consultations",
      hourlyRate: "per hour",
      bookConsultation: "Book Consultation",
      verified: "Verified",
      specialties: "Specialties",
      services: "Services",
      sortBy: "Sort by",
      filterBy: "Filter by"
    }
  };

  const t = texts[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-40 shadow-sm">
        <div className={`flex items-center gap-4 p-4 max-w-7xl mx-auto ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <SidebarTrigger />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              {language === 'ar' ? 'العودة' : 'Back'}
            </Button>
          </div>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{t.title}</h1>
            <p className="text-sm text-blue-600">{t.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: 'all' | 'lawyer' | 'judge') => setFilterType(value)}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.filterAll}</SelectItem>
                  <SelectItem value="lawyer">{t.filterLawyer}</SelectItem>
                  <SelectItem value="judge">{t.filterJudge}</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">{t.sortByRating}</SelectItem>
                  <SelectItem value="experience">{t.sortByExperience}</SelectItem>
                  <SelectItem value="price_low">{t.sortByPriceLow}</SelectItem>
                  <SelectItem value="price_high">{t.sortByPriceHigh}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProviders.map((provider) => (
            <Card 
              key={provider.id}
              className="group transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-200"
            >
              <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 pb-4">
                <div className={`flex items-start justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-start gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className={`text-lg font-bold ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {provider.first_name} {provider.last_name}
                      </CardTitle>
                      <div className={`flex items-center gap-2 mt-1 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Badge variant="secondary" className="text-xs capitalize">
                          {provider.provider_type}
                        </Badge>
                        {provider.is_verified && (
                          <Badge className="text-xs bg-green-100 text-green-800">
                            {t.verified}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-4 pb-6 space-y-4">
                {/* Rating and Experience */}
                <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{provider.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-sm text-gray-500">
                      ({provider.total_consultations || 0} {t.consultations})
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {provider.experience_years || 0} {t.yearsExperience}
                  </span>
                </div>

                {/* Specialties */}
                {provider.specialties && provider.specialties.length > 0 && (
                  <div>
                    <h4 className={`text-sm font-semibold text-gray-800 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t.specialties}:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.specialties.slice(0, 3).map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                      {provider.specialties.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{provider.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Services */}
                {provider.activities && provider.activities.length > 0 && (
                  <div>
                    <h4 className={`text-sm font-semibold text-gray-800 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {t.services}:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.activities.slice(0, 2).map((activity, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {activity}
                        </Badge>
                      ))}
                      {provider.activities.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.activities.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {provider.bio && (
                  <p className={`text-sm text-gray-600 line-clamp-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    {provider.bio}
                  </p>
                )}

                {/* Price and Book Button */}
                <div className={`flex items-center justify-between pt-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`text-right ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                    <div className="text-2xl font-bold text-blue-600">
                      {provider.hourly_rate} {provider.currency || 'SAR'}
                    </div>
                    <div className="text-xs text-gray-500">{t.hourlyRate}</div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/consultation')}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    {t.bookConsultation}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAndSortedProviders.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {language === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
            </h3>
            <p className="text-gray-500">
              {language === 'ar' 
                ? 'جرب تغيير مصطلح البحث أو المرشحات'
                : 'Try changing your search term or filters'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceProvidersPage;
