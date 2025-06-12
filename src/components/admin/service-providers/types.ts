
export interface ServiceProvider {
  id: string;
  user_id: string;
  provider_type: 'lawyer' | 'judge';
  first_name: string;
  last_name: string;
  specialties: string[];
  activities: string[];
  bio: string;
  experience_years: number;
  hourly_rate: number;
  currency: string;
  account_number: string;
  bank_name: string;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  total_consultations: number;
  created_at: string;
}

export interface Consultation {
  id: string;
  client_id: string;
  provider_id: string;
  subject: string;
  status: string;
  total_amount: number;
  platform_fee: number;
  provider_amount: number;
  payment_status: string;
  created_at: string;
  service_providers?: {
    first_name: string;
    last_name: string;
    provider_type: string;
  };
}
