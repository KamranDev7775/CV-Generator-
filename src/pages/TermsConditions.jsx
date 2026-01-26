import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';

export default function TermsConditions() {
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
            Terms & Conditions
          </h1>

          <div className="prose prose-sm max-w-none text-gray-700 space-y-6">
            <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using ATS CV Generator, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">2. Use License</h2>
              <p>
                We grant you a limited, non-exclusive, non-transferable license to use our service for personal, non-commercial purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">3. Payment Terms</h2>
              <p>
                <strong>One-Time Payment:</strong> €1.99 for complete CV download (PDF + copyable text). This is a one-time payment with no recurring charges, no subscriptions, and no auto-renewal.
              </p>
              <p>
                All payments are processed securely through Stripe. Refunds are provided on a case-by-case basis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">4. User Responsibilities</h2>
              <p>
                You are responsible for:
              </p>
              <ul className="list-disc list-outside ml-5 space-y-1">
                <li>Providing accurate information</li>
                <li>Maintaining the confidentiality of your account</li>
                <li>Using the service in compliance with applicable laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">5. Intellectual Property</h2>
              <p>
                All content, features, and functionality of our service are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">6. Limitation of Liability</h2>
              <p>
                We provide our service "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">7. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-medium text-black mb-3">8. Contact Information</h2>
              <p>
                For questions about these Terms & Conditions, please contact us at support@atscvgenerator.com
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}