
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, Star, Filter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IntelligentLegalSearchProps {
  language: 'ar' | 'en';
}

export const IntelligentLegalSearch: React.FC<IntelligentLegalSearchProps> = ({ language }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const { toast } = useToast();

  const texts = {
    ar: {
      title: "البحث القانوني الذكي",
      searchPlaceholder: "ابحث في قاعدة البيانات القانونية...",
      documentType: "نوع الوثيقة",
      category: "الفئة",
      search: "بحث",
      searching: "جاري البحث...",
      results: "النتائج",
      relevanceScore: "درجة الصلة",
      noResults: "لا توجد نتائج",
      documentTypes: {
        all: "جميع الأنواع",
        law: "قوانين",
        fiqh: "فقه",
        fatwa: "فتاوى",
        precedent: "سوابق قضائية"
      },
      categories: {
        all: "جميع الفئات",
        civil: "مدني",
        commercial: "تجاري",
        criminal: "جنائي",
        family: "أحوال شخصية",
        administrative: "إداري"
      }
    },
    en: {
      title: "Intelligent Legal Search",
      searchPlaceholder: "Search legal database...",
      documentType: "Document Type",
      category: "Category",
      search: "Search",
      searching: "Searching...",
      results: "Results",
      relevanceScore: "Relevance Score",
      noResults: "No results found",
      documentTypes: {
        all: "All Types",
        law: "Laws",
        fiqh: "Fiqh",
        fatwa: "Fatwas",
        precedent: "Precedents"
      },
      categories: {
        all: "All Categories",
        civil: "Civil",
        commercial: "Commercial",
        criminal: "Criminal",
        family: "Family",
        administrative: "Administrative"
      }
    }
  };

  const t = texts[language];

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        title: language === 'ar' ? "خطأ" : "Error",
        description: language === 'ar' ? "يرجى إدخال كلمات البحث" : "Please enter search terms",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('legal-search', {
        body: {
          query,
          document_type: documentType || null,
          category: category || null,
          limit: 20
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      toast({
        title: language === 'ar' ? "تم البحث بنجاح" : "Search Complete",
        description: `${data.results?.length || 0} ${language === 'ar' ? 'نتيجة' : 'results'} ${language === 'ar' ? 'موجودة' : 'found'}`
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: language === 'ar' ? "خطأ في البحث" : "Search Error",
        description: language === 'ar' ? "حدث خطأ أثناء البحث" : "An error occurred during search",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Search className="h-5 w-5" />
            {t.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching}>
              {isSearching ? t.searching : t.search}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.documentType}</label>
              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger>
                  <SelectValue placeholder={t.documentTypes.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t.documentTypes.all}</SelectItem>
                  <SelectItem value="law">{t.documentTypes.law}</SelectItem>
                  <SelectItem value="fiqh">{t.documentTypes.fiqh}</SelectItem>
                  <SelectItem value="fatwa">{t.documentTypes.fatwa}</SelectItem>
                  <SelectItem value="precedent">{t.documentTypes.precedent}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">{t.category}</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder={t.categories.all} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t.categories.all}</SelectItem>
                  <SelectItem value="civil">{t.categories.civil}</SelectItem>
                  <SelectItem value="commercial">{t.categories.commercial}</SelectItem>
                  <SelectItem value="criminal">{t.categories.criminal}</SelectItem>
                  <SelectItem value="family">{t.categories.family}</SelectItem>
                  <SelectItem value="administrative">{t.categories.administrative}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
              <FileText className="h-5 w-5" />
              {t.results} ({results.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.map((result, index) => (
              <div key={result.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-lg">{result.title}</h4>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium">
                      {t.relevanceScore}: {(result.relevance_score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                    {result.document_type}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    {result.category}
                  </span>
                </div>

                <p className="text-gray-700 mb-3 line-clamp-3">
                  {result.content?.substring(0, 300)}...
                </p>

                {result.highlights && result.highlights.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded">
                    <h5 className="font-medium mb-2">Highlights:</h5>
                    {result.highlights.map((highlight: string, idx: number) => (
                      <p key={idx} className="text-sm mb-1">
                        "...{highlight}..."
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {results.length === 0 && query && !isSearching && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t.noResults}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
