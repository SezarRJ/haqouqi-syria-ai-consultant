
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, BookOpen, Filter, ExternalLink, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LegalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const mockSearchResults = [
    {
      id: 1,
      type: 'law',
      title: 'القانون المدني السوري',
      number: '84/1949',
      article: 'المادة 123',
      content: 'كل من أحدث بفعله الخاطئ ضرراً بالغير يلزم بالتعويض، ويُعتبر الفعل خاطئاً إذا وقع بقصد الإضرار أو نتيجة إهمال أو عدم احتياط.',
      category: 'قانون مدني',
      lastUpdated: '2023-05-15',
      relevance: 95
    },
    {
      id: 2,
      type: 'interpretation',
      title: 'تفسير فقهي - المسؤولية المدنية',
      number: 'فتوى 456/2023',
      content: 'في تفسير أحكام المسؤولية المدنية، يجب التمييز بين الضرر المباشر وغير المباشر، وأن يكون هناك رابط سببي واضح بين الفعل والضرر.',
      category: 'تفسير فقهي',
      lastUpdated: '2023-08-20',
      relevance: 87
    },
    {
      id: 3,
      type: 'law',
      title: 'قانون أصول المحاكمات المدنية',
      number: '1/2016',
      article: 'المادة 45',
      content: 'للمحكمة أن تأمر بالكشف والخبرة عند الاقتضاء، وتعين خبيراً أو أكثر من ذوي الاختصاص لإبداء الرأي في المسائل الفنية.',
      category: 'قانون إجرائي',
      lastUpdated: '2023-03-10',
      relevance: 78
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "خطأ في البحث",
        description: "يرجى إدخال كلمة أو عبارة للبحث",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API search
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setIsSearching(false);
      toast({
        title: "تم البحث بنجاح",
        description: `تم العثور على ${mockSearchResults.length} نتيجة متطابقة`
      });
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'law':
        return <BookOpen className="h-4 w-4" />;
      case 'interpretation':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRelevanceColor = (relevance) => {
    if (relevance >= 90) return 'bg-green-500';
    if (relevance >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Search className="h-5 w-5" />
            البحث في القوانين والتفاسير
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ابحث برقم القانون، المادة، أو الكلمات المفتاحية..."
              className="flex-1"
            />
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأنواع</SelectItem>
                <SelectItem value="law">القوانين</SelectItem>
                <SelectItem value="interpretation">التفاسير الفقهية</SelectItem>
                <SelectItem value="fatwa">الفتاوى</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleSearch}
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري البحث...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 ml-2" />
                  بحث
                </>
              )}
            </Button>
          </div>

          {/* Search Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              <Filter className="h-3 w-3 ml-1" />
              القانون المدني
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              <Filter className="h-3 w-3 ml-1" />
              قانون العمل
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              <Filter className="h-3 w-3 ml-1" />
              الأحوال الشخصية
            </Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">
              <Filter className="h-3 w-3 ml-1" />
              القانون التجاري
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-blue-900">
              نتائج البحث ({searchResults.length} نتيجة)
            </h3>
            <Button variant="outline" size="sm">
              ترتيب حسب الصلة
            </Button>
          </div>

          {searchResults.map((result) => (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getResultIcon(result.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900">{result.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{result.number}</Badge>
                        {result.article && (
                          <Badge variant="outline">{result.article}</Badge>
                        )}
                        <Badge className={getRelevanceColor(result.relevance)}>
                          {result.relevance}% مطابقة
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-gray-700 leading-relaxed mb-3">
                  {result.content}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>التصنيف: {result.category}</span>
                    <span>آخر تحديث: {result.lastUpdated}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      عرض كامل
                    </Button>
                    <Button variant="outline" size="sm">
                      إضافة للمفضلة
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {searchResults.length === 0 && !isSearching && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-900">البحث الشائع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'قانون العمل', searches: '1,234 بحث' },
                { title: 'الأحوال الشخصية', searches: '987 بحث' },
                { title: 'القانون التجاري', searches: '856 بحث' },
                { title: 'المسؤولية المدنية', searches: '743 بحث' },
                { title: 'عقود البيع', searches: '692 بحث' },
                { title: 'قانون الإيجار', searches: '581 بحث' }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => setSearchQuery(item.title)}
                >
                  <div className="font-medium text-blue-900">{item.title}</div>
                  <div className="text-sm text-gray-600">{item.searches}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LegalSearch;
