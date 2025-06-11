
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FileText, Calendar, Tag } from 'lucide-react';

export const SmartLegalSearch = () => {
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
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-6 w-6 text-blue-600" />
          بحث ذكي في القوانين
        </CardTitle>
        <CardDescription>
          ابحث في جميع القوانين السورية بالرقم أو المحتوى
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={searchType === 'content' ? 'default' : 'outline'}
              onClick={() => setSearchType('content')}
              size="sm"
            >
              بحث في المحتوى
            </Button>
            <Button
              type="button"
              variant={searchType === 'number' ? 'default' : 'outline'}
              onClick={() => setSearchType('number')}
              size="sm"
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
              className="flex-1"
            />
            <Button type="submit" disabled={!searchQuery.trim() || isLoading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        {/* Search Results */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">جارٍ البحث...</p>
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">نتائج البحث</h3>
                <Badge variant="secondary">{searchResults.length} نتيجة</Badge>
              </div>
              
              <div className="space-y-4">
                {searchResults.map((law) => (
                  <Card key={law.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-lg mb-1">{law.name}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <span className="flex items-center gap-1">
                              <FileText className="h-4 w-4" />
                              رقم {law.number}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {law.year}
                            </span>
                            <span className="flex items-center gap-1">
                              <Tag className="h-4 w-4" />
                              {law.category}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{law.description}</p>
                        </div>
                      </div>
                      
                      {law.law_articles && law.law_articles.length > 0 && (
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm font-medium text-gray-800 mb-2">
                            المواد ({law.law_articles.length}):
                          </p>
                          <div className="space-y-2">
                            {law.law_articles.slice(0, 3).map((article) => (
                              <div key={article.id} className="bg-gray-50 p-2 rounded text-sm">
                                <span className="font-medium">المادة {article.article_number}:</span>
                                {article.title && <span className="mx-2">{article.title}</span>}
                                <p className="text-gray-600 mt-1 line-clamp-2">
                                  {article.content.substring(0, 150)}...
                                </p>
                              </div>
                            ))}
                            {law.law_articles.length > 3 && (
                              <p className="text-sm text-blue-600 cursor-pointer hover:underline">
                                عرض {law.law_articles.length - 3} مواد إضافية...
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
              <p>لم يتم العثور على نتائج لبحثك</p>
              <p className="text-sm">جرب استخدام كلمات مفتاحية مختلفة</p>
            </div>
          ) : null}
        </div>

        {/* Search Tips */}
        {!searchQuery && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">نصائح للبحث:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
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
