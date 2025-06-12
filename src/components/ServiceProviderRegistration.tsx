
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Scale, User, MapPin, CreditCard, FileText, CheckCircle } from 'lucide-react';

export const ServiceProviderRegistration = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    provider_type: '',
    first_name: '',
    last_name: '',
    specialties: [] as string[],
    activities: [] as string[],
    bio: '',
    experience_years: 0,
    hourly_rate: 0,
    account_number: '',
    bank_name: ''
  });

  const specialtyOptions = [
    'Commercial Law', 'Corporate Law', 'Family Law', 'Criminal Law',
    'Real Estate Law', 'Labor Law', 'Civil Law', 'Islamic Law',
    'International Law', 'Intellectual Property'
  ];

  const activityOptions = [
    'Legal Consultation', 'Document Drafting', 'Contract Review',
    'Legal Research', 'Mediation', 'Arbitration', 'Court Representation'
  ];

  const bankOptions = [
    'Al Rajhi Bank', 'SABB', 'National Commercial Bank', 'Riyad Bank',
    'Arab National Bank', 'Banque Saudi Fransi', 'SAMBA', 'Alinma Bank'
  ];

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      specialties: checked 
        ? [...prev.specialties, specialty]
        : prev.specialties.filter(s => s !== specialty)
    }));
  };

  const handleActivityChange = (activity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      activities: checked 
        ? [...prev.activities, activity]
        : prev.activities.filter(a => a !== activity)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication Required',
          description: 'Please sign in to register as a service provider',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('service_providers')
        .insert([{
          user_id: user.id,
          ...formData
        }]);

      if (error) throw error;

      toast({
        title: 'Registration Successful',
        description: 'Your application has been submitted for review. You will be notified once approved.',
      });

      // Reset form
      setFormData({
        provider_type: '',
        first_name: '',
        last_name: '',
        specialties: [],
        activities: [],
        bio: '',
        experience_years: 0,
        hourly_rate: 0,
        account_number: '',
        bank_name: ''
      });

    } catch (error) {
      console.error('Error submitting registration:', error);
      toast({
        title: 'Registration Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Scale className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Provider Registration</h1>
          <p className="text-gray-600 mt-2">
            Join our platform as a legal professional and start providing consultation services
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>Tell us about yourself and your professional background</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider_type">Professional Type *</Label>
                <Select value={formData.provider_type} onValueChange={(value) => setFormData(prev => ({...prev, provider_type: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lawyer">Lawyer</SelectItem>
                    <SelectItem value="judge">Judge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="experience_years">Years of Experience *</Label>
                <Input
                  id="experience_years"
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={(e) => setFormData(prev => ({...prev, experience_years: parseInt(e.target.value) || 0}))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="first_name">First Name *</Label>
                <Input
                  id="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData(prev => ({...prev, first_name: e.target.value}))}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData(prev => ({...prev, last_name: e.target.value}))}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Professional Biography</Label>
              <Textarea
                id="bio"
                placeholder="Describe your professional background, experience, and expertise..."
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                className="min-h-[120px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Specialties & Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Specialties & Services
            </CardTitle>
            <CardDescription>Select your areas of expertise and services you provide</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Legal Specialties</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {specialtyOptions.map((specialty) => (
                  <div key={specialty} className="flex items-center space-x-2">
                    <Checkbox
                      id={specialty}
                      checked={formData.specialties.includes(specialty)}
                      onCheckedChange={(checked) => handleSpecialtyChange(specialty, checked as boolean)}
                    />
                    <Label htmlFor={specialty} className="text-sm">{specialty}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Services Offered</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {activityOptions.map((activity) => (
                  <div key={activity} className="flex items-center space-x-2">
                    <Checkbox
                      id={activity}
                      checked={formData.activities.includes(activity)}
                      onCheckedChange={(checked) => handleActivityChange(activity, checked as boolean)}
                    />
                    <Label htmlFor={activity} className="text-sm">{activity}</Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Payment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Pricing & Payment Information
            </CardTitle>
            <CardDescription>Set your rates and provide payment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate (SAR) *</Label>
              <Input
                id="hourly_rate"
                type="number"
                min="0"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData(prev => ({...prev, hourly_rate: parseFloat(e.target.value) || 0}))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bank_name">Bank Name *</Label>
                <Select value={formData.bank_name} onValueChange={(value) => setFormData(prev => ({...prev, bank_name: value}))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your bank" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map((bank) => (
                      <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="account_number">Account Number *</Label>
                <Input
                  id="account_number"
                  value={formData.account_number}
                  onChange={(e) => setFormData(prev => ({...prev, account_number: e.target.value}))}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-y-4 text-center">
              <div className="space-y-4 w-full">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Your application will be reviewed within 2-3 business days</span>
                </div>
                
                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};
