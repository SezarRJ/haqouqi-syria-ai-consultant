
import { ServiceProvider, Consultation } from './types';

export const mockProviders: ServiceProvider[] = [
  {
    id: '1',
    user_id: 'user1',
    provider_type: 'lawyer',
    first_name: 'Ahmed',
    last_name: 'Hassan',
    specialties: ['Commercial Law', 'Corporate Law'],
    activities: ['Legal Consultation', 'Document Drafting'],
    bio: 'Experienced corporate lawyer with 10+ years of practice.',
    experience_years: 12,
    hourly_rate: 300,
    currency: 'SAR',
    account_number: '1234567890',
    bank_name: 'Al Rajhi Bank',
    is_verified: true,
    is_active: true,
    rating: 4.8,
    total_consultations: 45,
    created_at: '2024-01-15T10:00:00Z'
  },
  {
    id: '2',
    user_id: 'user2',
    provider_type: 'judge',
    first_name: 'Fatima',
    last_name: 'Al-Zahra',
    specialties: ['Family Law', 'Civil Law'],
    activities: ['Legal Consultation', 'Mediation'],
    bio: 'Former family court judge with extensive mediation experience.',
    experience_years: 15,
    hourly_rate: 500,
    currency: 'SAR',
    account_number: '0987654321',
    bank_name: 'SABB',
    is_verified: false,
    is_active: true,
    rating: 4.9,
    total_consultations: 23,
    created_at: '2024-02-01T14:30:00Z'
  }
];

export const mockConsultations: Consultation[] = [
  {
    id: '1',
    client_id: 'client1',
    provider_id: '1',
    subject: 'Contract Review',
    status: 'completed',
    total_amount: 300,
    platform_fee: 45,
    provider_amount: 255,
    payment_status: 'paid',
    created_at: '2024-03-01T09:00:00Z',
    service_providers: {
      first_name: 'Ahmed',
      last_name: 'Hassan',
      provider_type: 'lawyer'
    }
  },
  {
    id: '2',
    client_id: 'client2',
    provider_id: '2',
    subject: 'Family Dispute Mediation',
    status: 'in_progress',
    total_amount: 500,
    platform_fee: 75,
    provider_amount: 425,
    payment_status: 'paid',
    created_at: '2024-03-05T11:30:00Z',
    service_providers: {
      first_name: 'Fatima',
      last_name: 'Al-Zahra',
      provider_type: 'judge'
    }
  }
];
