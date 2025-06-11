
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

interface ExplanationModeToggleProps {
  language: 'ar' | 'en';
  content: string;
  onModeChange?: (mode: 'expert' | 'layman') => void;
}

export const ExplanationModeToggle = ({ language, content, onModeChange }: ExplanationModeToggleProps) => {
  const [mode, setMode] = useState<'expert' | 'layman'>('layman');
  const [explanation, setExplanation] = useState<string>('');

  const texts = {
    ar: {
      title: 'تبسيط الشرح القانوني',
      subtitle: 'اختر مستوى التفسير المناسب لك',
      expertMode: 'وضع الخبراء',
      laymanMode: 'وضع المبتدئين',
      expertDesc: 'شرح تفصيلي بالمصطلحات القانونية الكاملة',
      laymanDesc: 'شرح مبسط بلغة سهلة ومفهومة',
      processing: 'جاري المعالجة...',
      visualAids: 'الوسائل البصرية',
      flowchart: 'مخطط انسيابي',
      infographic: 'رسم بياني'
    },
    en: {
      title: 'Legal Explanation Modes',
      subtitle: 'Choose the appropriate explanation level',
      expertMode: 'Expert Mode',
      laymanMode: 'Layman Mode',
      expertDesc: 'Detailed explanation with full legal terminology',
      laymanDesc: 'Simplified explanation in easy language',
      processing: 'Processing...',
      visualAids: 'Visual Aids',
      flowchart: 'Flowchart',
      infographic: 'Infographic'
    }
  };

  const t = texts[language];

  const toggleMode = (newMode: 'expert' | 'layman') => {
    setMode(newMode);
    onModeChange?.(newMode);
    generateExplanation(newMode);
  };

  const generateExplanation = (selectedMode: 'expert' | 'layman') => {
    // Simulate processing
    setExplanation(language === 'ar' ? 'جاري المعالجة...' : 'Processing...');
    
    setTimeout(() => {
      if (selectedMode === 'expert') {
        setExplanation(language === 'ar' ? `
الشرح التفصيلي للخبراء:

وفقاً للمادة 163 من القانون المدني السوري، والتي تنص على أن "العقد شريعة المتعاقدين"، فإن الالتزامات التعاقدية تخضع لمبدأ القوة الملزمة للعقد (pacta sunt servanda).

المرجعية القانونية:
- القانون المدني السوري رقم 84 لعام 1949
- تفسير محكمة النقض في القرار رقم 1245/2020
- المبادئ العامة لقانون الالتزامات والعقود

الاستثناءات القانونية:
1. حالات القوة القاهرة (المادة 372)
2. الاستحالة المطلقة في التنفيذ
3. التغيير الجوهري للظروف (théorie de l'imprévision)

التطبيق القضائي:
تطبق المحاكم السورية هذه المبادئ وفقاً لاجتهاد محكمة النقض والمبادئ المستقرة في الفقه القانوني.
        ` : `
Detailed Expert Explanation:

According to Article 163 of the Syrian Civil Code, which states that "the contract is the law of the contracting parties," contractual obligations are subject to the principle of binding force of contracts (pacta sunt servanda).

Legal References:
- Syrian Civil Code No. 84 of 1949
- Supreme Court interpretation in Decision No. 1245/2020
- General principles of obligations and contracts law

Legal Exceptions:
1. Force majeure cases (Article 372)
2. Absolute impossibility of performance
3. Substantial change of circumstances (théorie de l'imprévision)

Judicial Application:
Syrian courts apply these principles according to Supreme Court jurisprudence and established legal doctrine.
        `);
      } else {
        setExplanation(language === 'ar' ? `
الشرح المبسط:

ببساطة، هذا يعني أن العقد الذي توقعه يجب أن تلتزم به تماماً مثل القانون.

ما يجب أن تعرفه:
✓ عندما توقع عقداً، فأنت ملتزم بتنفيذه
✓ لا يمكنك التراجع إلا في حالات خاصة جداً
✓ إذا لم تنفذ العقد، قد تضطر لدفع تعويض

الحالات الاستثنائية:
🔸 إذا حدثت كارثة طبيعية منعتك من التنفيذ
🔸 إذا أصبح تنفيذ العقد مستحيلاً تماماً
🔸 إذا تغيرت الظروف بشكل جذري

مثال بسيط:
إذا استأجرت شقة، يجب أن تدفع الإيجار كل شهر كما اتفقت. لا يمكنك التوقف عن الدفع إلا إذا حدث شيء استثنائي.

نصيحة: اقرأ العقد جيداً قبل التوقيع!
        ` : `
Simple Explanation:

Simply put, this means that a contract you sign must be followed just like the law.

What you need to know:
✓ When you sign a contract, you must fulfill it
✓ You cannot back out except in very special cases
✓ If you don't fulfill the contract, you may have to pay compensation

Exceptional cases:
🔸 If a natural disaster prevented you from fulfilling it
🔸 If fulfilling the contract became completely impossible
🔸 If circumstances changed drastically

Simple example:
If you rent an apartment, you must pay the rent every month as agreed. You cannot stop paying unless something exceptional happens.

Tip: Read the contract carefully before signing!
        `);
      }
    }, 1500);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={mode === 'expert' ? 'default' : 'outline'}
            onClick={() => toggleMode('expert')}
            className="flex-1 flex items-center gap-2"
          >
            <GraduationCap className="h-4 w-4" />
            {t.expertMode}
          </Button>
          <Button
            variant={mode === 'layman' ? 'default' : 'outline'}
            onClick={() => toggleMode('layman')}
            className="flex-1 flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            {t.laymanMode}
          </Button>
        </div>

        <div className="flex gap-2 text-sm text-gray-600">
          <Badge variant="secondary">
            {mode === 'expert' ? t.expertDesc : t.laymanDesc}
          </Badge>
        </div>

        {explanation && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm">
              {explanation}
            </pre>
          </div>
        )}

        {mode === 'layman' && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">{t.visualAids}</h4>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                📊 {t.flowchart}
              </Button>
              <Button variant="outline" size="sm">
                📈 {t.infographic}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
