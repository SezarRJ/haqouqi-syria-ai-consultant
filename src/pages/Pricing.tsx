
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, CreditCard, Crown, Star, Zap, Users, Wallet } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { UserBalance } from '@/components/UserBalance';
import { useToast } from '@/hooks/use-toast';

const Pricing = () => {
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
    if (user) {
      checkSubscription();
    }
  }, [user]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const checkSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const handleSubscribe = async (priceId: string, tier: string) => {
    if (!user) {
      toast({
        title: "يرجى تسجيل الدخول",
        description: "يجب تسجيل الدخول أولاً للاشتراك",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId, tier }
      });

      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إنشاء جلسة الدفع",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      if (error) throw error;

      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في فتح بوابة إدارة الاشتراك",
        variant: "destructive"
      });
    }
  };

  const plans = [
    {
      name: "الخطة الأساسية",
      tier: "Basic",
      price: "٢٩ ريال",
      period: "شهرياً",
      priceId: "price_basic_monthly", // Replace with actual Stripe price ID
      description: "مثالية للاستخدام الشخصي",
      features: [
        "١٠ استشارات شهرياً",
        "بحث في القوانين الأساسية",
        "دعم فني أساسي",
        "تحليل الوثائق البسيطة"
      ],
      icon: <Star className="h-8 w-8 text-blue-500" />,
      color: "border-blue-200"
    },
    {
      name: "الخطة المتقدمة",
      tier: "Premium",
      price: "٧٩ ريال",
      period: "شهرياً",
      priceId: "price_premium_monthly", // Replace with actual Stripe price ID
      description: "للمحامين والشركات الصغيرة",
      features: [
        "٥٠ استشارة شهرياً",
        "بحث متقدم في جميع القوانين",
        "تحليل الوثائق المتقدم",
        "دعم فني متقدم",
        "تقارير مفصلة",
        "أولوية في الرد"
      ],
      icon: <Crown className="h-8 w-8 text-purple-500" />,
      color: "border-purple-200",
      popular: true
    },
    {
      name: "خطة المؤسسات",
      tier: "Enterprise",
      price: "١٩٩ ريال",
      period: "شهرياً",
      priceId: "price_enterprise_monthly", // Replace with actual Stripe price ID
      description: "للمؤسسات والشركات الكبيرة",
      features: [
        "استشارات غير محدودة",
        "وصول كامل لجميع القوانين",
        "تحليل متقدم للوثائق",
        "دعم فني مخصص ٢٤/٧",
        "تكامل مع الأنظمة الخارجية",
        "تدريب للفريق",
        "تقارير مخصصة"
      ],
      icon: <Zap className="h-8 w-8 text-orange-500" />,
      color: "border-orange-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">خطط الاشتراك</h1>
            <p className="text-gray-600">اختر الخطة المناسبة لاحتياجاتك</p>
          </div>
          <BackButton />
        </div>

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              {/* Subscription status */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    حالة الاشتراك الحالية
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {subscription?.subscribed ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-green-600">
                          مشترك - {subscription.subscription_tier}
                        </p>
                        <p className="text-sm text-gray-600">
                          ينتهي في: {new Date(subscription.subscription_end).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <Button onClick={handleManageSubscription} variant="outline">
                        إدارة الاشتراك
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold text-gray-600">غير مشترك</p>
                        <p className="text-sm text-gray-500">اختر خطة للبدء</p>
                      </div>
                      <Button onClick={checkSubscription} variant="outline">
                        تحديث الحالة
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pricing plans */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <Card key={index} className={`relative ${plan.color} ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-2 right-4 bg-purple-500">
                        الأكثر شعبية
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <div className="flex justify-center mb-2">
                        {plan.icon}
                      </div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        <span className="text-gray-600"> / {plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        className="w-full"
                        onClick={() => handleSubscribe(plan.priceId, plan.tier)}
                        disabled={loading || (subscription?.subscription_tier === plan.tier)}
                        variant={subscription?.subscription_tier === plan.tier ? "secondary" : "default"}
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : subscription?.subscription_tier === plan.tier ? (
                          "الخطة الحالية"
                        ) : (
                          <>
                            <CreditCard className="h-4 w-4 ml-2" />
                            اشترك الآن
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* User Balance Component */}
            <div>
              <UserBalance />
            </div>
          </div>
        )}

        {!user && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">يرجى تسجيل الدخول</h2>
            <p className="text-gray-600 mb-6">يجب تسجيل الدخول لعرض خطط الاشتراك</p>
            <Button asChild>
              <a href="/">العودة للصفحة الرئيسية</a>
            </Button>
          </div>
        )}

        {/* Features comparison */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>مقارنة الميزات</CardTitle>
            <CardDescription>اكتشف الفروقات بين الخطط المختلفة</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2">الميزة</th>
                    <th className="text-center py-2">الأساسية</th>
                    <th className="text-center py-2">المتقدمة</th>
                    <th className="text-center py-2">المؤسسات</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">عدد الاستشارات الشهرية</td>
                    <td className="text-center py-2">١٠</td>
                    <td className="text-center py-2">٥٠</td>
                    <td className="text-center py-2">غير محدود</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">البحث في القوانين</td>
                    <td className="text-center py-2">أساسي</td>
                    <td className="text-center py-2">متقدم</td>
                    <td className="text-center py-2">شامل</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">تحليل الوثائق</td>
                    <td className="text-center py-2">بسيط</td>
                    <td className="text-center py-2">متقدم</td>
                    <td className="text-center py-2">متقدم جداً</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">الدعم الفني</td>
                    <td className="text-center py-2">أساسي</td>
                    <td className="text-center py-2">متقدم</td>
                    <td className="text-center py-2">مخصص ٢٤/٧</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pricing;
