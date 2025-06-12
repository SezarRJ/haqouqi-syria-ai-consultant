
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Upload, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceProviderFormData {
  provider_type: 'lawyer' | 'judge' | '';
  first_name: string;
  last_name: string;
  specialties: string[];
  activities: string[];
  bio: string;
  experience_years: number;
  hourly_rate: number;
  account_number: string;
  bank_name: string;
}

export const ServiceProviderRegistration = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ServiceProviderFormData>({
    provider_type: '',
    first_name: '',
    last_name: '',
    specialties: [],
    activities: [],
    bio: '',
    experience_years: 0,
    hourly_rate: 0,
    account_number: '',
    bank_name: '',
  });
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newActivity, setNewActivity] = useState('');
  const [certificates, setCertificates] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const specialtyOptions = [
    'Commercial Law',
    'Criminal Law',
    'Family Law',
    'Corporate Law',
    'Real Estate Law',
    'Labor Law',
    'Tax Law',
    'Constitutional Law',
    'Administrative Law',
    'Civil Law'
  ];

  const activityOptions = [
    'Legal Consultation',
    'Document Drafting',
    'Contract Review',
    'Court Representation',
    'Legal Research',
    'Mediation',
    'Arbitration',
    'Compliance Review'
  ];

  const handleInputChange = (field: keyof ServiceProviderFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };

  const addActivity = (activity: string) => {
    if (activity && !formData.activities.includes(activity)) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, activity]
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a !== activity)
    }));
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCertificates(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeCertificate = (index: number) => {
    setCertificates(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Temporarily using mock submission until database types are updated
      console.log('Service provider application data:', formData);
      console.log('Certificates to upload:', certificates.map(cert => cert.name));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: 'Success',
        description: 'Service provider application submitted successfully. It will be reviewed by our admin team.',
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
        bank_name: '',
      });
      setCertificates([]);

    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit service provider application',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <UserCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <CardTitle>Service Provider Registration</CardTitle>
            <CardDescription>
              Apply to become a verified service provider and offer paid consultations
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="provider_type">Provider Type</Label>
              <Select
                value={formData.provider_type}
                onValueChange={(value) => handleInputChange('provider_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select provider type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lawyer">Lawyer</SelectItem>
                  <SelectItem value="judge">Judge</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience_years">Experience (Years)</Label>
              <Input
                id="experience_years"
                type="number"
                min="0"
                value={formData.experience_years}
                onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Describe your professional background and expertise..."
              rows={4}
            />
          </div>

          {/* Specialties */}
          <div className="space-y-2">
            <Label>Legal Specialties</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newSpecialty} onValueChange={setNewSpecialty}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select specialty" />
                </SelectTrigger>
                <SelectContent>
                  {specialtyOptions.map(specialty => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => addSpecialty(newSpecialty)}
                disabled={!newSpecialty}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.specialties.map(specialty => (
                <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeSpecialty(specialty)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="space-y-2">
            <Label>Service Activities</Label>
            <div className="flex gap-2 mb-2">
              <Select value={newActivity} onValueChange={setNewActivity}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select activity" />
                </SelectTrigger>
                <SelectContent>
                  {activityOptions.map(activity => (
                    <SelectItem key={activity} value={activity}>
                      {activity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                onClick={() => addActivity(newActivity)}
                disabled={!newActivity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.activities.map(activity => (
                <Badge key={activity} variant="secondary" className="flex items-center gap-1">
                  {activity}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeActivity(activity)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <Label htmlFor="hourly_rate">Hourly Rate (SAR)</Label>
            <Input
              id="hourly_rate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourly_rate}
              onChange={(e) => handleInputChange('hourly_rate', parseFloat(e.target.value) || 0)}
              required
            />
          </div>

          {/* Banking Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bank_name">Bank Name</Label>
              <Input
                id="bank_name"
                value={formData.bank_name}
                onChange={(e) => handleInputChange('bank_name', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="account_number">Account Number</Label>
              <Input
                id="account_number"
                value={formData.account_number}
                onChange={(e) => handleInputChange('account_number', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Certificates Upload */}
          <div className="space-y-2">
            <Label>Professional Certificates</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleCertificateUpload}
                className="hidden"
                id="certificates"
              />
              <label htmlFor="certificates" className="cursor-pointer">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload certificates (PDF, JPG, PNG)
                  </p>
                </div>
              </label>
            </div>
            
            {certificates.length > 0 && (
              <div className="space-y-2">
                {certificates.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm">{cert.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertificate(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
