
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Brain, Settings, Zap, Eye, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArabicAIModelsConfigProps {
  language: 'ar' | 'en';
}

export const ArabicAIModelsConfig: React.FC<ArabicAIModelsConfigProps> = ({ language }) => {
  const [activeModels, setActiveModels] = useState({
    jais: true,
    aratT5: false,
    camelBERT: false,
    araELECTRA: false,
    marbert: false
  });
  const [primaryModel, setPrimaryModel] = useState('jais');
  const { toast } = useToast();

  const texts = {
    ar: {
      title: "تكوين نماذج الذكاء الاصطناعي العربية",
      subtitle: "إعداد النماذج المخصصة للتحليل القانوني السوري",
      primaryModel: "النموذج الأساسي",
      activeModels: "النماذج النشطة",
      modelDetails: "تفاصيل النموذج",
      saveConfig: "حفظ التكوين",
      configSaved: "تم حفظ التكوين بنجاح",
      accuracy: "الدقة",
      speed: "السرعة",
      arabicSupport: "دعم العربية",
      legalFocus: "التركيز القانوني"
    },
    en: {
      title: "Arabic AI Models Configuration",
      subtitle: "Configure specialized models for Syrian legal analysis",
      primaryModel: "Primary Model",
      activeModels: "Active Models",
      modelDetails: "Model Details",
      saveConfig: "Save Configuration",
      configSaved: "Configuration saved successfully",
      accuracy: "Accuracy",
      speed: "Speed",
      arabicSupport: "Arabic Support",
      legalFocus: "Legal Focus"
    }
  };

  const t = texts[language];

  const aiModels = {
    jais: {
      name: 'Jais',
      description: language === 'ar' ? 'نموذج لغوي ثنائي اللغة (عربي-إنجليزي) مدرب على النصوص القانونية العربية' : 'Bilingual Arabic-English LLM trained on Arabic legal corpora',
      accuracy: 89,
      speed: 'متوسط',
      arabicSupport: 'ممتاز',
      legalFocus: 'عالي',
      useCase: language === 'ar' ? 'المحرك الأساسي للتحليل القانوني والاستشارات' : 'Primary engine for legal analysis and consultation',
      parameters: '13B-30B',
      icon: Brain
    },
    aratT5: {
      name: 'AraT5',
      description: language === 'ar' ? 'محول نص إلى نص عربي متطور لتوليد النصوص' : 'Arabic Text-to-Text Transformer for text generation',
      accuracy: 82,
      speed: 'سريع',
      arabicSupport: 'ممتاز',
      legalFocus: 'متوسط',
      useCase: language === 'ar' ? 'تحويل المصطلحات القانونية المعقدة إلى عربية بسيطة' : 'Converting complex legal jargon to simple Arabic',
      parameters: 'Base-Large',
      icon: FileText
    },
    camelBERT: {
      name: 'CamelBERT',
      description: language === 'ar' ? 'نموذج BERT مخصص للوثائق القانونية العربية' : 'BERT-based model specialized for Arabic legal documents',
      accuracy: 85,
      speed: 'سريع',
      arabicSupport: 'ممتاز',
      legalFocus: 'عالي',
      useCase: language === 'ar' ? 'استخراج الكيانات القانونية وتصنيف أنواع الوثائق' : 'Legal entity extraction and document classification',
      parameters: 'Base',
      icon: Eye
    },
    araELECTRA: {
      name: 'AraELECTRA',
      description: language === 'ar' ? 'تصحيح النصوص القانونية العربية' : 'Arabic legal text correction',
      accuracy: 78,
      speed: 'سريع جداً',
      arabicSupport: 'جيد',
      legalFocus: 'متوسط',
      useCase: language === 'ar' ? 'تصحيح العامية إلى الفصحى وتطبيع المصطلحات القانونية' : 'Colloquial to MSA correction and legal term normalization',
      parameters: 'Base',
      icon: Settings
    },
    marbert: {
      name: 'MARBERT',
      description: language === 'ar' ? 'نموذج BERT متعدد اللهجات العربية' : 'Multi-Dialect Arabic BERT',
      accuracy: 75,
      speed: 'سريع',
      arabicSupport: 'ممتاز',
      legalFocus: 'منخفض',
      useCase: language === 'ar' ? 'فهم اللهجة السورية في الاستعلامات' : 'Understanding Syrian dialect in queries',
      parameters: 'Base',
      icon: Zap
    }
  };

  const handleModelToggle = (modelKey: string) => {
    setActiveModels(prev => ({
      ...prev,
      [modelKey]: !prev[modelKey as keyof typeof prev]
    }));
  };

  const handleSaveConfig = () => {
    // Here you would typically save to a backend or local storage
    console.log('AI Models Configuration:', {
      primaryModel,
      activeModels,
      timestamp: new Date().toISOString()
    });
    
    toast({
      title: language === 'ar' ? "تم الحفظ" : "Saved",
      description: t.configSaved
    });
  };

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'سريع جداً':
      case 'Very Fast':
        return 'bg-green-100 text-green-800';
      case 'سريع':
      case 'Fast':
        return 'bg-blue-100 text-blue-800';
      case 'متوسط':
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
            <Brain className="h-5 w-5" />
            {t.title}
          </CardTitle>
          <CardDescription>{t.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.primaryModel}</label>
            <Select value={primaryModel} onValueChange={setPrimaryModel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(aiModels).map(([key, model]) => (
                  <SelectItem key={key} value={key}>
                    {model.name} - {model.description.substring(0, 50)}...
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(aiModels).map(([key, model]) => {
          const IconComponent = model.icon;
          const isActive = activeModels[key as keyof typeof activeModels];
          
          return (
            <Card key={key} className={`${isActive ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-3">
                <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{model.name}</CardTitle>
                      <Badge variant="outline" className="text-xs mt-1">
                        {model.parameters}
                      </Badge>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={() => handleModelToggle(key)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{model.description}</p>
                
                <div className="space-y-2">
                  <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs font-medium">{t.accuracy}:</span>
                    <Badge variant="secondary">{model.accuracy}%</Badge>
                  </div>
                  
                  <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs font-medium">{t.speed}:</span>
                    <Badge className={getSpeedColor(model.speed)}>{model.speed}</Badge>
                  </div>
                  
                  <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs font-medium">{t.arabicSupport}:</span>
                    <Badge variant="outline">{model.arabicSupport}</Badge>
                  </div>
                  
                  <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs font-medium">{t.legalFocus}:</span>
                    <Badge variant="outline">{model.legalFocus}</Badge>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">{model.useCase}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button onClick={handleSaveConfig} className="px-8">
          {t.saveConfig}
        </Button>
      </div>
    </div>
  );
};
