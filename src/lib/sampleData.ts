
// Sample service providers data for testing
export const sampleServiceProviders = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440001',
    specialization: 'family_law',
    experience_years: 10,
    hourly_rate: 150,
    bio: 'خبير في قانون الأسرة مع أكثر من 10 سنوات من الخبرة في القضايا المعقدة',
    languages: ['ar', 'en'],
    availability_hours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '15:00' }
    },
    is_verified: true,
    rating: 4.8,
    total_consultations: 245,
    consultation_types: ['video', 'chat', 'document_review'],
    education: [
      'بكالوريوس الحقوق - جامعة دمشق',
      'ماجستير قانون الأسرة - جامعة حلب'
    ],
    certifications: [
      'عضو نقابة المحامين السوريين',
      'شهادة معتمدة في الوساطة الأسرية'
    ],
    profile_image_url: '/placeholder.svg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    user_id: '550e8400-e29b-41d4-a716-446655440002',
    specialization: 'commercial_law',
    experience_years: 15,
    hourly_rate: 200,
    bio: 'محامي تجاري متخصص في قانون الشركات والعقود التجارية',
    languages: ['ar', 'en', 'fr'],
    availability_hours: {
      monday: { start: '08:00', end: '18:00' },
      tuesday: { start: '08:00', end: '18:00' },
      wednesday: { start: '08:00', end: '18:00' },
      thursday: { start: '08:00', end: '18:00' },
      friday: { start: '08:00', end: '16:00' }
    },
    is_verified: true,
    rating: 4.9,
    total_consultations: 320,
    consultation_types: ['video', 'chat', 'document_review', 'in_person'],
    education: [
      'بكالوريوس الحقوق - جامعة البعث',
      'ماجستير القانون التجاري - جامعة تشرين'
    ],
    certifications: [
      'عضو نقابة المحامين السوريين',
      'خبير معتمد في التحكيم التجاري'
    ],
    profile_image_url: '/placeholder.svg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    user_id: '550e8400-e29b-41d4-a716-446655440003',
    specialization: 'criminal_law',
    experience_years: 8,
    hourly_rate: 180,
    bio: 'محامي جنائي مختص في الدفاع عن المتهمين في القضايا الجنائية',
    languages: ['ar'],
    availability_hours: {
      monday: { start: '10:00', end: '19:00' },
      tuesday: { start: '10:00', end: '19:00' },
      wednesday: { start: '10:00', end: '19:00' },
      thursday: { start: '10:00', end: '19:00' },
      sunday: { start: '10:00', end: '16:00' }
    },
    is_verified: true,
    rating: 4.7,
    total_consultations: 156,
    consultation_types: ['video', 'chat'],
    education: [
      'بكالوريوس الحقوق - جامعة حلب',
      'دبلوم القانون الجنائي - المعهد العالي للقضاء'
    ],
    certifications: [
      'عضو نقابة المحامين السوريين',
      'شهادة في الدفاع الجنائي'
    ],
    profile_image_url: '/placeholder.svg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    user_id: '550e8400-e29b-41d4-a716-446655440004',
    specialization: 'labor_law',
    experience_years: 12,
    hourly_rate: 120,
    bio: 'مختص في قانون العمل وحقوق العمال والمنازعات العمالية',
    languages: ['ar', 'en'],
    availability_hours: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '15:00' },
      saturday: { start: '10:00', end: '14:00' }
    },
    is_verified: true,
    rating: 4.6,
    total_consultations: 189,
    consultation_types: ['video', 'chat', 'document_review'],
    education: [
      'بكالوريوس الحقوق - جامعة دمشق',
      'ماجستير قانون العمل - جامعة البعث'
    ],
    certifications: [
      'عضو نقابة المحامين السوريين',
      'خبير في قانون العمل والضمان الاجتماعي'
    ],
    profile_image_url: '/placeholder.svg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    user_id: '550e8400-e29b-41d4-a716-446655440005',
    specialization: 'real_estate_law',
    experience_years: 7,
    hourly_rate: 140,
    bio: 'محامي عقاري متخصص في عقود البيع والشراء والإيجار',
    languages: ['ar'],
    availability_hours: {
      monday: { start: '08:30', end: '16:30' },
      tuesday: { start: '08:30', end: '16:30' },
      wednesday: { start: '08:30', end: '16:30' },
      thursday: { start: '08:30', end: '16:30' },
      friday: { start: '08:30', end: '14:30' }
    },
    is_verified: true,
    rating: 4.5,
    total_consultations: 98,
    consultation_types: ['video', 'chat', 'document_review', 'in_person'],
    education: [
      'بكالوريوس الحقوق - جامعة تشرين',
      'دبلوم القانون العقاري - معهد الإدارة العامة'
    ],
    certifications: [
      'عضو نقابة المحامين السوريين',
      'خبير معتمد في التثمين العقاري'
    ],
    profile_image_url: '/placeholder.svg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Sample user profiles for the service providers
export const sampleUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'ahmed.family@lawyer.sy',
    user_metadata: {
      full_name: 'أحمد محمد الأسدي',
      phone: '+963911234567',
      city: 'دمشق'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    email: 'sara.commercial@lawyer.sy',
    user_metadata: {
      full_name: 'سارة خالد التجاري',
      phone: '+963912345678',
      city: 'حلب'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    email: 'omar.criminal@lawyer.sy',
    user_metadata: {
      full_name: 'عمر يوسف الجنائي',
      phone: '+963913456789',
      city: 'حمص'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440004',
    email: 'fatima.labor@lawyer.sy',
    user_metadata: {
      full_name: 'فاطمة علي العمالي',
      phone: '+963914567890',
      city: 'اللاذقية'
    }
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440005',
    email: 'hassan.realestate@lawyer.sy',
    user_metadata: {
      full_name: 'حسان محمود العقاري',
      phone: '+963915678901',
      city: 'طرطوس'
    }
  }
];
