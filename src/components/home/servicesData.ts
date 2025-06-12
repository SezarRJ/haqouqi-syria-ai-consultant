
import { MessageSquare, BarChart3, Search, FileText, AlertTriangle, BookOpen, Users, ScanText } from 'lucide-react';

export const getServicesData = (language: 'ar' | 'en') => {
  const texts = {
    ar: {
      features: "المزايا",
      consultation: {
        title: "الاستشارة القانونية مع الملفات",
        description: "احصل على استشارة قانونية متخصصة مع إمكانية رفع المستندات والملفات",
        features: [
          "رفع وتحليل المستندات القانونية",
          "استشارات فورية مع خبراء قانونيين",
          "دعم متعدد التنسيقات (PDF, Word, صور)",
          "حفظ تاريخ الاستشارات"
        ]
      },
      caseAnalysis: {
        title: "محرك تحليل القضايا والاستراتيجية",
        description: "تحليل متقدم للقضايا مع مطابقة السوابق القانونية",
        features: [
          "تحليل متقدم للقضايا مع مطابقة السوابق القانونية",
          "توصيات استراتيجية بناءً على تعقيد القضية",
          "تسجيل الثقة وتقييم المخاطر",
          "تكامل مع القانون السوري ومبادئ الفقه"
        ]
      },
      legalSearch: {
        title: "محرك البحث القانوني الذكي",
        description: "البحث الدلالي عبر قاعدة بيانات الوثائق القانونية",
        features: [
          "البحث الدلالي عبر قاعدة بيانات الوثائق القانونية",
          "فلترة حسب نوع الوثيقة (قوانين، فقه، فتاوى، سوابق)",
          "تسجيل الصلة ونتائج مميزة",
          "دعم الاستعلامات العربية والإنجليزية"
        ]
      },
      documentDrafting: {
        title: "وحدة صياغة الوثائق القانونية",
        description: "إنشاء الوثائق باستخدام القوالب",
        features: [
          "إنشاء الوثائق باستخدام القوالب",
          "استبدال الحقول الديناميكية بمساعدة الذكاء الاصطناعي",
          "دعم أنواع متعددة من الوثائق",
          "وظائف التحميل والحفظ"
        ]
      },
      riskAssessment: {
        title: "خوارزمية تقييم المخاطر",
        description: "تحليل مخاطر معقد متعدد العوامل",
        features: [
          "تحليل مخاطر معقد متعدد العوامل",
          "معاملات مخاطر قابلة للتخصيص",
          "توصيات استراتيجية التخفيف",
          "لوحة تحكم بصرية لتسجيل المخاطر"
        ]
      },
      explanations: {
        title: "الشروحات القانونية المبسطة",
        description: "ترجمة المصطلحات القانونية المعقدة إلى اللغة العربية البسيطة"
      },
      collaboration: {
        title: "مركز التعاون المهني",
        description: "مساحة آمنة للمحامين والقضاة للتعاون والمناقشة المهنية"
      },
      ocrService: {
        title: "تكامل خدمة OCR",
        description: "معالجة الوثائق متعددة التنسيقات",
        features: [
          "معالجة الوثائق متعددة التنسيقات (PDF, JPG, PNG)",
          "استخراج النص مع تسجيل الثقة",
          "إمكانيات المعالجة المجمعة",
          "دعم التعرف على النص العربي"
        ]
      }
    },
    en: {
      features: "Features",
      consultation: {
        title: "Legal Consultation with Files",
        description: "Get specialized legal consultation with document upload capability",
        features: [
          "Upload and analyze legal documents",
          "Instant consultations with legal experts",
          "Multi-format support (PDF, Word, Images)",
          "Save consultation history"
        ]
      },
      caseAnalysis: {
        title: "AI Case Analysis & Strategy Engine",
        description: "Advanced case analysis with legal precedent matching",
        features: [
          "Advanced case analysis with legal precedent matching",
          "Strategic recommendations based on case complexity",
          "Confidence scoring and risk assessment",
          "Integration with Syrian law and Fiqh principles"
        ]
      },
      legalSearch: {
        title: "Intelligent Legal Search Backend",
        description: "Semantic search across legal documents database",
        features: [
          "Semantic search across legal documents database",
          "Filter by document type (laws, fiqh, fatwas, precedents)",
          "Relevance scoring and highlighted results",
          "Support for Arabic and English queries"
        ]
      },
      documentDrafting: {
        title: "Legal Document Drafting Module",
        description: "Template-based document generation",
        features: [
          "Template-based document generation",
          "Dynamic field replacement with AI assistance",
          "Support for multiple document types",
          "Download and save functionality"
        ]
      },
      riskAssessment: {
        title: "Risk Assessment Algorithm",
        description: "Complex multi-factor risk analysis",
        features: [
          "Complex multi-factor risk analysis",
          "Customizable risk parameters",
          "Mitigation strategy recommendations",
          "Visual risk scoring dashboard"
        ]
      },
      explanations: {
        title: "Simplified Legal Explanations",
        description: "Translate complex legal terms into plain Arabic language"
      },
      collaboration: {
        title: "Professional Collaboration Hub",
        description: "Secure space for lawyers and judges to collaborate professionally"
      },
      ocrService: {
        title: "OCR Service Integration",
        description: "Multi-format document processing",
        features: [
          "Multi-format document processing (PDF, JPG, PNG)",
          "Text extraction with confidence scoring",
          "Batch processing capabilities",
          "Arabic text recognition support"
        ]
      }
    }
  };

  const t = texts[language];

  return [
    {
      title: t.consultation.title,
      description: t.consultation.description,
      features: t.consultation.features,
      icon: MessageSquare,
      path: '/consultation',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      featured: true
    },
    {
      title: t.caseAnalysis.title,
      description: t.caseAnalysis.description,
      features: t.caseAnalysis.features,
      icon: BarChart3,
      path: '/case-analysis',
      color: 'from-indigo-600 to-indigo-700',
      bgColor: 'from-indigo-50 to-indigo-100',
      borderColor: 'border-indigo-200',
      iconBg: 'bg-indigo-100',
      featured: true
    },
    {
      title: t.legalSearch.title,
      description: t.legalSearch.description,
      features: t.legalSearch.features,
      icon: Search,
      path: '/legal-search',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'from-purple-50 to-purple-100',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100'
    },
    {
      title: t.documentDrafting.title,
      description: t.documentDrafting.description,
      features: t.documentDrafting.features,
      icon: FileText,
      path: '/document-drafting',
      color: 'from-green-600 to-green-700',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100'
    },
    {
      title: t.riskAssessment.title,
      description: t.riskAssessment.description,
      features: t.riskAssessment.features,
      icon: AlertTriangle,
      path: '/risk-assessment',
      color: 'from-orange-600 to-orange-700',
      bgColor: 'from-orange-50 to-orange-100',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      featured: true
    },
    {
      title: t.explanations.title,
      description: t.explanations.description,
      icon: BookOpen,
      path: '/explanations',
      color: 'from-teal-600 to-teal-700',
      bgColor: 'from-teal-50 to-teal-100',
      borderColor: 'border-teal-200',
      iconBg: 'bg-teal-100'
    },
    {
      title: t.collaboration.title,
      description: t.collaboration.description,
      icon: Users,
      path: '/collaboration',
      color: 'from-pink-600 to-pink-700',
      bgColor: 'from-pink-50 to-pink-100',
      borderColor: 'border-pink-200',
      iconBg: 'bg-pink-100'
    },
    {
      title: t.ocrService.title,
      description: t.ocrService.description,
      features: t.ocrService.features,
      icon: ScanText,
      path: '/ocr-service',
      color: 'from-violet-600 to-violet-700',
      bgColor: 'from-violet-50 to-violet-100',
      borderColor: 'border-violet-200',
      iconBg: 'bg-violet-100'
    }
  ];
};
