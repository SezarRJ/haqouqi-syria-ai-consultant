
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, Image, Eye, Download, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState([]);
  const { toast } = useToast();

  const handleFileUpload = useCallback((files) => {
    const newFiles = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
      extractedText: '',
      analysis: null
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "تم رفع الملفات بنجاح",
      description: `تم رفع ${newFiles.length} ملف`
    });
  }, [toast]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const simulateOCR = (file) => {
    // Simulate OCR text extraction
    const mockTexts = [
      `عقد بيع عقار

بين الموقعين أدناه:
البائع: أحمد محمد علي
المشتري: سارة حسن المحمود

تم الاتفاق على بيع العقار المسجل باسم البائع والكائن في دمشق - المزة الغربية
المساحة: 150 متر مربع
السعر: 50,000,000 ليرة سورية

شروط العقد:
1. دفع العربون 10% من قيمة العقار
2. تسليم العقار خلال 30 يوماً
3. نقل الملكية عبر الدوائر الرسمية`,

      `شكوى قضائية

المحكمة المختصة: محكمة البداية المدنية بدمشق
المدعي: خالد أحمد السوري
المدعى عليه: شركة البناء الحديث

موضوع الدعوى:
المطالبة بالتعويض عن الأضرار الناجمة عن تأخير تسليم الشقة السكنية المتفق عليها في العقد المؤرخ 15/3/2023

الوقائع:
تم توقيع عقد شراء شقة سكنية بمبلغ 40 مليون ليرة سورية
تأخرت الشركة في التسليم 6 أشهر عن الموعد المحدد
تكبد المدعي خسائر مالية نتيجة التأخير`,

      `وكالة قانونية

أنا الموقع أدناه: محمد عبد الله الأحمد
رقم الهوية: 12345678901
العنوان: دمشق - الميدان

أوكل السيد: أحمد محمد الخليل
المحامي المسجل في نقابة المحامين برقم: 456
وكالة عامة في:
- تمثيلي أمام جميع المحاكم والدوائر الحكومية
- توقيع العقود والاتفاقيات نيابة عني
- استلام وتسليم الوثائق الرسمية`
    ];

    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  };

  const simulateAnalysis = (text, fileName) => {
    const analysisTypes = [
      {
        type: 'contract',
        title: 'تحليل عقد قانوني',
        findings: [
          { type: 'positive', text: 'العقد يحتوي على جميع العناصر الأساسية المطلوبة قانونياً' },
          { type: 'warning', text: 'ينصح بإضافة بند جزائي في حالة الإخلال بالعقد' },
          { type: 'info', text: 'العقد متوافق مع أحكام القانون المدني السوري' }
        ],
        recommendations: [
          'تسجيل العقد في الدوائر المختصة',
          'إضافة بند لحل النزاعات',
          'تحديد الاختصاص القضائي'
        ],
        legalReferences: [
          'القانون المدني السوري - المواد 567-580',
          'قانون الطابو والسجل العقاري'
        ]
      },
      {
        type: 'lawsuit',
        title: 'تحليل وثيقة قضائية',
        findings: [
          { type: 'positive', text: 'الدعوى تستوفي الأركان القانونية المطلوبة' },
          { type: 'warning', text: 'يجب إرفاق مستندات إضافية لدعم الطلبات' },
          { type: 'critical', text: 'انتبه لمواعيد الطعن والمراجعة' }
        ],
        recommendations: [
          'تقديم كافة المستندات الثبوتية',
          'حساب قيمة التعويض بدقة',
          'تحديد الأضرار المباشرة وغير المباشرة'
        ],
        legalReferences: [
          'قانون أصول المحاكمات المدنية',
          'أحكام المسؤولية المدنية'
        ]
      }
    ];

    return analysisTypes[Math.floor(Math.random() * analysisTypes.length)];
  };

  const analyzeDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "لا توجد ملفات",
        description: "يرجى رفع ملفات أولاً للتحليل",
        variant: "destructive"
      });
      return;
    }

    setAnalyzing(true);
    
    // Simulate OCR and analysis process
    for (let i = 0; i < uploadedFiles.length; i++) {
      setTimeout(() => {
        const file = uploadedFiles[i];
        const extractedText = simulateOCR(file.file);
        const analysis = simulateAnalysis(extractedText, file.name);
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, extractedText, analysis, status: 'analyzed' }
            : f
        ));

        setAnalysisResults(prev => [...prev, {
          fileId: file.id,
          fileName: file.name,
          analysis
        }]);

        if (i === uploadedFiles.length - 1) {
          setAnalyzing(false);
          toast({
            title: "تم التحليل بنجاح",
            description: "تم تحليل جميع المستندات المرفوعة"
          });
        }
      }, (i + 1) * 2000);
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    setAnalysisResults(prev => prev.filter(r => r.fileId !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'كب', 'مب', 'جب'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-600" />;
    }
    return <FileText className="h-8 w-8 text-blue-600" />;
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Upload className="h-5 w-5" />
            تحليل الوثائق القانونية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => document.getElementById('file-input').click()}
          >
            <Upload className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">
              اسحب وأفلت ملفاتك هنا أو انقر للتصفح
            </h3>
            <p className="text-gray-600 mb-4">
              ندعم: PDF, DOC, DOCX, JPG, PNG (حتى 10 مب لكل ملف)
            </p>
            <Button variant="outline" className="mx-auto">
              اختيار الملفات
            </Button>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-blue-900">الملفات المرفوعة ({uploadedFiles.length})</h4>
                <Button 
                  onClick={analyzeDocuments}
                  disabled={analyzing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {analyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      جاري التحليل...
                    </div>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 ml-2" />
                      تحليل المستندات
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-blue-900 truncate">{file.name}</div>
                      <div className="text-sm text-gray-600">{formatFileSize(file.size)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'analyzed' && (
                        <Badge className="bg-green-500">
                          <CheckCircle className="h-3 w-3 ml-1" />
                          تم التحليل
                        </Badge>
                      )}
                      {file.status === 'uploaded' && (
                        <Badge variant="secondary">في الانتظار</Badge>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisResults.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-blue-900">نتائج التحليل القانوني</h3>
          
          {analysisResults.map((result) => (
            <Card key={result.fileId} className="border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <FileText className="h-5 w-5" />
                  {result.analysis.title} - {result.fileName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Findings */}
                <div>
                  <h4 className="font-medium text-blue-900 mb-3">النتائج والملاحظات:</h4>
                  <div className="space-y-2">
                    {result.analysis.findings.map((finding, index) => (
                      <div key={index} className={`flex items-start gap-2 p-3 rounded-lg ${
                        finding.type === 'positive' ? 'bg-green-50 border border-green-200' :
                        finding.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                        'bg-red-50 border border-red-200'
                      }`}>
                        {finding.type === 'positive' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
                        {finding.type === 'warning' && <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                        {finding.type === 'critical' && <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                        <span className={`text-sm ${
                          finding.type === 'positive' ? 'text-green-800' :
                          finding.type === 'warning' ? 'text-yellow-800' :
                          'text-red-800'
                        }`}>
                          {finding.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className="font-medium text-blue-900 mb-3">التوصيات:</h4>
                  <ul className="space-y-1">
                    {result.analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal References */}
                <div>
                  <h4 className="font-medium text-blue-900 mb-3">المراجع القانونية:</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.analysis.legalReferences.map((ref, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 ml-2" />
                    تحميل التقرير
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 ml-2" />
                    عرض النص المستخرج
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* OCR Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">تقنية التعرف على النصوص (OCR)</h4>
              <p className="text-sm text-blue-700 leading-relaxed">
                نستخدم تقنيات متقدمة لاستخراج النصوص من الصور والملفات الممسوحة ضوئياً، 
                مما يمكننا من تحليل محتوى الوثائق وتقديم استشارات قانونية دقيقة بناءً على المحتوى المستخرج.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentUpload;
