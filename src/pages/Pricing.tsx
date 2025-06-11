
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Shield, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BackButton } from '@/components/BackButton';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: 'basic',
      name: 'الأساسي',
      price: '0',
      period: 'مجاني',
      description: 'للاستخدام الشخصي البسيط',
      icon: <Shield className="h-6 w-6" />,
      features: [
        '5 استشارات شهرياً',
        'بحث في القوانين الأساسية',
        'دعم فني محدود',
        'واجهة بسيطة'
      ],
      limitations: [
        'لا يمكن رفع الوثائق',
        'لا توجد أولوية في الرد'
      ],
      popular: false,
      color: 'border-gray-200'
    },
    {
      id: 'premium',
      name: 'المتقدم',
      price: '99',
      period: 'شهرياً',
      description: 'للمحامين والشركات الصغيرة',
      icon: <Zap className="h-6 w-6" />,
      features: [
        '50 استشارة شهرياً',
        'بحث متقدم في جميع القوانين',
        'رفع وتحليل الوثائق',
        'تحليل قانوني متقدم',
        'دعم فني سريع',
        'تخزين سحابي للوثائق'
      ],
      limitations: [],
      popular: true,
      color: 'border-blue-500'
    },
    {
      id: 'enterprise',
      name: 'المؤسسي',
      price: '299',
      period: 'شهرياً',
      description: 'للمؤسسات والشركات الكبيرة',
      icon: <Crown className="h-6 w-6" />,
      features: [
        'استشارات غير محدودة',
        'بحث وتحليل متقدم',
        'رفع وثائق غير محدود',
        'تقارير مفصلة',
        'دعم فني مخصص 24/7',
        'تدريب للفريق',
        'تكامل مع الأنظمة الأخرى',
        'أمان متقدم ونسخ احتياطي'
      ],
      limitations: [],
      popular: false,
      color: 'border-purple-500'
    }
  ];

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "تم الاختيار",
        description: `تم اختيار الخطة ${plans.find(p => p.id === planId)?.name} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في اختيار الخطة",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100" dir="rtl">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              اختر الخطة المناسبة لك
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              خطط مرنة تناسب احتياجاتك القانونية من الاستخدام الشخصي إلى المؤسسات الكبيرة
            </p>
          </div>
          <BackButton className="mb-auto" />
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''} transition-all duration-200 hover:shadow-lg`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white px-4 py-1">
                    <Star className="h-4 w-4 ml-1" />
                    الأكثر شعبية
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r ${
                  plan.name === 'الأساسي' ? 'from-gray-400 to-gray-600' :
                  plan.name === 'المتقدم' ? 'from-blue-400 to-blue-600' :
                  'from-purple-400 to-purple-600'
                } flex items-center justify-center text-white`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== '0' && <span className="text-gray-600"> ريال</span>}
                  <div className="text-sm text-gray-500">{plan.period}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.limitations.length > 0 && (
                  <div className="border-t pt-4 space-y-2">
                    <p className="text-sm font-medium text-gray-700">القيود:</p>
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">{limitation}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button 
                  className={`w-full mt-6 ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                  size="lg"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing && selectedPlan === plan.id}
                >
                  {isProcessing && selectedPlan === plan.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      جاري المعالجة...
                    </>
                  ) : (
                    plan.price === '0' ? 'ابدأ مجاناً' : 'اختر هذه الخطة'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">هل يمكنني تغيير الخطة لاحقاً؟</h3>
                <p className="text-gray-600 text-sm">نعم، يمكنك الترقية أو الخفض في أي وقت. سيتم تطبيق التغييرات في الدورة القادمة.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">هل توجد فترة تجريبية؟</h3>
                <p className="text-gray-600 text-sm">نعم، الخطة الأساسية مجانية تماماً. يمكنك أيضاً تجربة الخطط المدفوعة لمدة 7 أيام مجاناً.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">ما هي طرق الدفع المتاحة؟</h3>
                <p className="text-gray-600 text-sm">نقبل جميع بطاقات الائتمان الرئيسية والتحويل البنكي والدفع الإلكتروني.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">هل البيانات آمنة؟</h3>
                <p className="text-gray-600 text-sm">نعم، نستخدم أعلى معايير الأمان والتشفير لحماية بياناتك وخصوصيتك.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">هل تحتاج مساعدة في الاختيار؟</h3>
              <p className="mb-6">تواصل مع فريقنا للحصول على استشارة مجانية حول الخطة المناسبة لاحتياجاتك</p>
              <div className="flex gap-4 justify-center">
                <Button variant="secondary" asChild>
                  <Link to="/contact">تواصل معنا</Link>
                </Button>
                <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                  <Link to="/">جرب النظام</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
