
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Calendar, Tag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const SmartLegalSearch = () => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'content' | 'number'>('content');

  const { data: searchResults, isLoading, refetch } = useQuery({
    queryKey: ['legal-search', searchQuery, searchType],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];

      let query = supabase.from('laws').select(`
        id,
        name,
        number,
        year,
        category,
        description,
        law_articles(id, article_number, title, content)
      `);

      if (searchType === 'number') {
        query = query.ilike('number', `%${searchQuery}%`);
      } else {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(10);
      if (error) throw error;
      return data || [];
    },
    enabled: false
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      refetch();
    }
  };

  return (
    <Card className={`w-full max-w-4xl mx-auto ${isMobile ? 'mx-4' : ''}`}>
      <CardHeader className={isMobile ? 'pb-4' : ''}>
        <CardTitle className={`flex items-center gap-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          <Search className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-blue-600`} />
          بحث ذكي في القوانين
        </CardTitle>
        <CardDescription className={isMobile ? 'text-sm' : ''}>
          ابحث في جميع القوانين السورية بالرقم أو المحتوى
        </CardDescription>
      </CardHeader>
      <CardContent className={`space-y-6 ${isMobile ? 'space-y-4' : ''}`}>
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : ''}`}>
            <Button
              type="button"
              variant={searchType === 'content' ? 'default' : 'outline'}
              onClick={() => setSearchType('content')}
              size={isMobile ? "sm" : "default"}
              className={isMobile ? 'text-xs' : ''}
            >
              بحث في المحتوى
            </Button>
            <Button
              type="button"
              variant={searchType === 'number' ? 'default' : 'outline'}
              onClick={() => setSearchType('number')}
              size={isMobile ? "sm" : "default"}
              className={isMobile ? 'text-xs' : ''}
            >
              بحث برقم القانون
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchType === 'number' 
                  ? "أدخل رقم القانون (مثال: 84)"
                  : "ابحث في أسماء ووصف القوانين..."
              }
              className={`flex-1 ${isMobile ? 'text-sm' : ''}`}
            />
            <Button 
              type="submit" 
              disabled={!searchQuery.trim() || isLoading}
              size={isMobile ? "sm" : "default"}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Search Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>جارٍ البحث...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>نتائج البحث</h3>
                <Badge variant="secondary">{searchResults.length} نتيجة</Badge>
              </div>
              
              <div className="space-y-4">
                {searchResults.map((law) => (
                  <Card key={law.id} className="hover:shadow-md transition-shadow">
                    <CardContent className={isMobile ? 'p-3' : 'p-4'}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isMobile ? 'text-base' : 'text-lg'} mb-1`}>{law.name}</h4>
                          <div className={`flex items-center gap-2 ${isMobile ? 'gap-1 flex-wrap' : 'gap-4'} text-sm text-gray-600 mb-2`}>
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span className={isMobile ? 'text-xs' : 'text-sm'}>رقم {law.number}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span className={isMobile ? 'text-xs' : 'text-sm'}>{law.year}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              <span className={isMobile ? 'text-xs' : 'text-sm'}>{law.category}</span>
                            </span>
                          </div>
                          <p className={`text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>{law.description}</p>
                        </div>
                      </div>
                      
                      {law.law_articles && law.law_articles.length > 0 && (
                        <div className="border-t pt-3 mt-3">
                          <p className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-800 mb-2`}>
                            المواد ({law.law_articles.length}):
                          </p>
                          <div className="space-y-2">
                            {law.law_articles.slice(0, isMobile ? 2 : 3).map((article) => (
                              <div key={article.id} className={`bg-gray-50 p-2 rounded ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                <span className="font-medium">المادة {article.article_number}:</span>
                                {article.title && <span className="mx-2">{article.title}</span>}
                                <p className="text-gray-600 mt-1 line-clamp-2">
                                  {article.content.substring(0, isMobile ? 100 : 150)}...
                                </p>
                              </div>
                            ))}
                            {law.law_articles.length > (isMobile ? 2 : 3) && (
                              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-blue-600 cursor-pointer hover:underline`}>
                                عرض {law.law_articles.length - (isMobile ? 2 : 3)} مواد إضافية...
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : searchQuery && !isLoading ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className={isMobile ? 'text-sm' : ''}>لم يتم العثور على نتائج لبحثك</p>
              <p className="text-xs">جرب استخدام كلمات مفتاحية مختلفة</p>
            </div>
          ) : null}
        </div>

        {/* Search Tips */}
        {!searchQuery && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className={`font-medium text-blue-900 mb-2 ${isMobile ? 'text-sm' : ''}`}>نصائح للبحث:</h4>
            <ul className={`text-blue-800 space-y-1 ${isMobile ? 'text-xs' : 'text-sm'}`}>
              <li>• استخدم كلمات مفتاحية دقيقة مثل "عقد البيع" أو "الحضانة"</li>
              <li>• ابحث برقم القانون للوصول المباشر (مثل: 84)</li>
              <li>• استخدم المصطلحات القانونية الصحيحة للحصول على نتائج أفضل</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
