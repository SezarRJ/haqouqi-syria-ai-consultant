
import React from 'react';
import { ServiceProviderRegistration } from '@/components/ServiceProviderRegistration';
import { BackButton } from '@/components/BackButton';

const ServiceProviderPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Become a Service Provider
            </h1>
            <p className="text-gray-600">
              Join our platform as a verified legal professional and start offering paid consultations
            </p>
          </div>
          <BackButton />
        </div>

        <ServiceProviderRegistration />
      </div>
    </div>
  );
};

export default ServiceProviderPage;
