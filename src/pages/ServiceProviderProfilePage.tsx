// src/pages/ServiceProviderProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { HomeHeader } from '@/components/home/HomeHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, Star, Briefcase, DollarSign, MessageSquare, Upload, Info, PlayCircle, CreditCard, CheckCircle, Loader2 } from 'lucide-react';
import { BackButton } from '@/components/BackButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

// Re-define ServiceProvider type for clarity (can be imported from a types file)
interface ServiceProvider {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  provider_type: 'lawyer' | 'judge';
  specialties: string[];
  activities: string[];
  bio: string;
  experience_years: number;
  hourly_rate: number;
  currency: string;
  rating: number;
  total_consultations: number;
  is_verified: boolean;
  is_active: boolean;
  // Add other relevant fields like certificates if needed for display
  certificates?: { id: string; certificate_name: string; certificate_url: string; issued_by: string; issue_date: string; expiry_date: string; }[];
}

// For chat messages
interface ChatMessage {
  id: string;
  sender_id: string; // auth.users id
  message: string;
  created_at: string;
}

const ServiceProviderProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [language, setLanguage] = useState<'ar' | 'en'>('en'); // Default to English for a new page
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [consultationSubject, setConsultationSubject] = useState('');
  const [consultationDescription, setConsultationDescription] = useState('');
  const [isBookingConsultation, setIsBookingConsultation] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [consultationRequestSent, setConsultationRequestSent] = useState(false);
  const [currentConsultationId, setCurrentConsultationId] = useState<string | null>(null);
  const [showReviewPrompt, setShowReviewPrompt] = useState(false); // To show review prompt after service
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const t = {
    ar: {
      title: 'ملف مقدم الخدمة',
      loading: 'جاري تحميل الملف الشخصي...',
      providerNotFound: 'لم يتم العثور على مقدم الخدمة.',
      info: 'المعلومات',
      chat: 'المحادثة',
      files: 'الملفات',
      bookService: 'طلب استشارة',
      name: 'الاسم',
      type: 'النوع',
      specialties: 'التخصصات',
      experience: 'سنوات الخبرة',
      hourlyRate: 'الرسوم بالساعة',
      bio: 'نبذة شخصية',
      rating: 'التقييم',
      consultations: 'استشارة',
      sendMessage: 'إرسال',
      typeMessage: 'اكتب رسالتك...',
      uploadFiles: 'تحميل الملفات',
      selectFiles: 'اختر الملفات',
      uploading: 'جاري التحميل...',
      startService: 'طلب استشارة',
      subject: 'الموضوع',
      description: 'الوصف',
      requestSent: 'تم إرسال طلب الاستشارة بنجاح!',
      consultationPending: 'طلب الاستشارة معلق. يرجى انتظار رد مزود الخدمة.',
      payNow: 'ادفع الآن',
      paymentSuccess: 'تم الدفع بنجاح!',
      paymentFailed: 'فشل الدفع. يرجى المحاولة مرة أخرى.',
      reviewService: 'تقييم الخدمة',
      submitReview: 'إرسال التقييم',
      howWasService: 'كيف كانت الخدمة؟',
      shareExperience: 'شارك تجربتك...',
      reviewSubmitted: 'تم إرسال تقييمك بنجاح!',
      lawyer: 'محامي',
      judge: 'قاضي',
      certificates: 'الشهادات',
      issuedBy: 'صادرة عن',
      issueDate: 'تاريخ الإصدار',
      expiryDate: 'تاريخ الانتهاء',
      download: 'تحميل',
      noCertificates: 'لا توجد شهادات متاحة.',
      consultationRequestTitle: 'تفاصيل طلب الاستشارة',
      consultationRequestDesc: 'يرجى تقديم تفاصيل طلبك.',
      cancel: 'إلغاء',
      confirmBooking: 'تأكيد الطلب',
      paymentMethodTitle: 'طريقة الدفع',
      paymentMethodDesc: 'اختر طريقة الدفع المفضلة لديك.',
      mockPayment: 'محاكاة عملية الدفع (للتجربة)',
      confirmPayment: 'تأكيد الدفع',
      consultationStartInfo: 'الاستشارة ستبدأ بعد تأكيد مزود الخدمة.',
    },
    en: {
      title: 'Service Provider Profile',
      loading: 'Loading profile...',
      providerNotFound: 'Service provider not found.',
      info: 'Information',
      chat: 'Chat',
      files: 'Files',
      bookService: 'Book Consultation',
      name: 'Name',
      type: 'Type',
      specialties: 'Specialties',
      experience: 'Years of Experience',
      hourlyRate: 'Hourly Rate',
      bio: 'Biography',
      rating: 'Rating',
      consultations: 'Consultations',
      sendMessage: 'Send',
      typeMessage: 'Type your message...',
      uploadFiles: 'Upload Files',
      selectFiles: 'Select Files',
      uploading: 'Uploading...',
      startService: 'Request Consultation',
      subject: 'Subject',
      description: 'Description',
      requestSent: 'Consultation request sent successfully!',
      consultationPending: 'Consultation request is pending. Please wait for provider response.',
      payNow: 'Pay Now',
      paymentSuccess: 'Payment successful!',
      paymentFailed: 'Payment failed. Please try again.',
      reviewService: 'Review Service',
      submitReview: 'Submit Review',
      howWasService: 'How was the service?',
      shareExperience: 'Share your experience...',
      reviewSubmitted: 'Your review has been submitted successfully!',
      lawyer: 'Lawyer',
      judge: 'Judge',
      certificates: 'Certificates',
      issuedBy: 'Issued By',
      issueDate: 'Issue Date',
      expiryDate: 'Expiry Date',
      download: 'Download',
      noCertificates: 'No certificates available.',
      consultationRequestTitle: 'Consultation Request Details',
      consultationRequestDesc: 'Please provide details for your consultation request.',
      cancel: 'Cancel',
      confirmBooking: 'Confirm Booking',
      paymentMethodTitle: 'Payment Method',
      paymentMethodDesc: 'Choose your preferred payment method.',
      mockPayment: 'Simulate Payment (for testing)',
      confirmPayment: 'Confirm Payment',
      consultationStartInfo: 'Consultation will begin after provider confirms.',
    }
  }[language];

  useEffect(() => {
    // Load language preference
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    // Get current user
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getCurrentUser();

    const fetchProviderData = async () => {
      if (!id) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          certificates:provider_certificates (id, certificate_name, certificate_url, issued_by, issue_date, expiry_date)
        `)
        .eq('id', id)
        .eq('is_verified', true) // Only show verified providers
        .eq('is_active', true) // Only show active providers
        .single();

      if (error || !data) {
        console.error('Error fetching provider:', error);
        toast({
          title: 'Error',
          description: t.providerNotFound,
          variant: 'destructive',
        });
        navigate('/providers'); // Redirect to list if not found
      } else {
        setProvider(data as ServiceProvider);
      }
      setIsLoading(false);
    };

    fetchProviderData();
  }, [id, navigate, toast, language]);

  // Real-time chat (simplified - needs proper chat room handling in a real app)
  useEffect(() => {
    if (!currentUser || !id || !currentConsultationId) return; // Only listen if user is logged in, provider exists, and consultation is active

    const channel = supabase.channel(`chat_consultation_${currentConsultationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'consultation_messages', // Now exists in database
          filter: `consultation_id=eq.${currentConsultationId}`
        },
        (payload: any) => {
          setChatMessages((prev) => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();

    // Fetch initial messages for current consultation
    const fetchInitialMessages = async () => {
      try {
        // Use any type to bypass TypeScript checking for the table that exists in DB but not in types yet
        const { data, error } = await (supabase as any)
          .from('consultation_messages')
          .select('*')
          .eq('consultation_id', currentConsultationId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching chat messages:', error);
        } else {
          setChatMessages(data as ChatMessage[]);
        }
      } catch (error) {
        console.error('Error in fetchInitialMessages:', error);
      }
    };

    if (currentConsultationId) {
      fetchInitialMessages();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, currentConsultationId, currentUser]);

  const handleSendMessage = async () => {
    if (!newChatMessage.trim() || !currentUser || !currentConsultationId) return;

    try {
      // Insert message into consultation_messages table using any type to bypass TypeScript
      const { error } = await (supabase as any).from('consultation_messages').insert({
        consultation_id: currentConsultationId,
        sender_id: currentUser.id,
        receiver_id: provider?.user_id, // Assuming provider.user_id is the recipient
        message: newChatMessage.trim(),
      });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message.',
          variant: 'destructive',
        });
      } else {
        setNewChatMessage('');
      }
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message.',
        variant: 'destructive',
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !currentUser || !currentConsultationId) {
      return;
    }

    setUploadingFiles(true);
    const file = event.target.files[0];
    const filePath = `${currentUser.id}/${currentConsultationId}/${Date.now()}_${file.name}`; // Store in client-id/consultation-id folder

    try {
      const { error: uploadError } = await supabase.storage
        .from('consultation_files') // Now exists in database
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast({
          title: 'Error',
          description: 'Failed to upload file.',
          variant: 'destructive',
        });
      } else {
        const { data: publicUrlData } = supabase.storage
          .from('consultation_files')
          .getPublicUrl(filePath);

        if (publicUrlData?.publicUrl) {
          // Save file info in consultation_files table using any type to bypass TypeScript
          const { error: dbError } = await (supabase as any).from('consultation_files').insert({
            consultation_id: currentConsultationId,
            uploaded_by: currentUser.id,
            file_name: file.name,
            file_url: publicUrlData.publicUrl,
            file_type: file.type,
            file_size: file.size,
          });

          if (dbError) {
            console.error('Error saving file info to DB:', dbError);
            toast({
              title: 'Error',
              description: 'Failed to save file information.',
              variant: 'destructive',
            });
          } else {
            toast({
              title: 'Success',
              description: 'File uploaded successfully!',
            });
          }
        }
      }
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload file.',
        variant: 'destructive',
      });
    }
    setUploadingFiles(false);
    event.target.value = ''; // Clear file input
  };

  const handleBookConsultation = async () => {
    if (!currentUser || !provider) {
      toast({
        title: 'Error',
        description: language === 'ar' ? 'الرجاء تسجيل الدخول لطلب استشارة.' : 'Please log in to book a consultation.',
        variant: 'destructive',
      });
      return;
    }

    setIsBookingConsultation(true);

    const calculatedRate = provider.hourly_rate; // Using provider's rate
    const consultationDuration = 60; // Default to 60 minutes for initial request
    const totalAmount = calculatedRate * (consultationDuration / 60.0);
    const platformFeePercentage = 15; // 15% platform fee
    const platformFee = totalAmount * (platformFeePercentage / 100.0);
    const providerAmount = totalAmount - platformFee;

    try {
      const { data: consultationData, error } = await supabase
        .from('paid_consultations')
        .insert({
          client_id: currentUser.id,
          provider_id: provider.id,
          subject: consultationSubject,
          description: consultationDescription,
          rate: calculatedRate,
          duration_minutes: consultationDuration,
          total_amount: totalAmount,
          platform_fee: platformFee,
          platform_fee_percentage: platformFeePercentage,
          provider_amount: providerAmount,
          status: 'pending',
          payment_status: 'pending',
        })
        .select()
        .single();

      setIsBookingConsultation(false);

      if (error || !consultationData) {
        console.error('Error booking consultation:', error);
        toast({
          title: 'Error',
          description: language === 'ar' ? 'فشل إرسال طلب الاستشارة.' : 'Failed to send consultation request.',
          variant: 'destructive',
        });
      } else {
        setConsultationRequestSent(true);
        setCurrentConsultationId(consultationData.id); // Store the new consultation ID
        toast({
          title: t.requestSent,
          description: t.consultationPending,
        });
        setActiveTab('chat'); // Automatically switch to chat after booking
      }
    } catch (error) {
      console.error('Error in handleBookConsultation:', error);
      setIsBookingConsultation(false);
      toast({
        title: 'Error',
        description: language === 'ar' ? 'فشل إرسال طلب الاستشارة.' : 'Failed to send consultation request.',
        variant: 'destructive',
      });
    }
  };

  const handleMockPayment = async () => {
    if (!currentConsultationId || !currentUser || !provider) return;

    setIsPaymentProcessing(true);

    // Simulate payment gateway interaction
    setTimeout(async () => {
      const paymentSuccessful = Math.random() > 0.1; // 90% chance of success

      if (paymentSuccessful) {
        // Update payment status in paid_consultations
        const { error } = await supabase
          .from('paid_consultations')
          .update({ payment_status: 'paid' })
          .eq('id', currentConsultationId);

        if (error) {
          console.error('Error updating payment status:', error);
          toast({
            title: 'Error',
            description: t.paymentFailed,
            variant: 'destructive',
          });
        } else {
          toast({
            title: t.paymentSuccess,
            description: language === 'ar' ? 'يمكنك الآن بدء الاستشارة!' : 'You can now start the consultation!',
          });
          // Potentially update consultation status to 'in_progress' or await provider acceptance
          // For simplicity, let's assume it's now ready for chat/service.
          // In a real app, 'in_progress' might be set by provider or a webhook.
          setShowReviewPrompt(true); // For demo, immediately show review prompt after 'payment'
        }
      } else {
        toast({
          title: t.paymentFailed,
          description: language === 'ar' ? 'حدث خطأ أثناء معالجة الدفع.' : 'An error occurred during payment processing.',
          variant: 'destructive',
        });
      }
      setIsPaymentProcessing(false);
    }, 2000); // Simulate network delay
  };

  const handleReviewSubmission = async () => {
    if (!currentUser || !provider || !currentConsultationId || reviewRating === 0) {
      toast({
        title: 'Error',
        description: language === 'ar' ? 'الرجاء إدخال تقييم.' : 'Please provide a rating.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingReview(true);
    const { error } = await supabase.from('consultation_reviews').insert({
      consultation_id: currentConsultationId,
      client_id: currentUser.id,
      provider_id: provider.id,
      rating: reviewRating,
      review_text: reviewText.trim() || null,
    });
    setIsSubmittingReview(false);

    if (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: language === 'ar' ? 'فشل إرسال التقييم.' : 'Failed to submit review.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: t.reviewSubmitted,
        description: language === 'ar' ? 'شكرا لتقييمك!' : 'Thank you for your review!',
      });
      setShowReviewPrompt(false); // Hide review prompt
      setReviewRating(0);
      setReviewText('');
      // Optionally, refresh provider data to show updated average rating
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-700">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 dark:text-blue-400" />
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">{t.loading}</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <HomeHeader user={null} language={language} />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center py-10 text-gray-600 dark:text-gray-400">
            <h1 className="text-3xl font-bold mb-4">{t.providerNotFound}</h1>
            <Button onClick={() => navigate('/providers')}>
              {language === 'ar' ? 'العودة إلى قائمة مقدمي الخدمات' : 'Back to Service Providers List'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <HomeHeader user={currentUser} language={language} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{t.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              <User className="inline-block mr-2 h-5 w-5 text-blue-500 dark:text-blue-400" />
              {provider.first_name} {provider.last_name}
            </p>
          </div>
          <BackButton />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" /> {t.info}
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2" disabled={!consultationRequestSent}>
              <MessageSquare className="h-4 w-4" /> {t.chat}
            </TabsTrigger>
            <TabsTrigger value="files" className="flex items-center gap-2" disabled={!consultationRequestSent}>
              <Upload className="h-4 w-4" /> {t.files}
            </TabsTrigger>
            <TabsTrigger value="book-service" className="flex items-center gap-2" disabled={consultationRequestSent}>
              <PlayCircle className="h-4 w-4" /> {t.bookService}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>{provider.first_name} {provider.last_name} ({provider.provider_type === 'lawyer' ? t.lawyer : t.judge})</CardTitle>
                <CardDescription className="dark:text-gray-400 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  {provider.rating.toFixed(2)} ({provider.total_consultations} {t.consultations})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{provider.bio}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-700 dark:text-gray-300 flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-blue-500" />
                    <strong>{t.specialties}:</strong> {provider.specialties?.join(', ') || 'N/A'}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-blue-500" />
                    <strong>{t.experience}:</strong> {provider.experience_years} {t.experience}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 flex items-center">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <strong>{t.hourlyRate}:</strong> {provider.hourly_rate.toFixed(2)} {provider.currency}
                  </p>
                </div>

                <Separator className="my-4 dark:bg-gray-700" />

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" /> {t.certificates}
                </h3>
                {provider.certificates && provider.certificates.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {provider.certificates.map(cert => (
                      <Card key={cert.id} className="dark:bg-gray-700 dark:border-gray-600">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">{cert.certificate_name}</CardTitle>
                          <CardDescription className="text-sm dark:text-gray-300">{t.issuedBy}: {cert.issued_by}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center text-sm dark:text-gray-400">
                          <div>
                            <p>{t.issueDate}: {new Date(cert.issue_date).toLocaleDateString()}</p>
                            <p>{t.expiryDate}: {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer">
                              {t.download}
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{t.noCertificates}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>{t.chat}</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {consultationRequestSent ?
                    (currentConsultationId ? t.consultationStartInfo : t.consultationPending)
                    : (language === 'ar' ? 'أرسل طلب استشارة لبدء المحادثة.' : 'Send a consultation request to start chatting.')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-64 overflow-y-auto border rounded-md p-4 bg-gray-50 dark:bg-gray-900 dark:border-gray-700 flex flex-col space-y-2">
                  {chatMessages.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">{language === 'ar' ? 'لا توجد رسائل بعد.' : 'No messages yet.'}</p>
                  ) : (
                    chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-2 rounded-lg max-w-[70%] ${msg.sender_id === currentUser?.id
                          ? 'bg-blue-500 text-white self-end'
                          : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-100 self-start'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <span className="text-xs opacity-80 mt-1 block">{new Date(msg.created_at).toLocaleTimeString()}</span>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder={t.typeMessage}
                    disabled={!consultationRequestSent || !currentConsultationId}
                    className="flex-1 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                    onKeyPress={(e) => { if (e.key === 'Enter') handleSendMessage(); }}
                  />
                  <Button onClick={handleSendMessage} disabled={!consultationRequestSent || !currentConsultationId || !newChatMessage.trim()}>
                    {t.sendMessage}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>{t.files}</CardTitle>
                <CardDescription className="dark:text-gray-400">
                  {consultationRequestSent ?
                    (language === 'ar' ? 'تحميل وعرض الملفات المتعلقة بالاستشارة.' : 'Upload and view files related to the consultation.')
                    : (language === 'ar' ? 'أرسل طلب استشارة لتبادل الملفات.' : 'Send a consultation request to exchange files.')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploadingFiles || !consultationRequestSent || !currentConsultationId}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
                {uploadingFiles && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.uploading}
                  </p>
                )}
                <div className="mt-4">
                  <h3 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {language === 'ar' ? 'الملفات المرفقة' : 'Attached Files'}
                  </h3>
                  {/* Placeholder for displaying attached files */}
                  <div className="bg-gray-50 dark:bg-gray-900 dark:border-gray-700 border rounded-md p-4 h-32 overflow-y-auto text-gray-500 dark:text-gray-400">
                    {/* Fetch and map files from consultation_files table here */}
                    <p>{language === 'ar' ? 'لا توجد ملفات مرفقة بعد.' : 'No files attached yet.'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="book-service">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle>{t.consultationRequestTitle}</CardTitle>
                <CardDescription className="dark:text-gray-400">{t.consultationRequestDesc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">{t.subject}</Label>
                  <Input
                    id="subject"
                    value={consultationSubject}
                    onChange={(e) => setConsultationSubject(e.target.value)}
                    placeholder={language === 'ar' ? 'عنوان موجز للاستشارة' : 'Brief subject of the consultation'}
                    disabled={isBookingConsultation}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">{t.description}</Label>
                  <Textarea
                    id="description"
                    value={consultationDescription}
                    onChange={(e) => setConsultationDescription(e.target.value)}
                    placeholder={language === 'ar' ? 'وصف تفصيلي لما تحتاجه' : 'Detailed description of your needs'}
                    rows={5}
                    disabled={isBookingConsultation}
                    className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                  />
                </div>
                <Button onClick={handleBookConsultation} disabled={isBookingConsultation || !consultationSubject.trim() || !consultationDescription.trim()} className="w-full">
                  {isBookingConsultation ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                    </>
                  ) : (
                    t.confirmBooking
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Payment Modal/Section - shown after consultation request is sent and approved (conceptually) */}
        {consultationRequestSent && !isPaymentProcessing && (
          <Dialog open={true} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-100">
              <DialogHeader>
                <DialogTitle>{t.paymentMethodTitle}</DialogTitle>
                <DialogDescription className="dark:text-gray-400">{t.paymentMethodDesc}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {language === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'} {provider?.hourly_rate?.toFixed(2)} SAR (approx. 1 hour)
                  </p>
                  <Button
                    onClick={handleMockPayment}
                    disabled={isPaymentProcessing}
                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
                  >
                    {isPaymentProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {language === 'ar' ? 'جاري الدفع...' : 'Processing Payment...'}
                      </>
                    ) : (
                      t.mockPayment
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Review Service Dialog - shown after service completion/payment */}
        {showReviewPrompt && !isPaymentProcessing && currentConsultationId && (
          <Dialog open={showReviewPrompt} onOpenChange={setShowReviewPrompt}>
            <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-100">
              <DialogHeader>
                <DialogTitle>{t.reviewService}</DialogTitle>
                <DialogDescription className="dark:text-gray-400">{t.howWasService}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer h-8 w-8 ${star <= reviewRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                      onClick={() => setReviewRating(star)}
                    />
                  ))}
                </div>
                <Textarea
                  placeholder={t.shareExperience}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={4}
                  className="dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowReviewPrompt(false)}>{t.cancel}</Button>
                <Button onClick={handleReviewSubmission} disabled={isSubmittingReview || reviewRating === 0}>
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {language === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}
                    </>
                  ) : (
                    t.submitReview
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ServiceProviderProfilePage;
