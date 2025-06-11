
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, MessageSquare, Star, Share2, Shield } from 'lucide-react';

interface CollaborationHubProps {
  language: 'ar' | 'en';
}

export const CollaborationHub = ({ language }: CollaborationHubProps) => {
  const [activeTab, setActiveTab] = useState('forum');

  const texts = {
    ar: {
      title: 'مركز التعاون المهني',
      subtitle: 'تعاون بين المحامين والقضاة وتبادل الخبرات',
      forum: 'المنتدى القانوني',
      peerReview: 'مراجعة الأقران',
      askLawyer: 'استشر محامي',
      caseSharing: 'مشاركة القضايا',
      newPost: 'منشور جديد',
      shareCase: 'مشاركة قضية',
      requestReview: 'طلب مراجعة',
      connectLawyer: 'التواصل مع محامي',
      privacy: 'الخصوصية مضمونة',
      verified: 'محامي معتمد',
      online: 'متاح الآن',
      rating: 'التقييم'
    },
    en: {
      title: 'Professional Collaboration Hub',
      subtitle: 'Collaborate between lawyers and judges, share expertise',
      forum: 'Legal Forum',
      peerReview: 'Peer Review',
      askLawyer: 'Ask a Lawyer',
      caseSharing: 'Case Sharing',
      newPost: 'New Post',
      shareCase: 'Share Case',
      requestReview: 'Request Review',
      connectLawyer: 'Connect with Lawyer',
      privacy: 'Privacy Guaranteed',
      verified: 'Verified Lawyer',
      online: 'Available Now',
      rating: 'Rating'
    }
  };

  const t = texts[language];

  const forumPosts = [
    {
      id: 1,
      title: language === 'ar' ? 'تفسير جديد لقانون العمل' : 'New interpretation of Labor Law',
      author: language === 'ar' ? 'د. أحمد محمد' : 'Dr. Ahmed Mohammed',
      role: language === 'ar' ? 'قاضي' : 'Judge',
      replies: 15,
      likes: 23,
      time: '2h'
    },
    {
      id: 2,
      title: language === 'ar' ? 'قضية معقدة في القانون التجاري' : 'Complex commercial law case',
      author: language === 'ar' ? 'المحامية سارة علي' : 'Lawyer Sarah Ali',
      role: language === 'ar' ? 'محامي' : 'Lawyer',
      replies: 8,
      likes: 12,
      time: '4h'
    }
  ];

  const verifiedLawyers = [
    {
      id: 1,
      name: language === 'ar' ? 'المحامي خالد حسن' : 'Lawyer Khaled Hassan',
      specialization: language === 'ar' ? 'قانون الأسرة' : 'Family Law',
      experience: '15 years',
      rating: 4.8,
      price: '200 SAR/hour',
      available: true
    },
    {
      id: 2,
      name: language === 'ar' ? 'المحامية نور الدين' : 'Lawyer Nour Aldeen',
      specialization: language === 'ar' ? 'القانون التجاري' : 'Commercial Law',
      experience: '12 years',
      rating: 4.9,
      price: '250 SAR/hour',
      available: false
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-600" />
          {t.title}
        </CardTitle>
        <CardDescription>{t.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="forum">{t.forum}</TabsTrigger>
            <TabsTrigger value="peer-review">{t.peerReview}</TabsTrigger>
            <TabsTrigger value="case-sharing">{t.caseSharing}</TabsTrigger>
            <TabsTrigger value="ask-lawyer">{t.askLawyer}</TabsTrigger>
          </TabsList>

          <TabsContent value="forum" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.forum}</h3>
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                {t.newPost}
              </Button>
            </div>
            
            <div className="space-y-3">
              {forumPosts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{post.title}</h4>
                    <span className="text-sm text-gray-500">{post.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{post.author}</span>
                      <Badge variant="secondary" className="text-xs">{post.role}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>💬 {post.replies}</span>
                      <span>👍 {post.likes}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="peer-review" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.peerReview}</h3>
              <Button size="sm">
                <Star className="h-4 w-4 mr-2" />
                {t.requestReview}
              </Button>
            </div>
            
            <div className="grid gap-4">
              <Card className="p-4">
                <h4 className="font-medium mb-2">
                  {language === 'ar' ? 'مراجعة استشارة قانونية' : 'Legal Consultation Review'}
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'ar' 
                    ? 'يحتاج هذا التحليل لمراجعة من قبل محامي متخصص في القانون المدني'
                    : 'This analysis needs review by a lawyer specialized in civil law'
                  }
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    {language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                  </Button>
                  <Button size="sm">
                    {language === 'ar' ? 'قبول المراجعة' : 'Accept Review'}
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="case-sharing" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.caseSharing}</h3>
              <Button size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                {t.shareCase}
              </Button>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">{t.privacy}</span>
              </div>
              <p className="text-sm text-blue-800">
                {language === 'ar'
                  ? 'جميع المعلومات الشخصية يتم إخفاؤها تلقائياً لضمان الخصوصية'
                  : 'All personal information is automatically anonymized to ensure privacy'
                }
              </p>
            </div>
          </TabsContent>

          <TabsContent value="ask-lawyer" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{t.askLawyer}</h3>
              <Button size="sm">
                {t.connectLawyer}
              </Button>
            </div>
            
            <div className="grid gap-4">
              {verifiedLawyers.map((lawyer) => (
                <Card key={lawyer.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{lawyer.name}</h4>
                        <Badge variant="default" className="text-xs">
                          {t.verified}
                        </Badge>
                        {lawyer.available && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            {t.online}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{lawyer.specialization}</p>
                      <p className="text-xs text-gray-500">{lawyer.experience}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{lawyer.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">{lawyer.price}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full" 
                    disabled={!lawyer.available}
                  >
                    {lawyer.available 
                      ? (language === 'ar' ? 'ابدأ استشارة' : 'Start Consultation')
                      : (language === 'ar' ? 'غير متاح حالياً' : 'Currently Unavailable')
                    }
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
