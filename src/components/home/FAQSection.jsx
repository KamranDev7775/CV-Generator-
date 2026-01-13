import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "What format will my CV be in?",
      answer: "Your CV is generated in a clean, single-column layout optimized for professional applications. You receive it as a downloadable PDF and can also copy it as plain text for online application forms."
    },
    {
      question: "Is this CV compatible with Applicant Tracking Systems (ATS)?",
      answer: "Yes. We use a simple, machine-readable format without tables, graphics, or complex layouts that ATS systems struggle to parse. This ensures your CV passes automated screening and reaches human recruiters."
    },
    {
      question: "Can I edit my CV after generating it?",
      answer: "Absolutely. As long as your subscription is active, you can edit your CV unlimited times and regenerate it instantly. All your data is saved securely in your account."
    },
    {
      question: "Do I need to create an account?",
      answer: "Yes. An account is required to save your CV data, make future edits, and manage your subscription. Registration is quick and only requires an email and password."
    },
    {
      question: "Are there any hidden fees or subscription traps?",
      answer: "No. Our pricing is completely transparent. Trial: €2.99 for 14 days, then €6.99/month. Monthly: €6.99/month ongoing. No surprise charges, no hidden fees. You can cancel anytime from your dashboard."
    },
    {
      question: "What download formats are available?",
      answer: "Once you complete payment, you can download your CV as a PDF for applications and also copy the full text format for pasting into online forms or job portals."
    }
  ];

  return (
    <section className="px-6 md:px-12 lg:px-24 py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-light text-black mb-12 text-center">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="bg-white border border-gray-200 px-6">
              <AccordionTrigger className="text-left font-normal text-gray-900 hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}