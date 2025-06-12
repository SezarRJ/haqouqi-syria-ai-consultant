import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { ArrowLeft, Search, Star, UserCheck, Filter, Users, MessageSquare, Loader2 } from 'lucide-react';

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

const ServiceProviderListPage = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'lawyer' | 'judge'>('all');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price_low' | 'price_high'>('rating');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
    
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
    
    fetchProviders();
  }, []);

  const handleLanguageChange = (newLanguage: 'ar' | 'en') => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

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
        provider.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        provider.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()));

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
      sortByPriceLow: "السعر: من الأقل للأعلى",
      sortByPriceHigh: "السعر: من الأعلى للأقل",
      yearsExperience: "سنوات خبرة",
      consultations: "استشارة",
      hourlyRate: "للساعة",
      bookConsultation: "احجز استشارة",
      verified: "موثق",
      specialties: "التخصصات",
      services: "الخدمات",
      sortBy: "ترتيب حسب",
      filterBy: "تصفية حسب",
      back: "العودة",
      noResults: "لا توجد نتائج",
      tryChangingFilters: "جرب تغيير مصطلح البحث أو المرشحات",
      lawyerType: "محامي",
      judgeType: "قاضي",
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
      filterBy: "Filter by",
      back: "Back",
      noResults: "No Results Found",
      tryChangingFilters: "Try changing your search term or filters",
      lawyerType: "Lawyer",
      judgeType: "Judge",
    }
  };

  const t = texts[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 flex items-center justify-center">
        <Loader2 className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 dark:border-blue-400 border-t-transparent" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <AppSidebar user={user} language={language} onLanguageChange={handleLanguageChange} />
        <SidebarInset>
          {/* Header */}
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-blue-100 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
            <div className={`flex items-center gap-4 p-4 max-w-7xl mx-auto ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <SidebarTrigger />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.back}
                </Button>
              </div>

              <div className="flex-1">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t.title}</h1>
                <p className="text-sm text-blue-600 dark:text-blue-400">{t.subtitle}</p>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400`} />
                  <Input
                    placeholder={t.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 ${language === 'ar' ? 'text-right pr-10 pl-4' : 'text-left pl-10 pr-4'}`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={filterType} onValueChange={(value: 'all' | 'lawyer' | 'judge') => setFilterType(value)}>
                    <SelectTrigger className="w-full sm:w-40 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                      <Filter className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      <SelectValue placeholder={t.filterBy} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="all" className="dark:text-gray-100">{t.filterAll}</SelectItem>
                      <SelectItem value="lawyer" className="dark:text-gray-100">{t.filterLawyer}</SelectItem>
                      <SelectItem value="judge" className="dark:text-gray-100">{t.filterJudge}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full sm:w-48 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
                      <SelectValue placeholder={t.sortBy} />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      <SelectItem value="rating" className="dark:text-gray-100">{t.sortByRating}</SelectItem>
                      <SelectItem value="experience" className="dark:text-gray-100">{t.sortByExperience}</SelectItem>
                      <SelectItem value="price_low" className="dark:text-gray-100">{t.sortByPriceLow}</SelectItem>
                      <SelectItem value="price_high" className="dark:text-gray-100">{t.sortByPriceHigh}</SelectItem>
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
                  className="group transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 border-blue-200 dark:border-gray-700 dark:bg-gray-800"
                  onClick={() => navigate(`/providers/${provider.id}`)}
                >
                  <CardHeader className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-900 pb-4">
                    <div className={`flex items-start justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`flex items-start gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                          <UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className={`text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            {provider.first_name} {provider.last_name}
                          </CardTitle>
                          <div className={`flex items-center gap-2 mt-1 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <Badge variant="secondary" className="text-xs capitalize dark:bg-gray-700 dark:text-gray-200">
                              {provider.provider_type === 'lawyer' ? t.lawyerType : t.judgeType}
                            </Badge>
                            {provider.is_verified && (
                              <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
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
                        <span className="font-medium text-gray-800 dark:text-gray-100">{provider.rating?.toFixed(1) || '0.0'}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          ({provider.total_consultations || 0} {t.consultations})
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {provider.experience_years || 0} {t.yearsExperience}
                      </span>
                    </div>

                    {/* Specialties */}
                    {provider.specialties && provider.specialties.length > 0 && (
                      <div>
                        <h4 className={`text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t.specialties}:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.specialties.slice(0, 3).map((specialty, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-200">
                              {specialty}
                            </Badge>
                          ))}
                          {provider.specialties.length > 3 && (
                            <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                              +{provider.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {provider.activities && provider.activities.length > 0 && (
                      <div>
                        <h4 className={`text-sm font-semibold text-gray-800 dark:text-gray-100 mb-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                          {t.services}:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {provider.activities.slice(0, 2).map((activity, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-200">
                              {activity}
                            </Badge>
                          ))}
                          {provider.activities.length > 2 && (
                            <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-200">
                              +{provider.activities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Bio */}
                    {provider.bio && (
                      <p className={`text-sm text-gray-600 dark:text-gray-400 line-clamp-2 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        {provider.bio}
                      </p>
                    )}

                    {/* Price and Book Button */}
                    <div className={`flex items-center justify-between pt-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`text-right ${language === 'ar' ? 'text-left' : 'text-right'}`}>
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {provider.hourly_rate} {provider.currency || 'SAR'}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.hourlyRate}</div>
                      </div>

                      <Button
                        onClick={() => navigate(`/providers/${provider.id}`)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center gap-2 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600"
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
              <div className="text-center py-12 text-gray-600 dark:text-gray-400">
                <Users className="h-16 w-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">
                  {t.noResults}
                </h3>
                <p>
                  {t.tryChangingFilters}
                </p>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ServiceProviderListPage;
