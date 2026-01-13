import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <section className="px-6 md:px-12 lg:px-24 py-20">
        <div className="max-w-3xl mx-auto">
          <Link 
            to={createPageUrl('Home')}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors inline-block mb-8"
          >
            ← Back to home
          </Link>

          <h1 className="text-3xl md:text-4xl font-light text-black mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">1. Introduction</h2>
              <p>
                This Privacy Policy describes how ATS CV Generator ("we", "us", or "our") collects, uses, and shares your personal information when you use our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">2. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, including:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1">
                <li>Personal information (name, email, phone number)</li>
                <li>Professional information (work experience, education, skills)</li>
                <li>Payment information processed through Stripe</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">3. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1">
                <li>Generate your CV and cover letter</li>
                <li>Process your payments</li>
                <li>Provide customer support</li>
                <li>Improve our services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">4. Data Storage and Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">5. Your Rights</h2>
              <p>
                You have the right to access, correct, or delete your personal information. You may also object to or restrict certain processing of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">6. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at support@atscvgenerator.com
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}