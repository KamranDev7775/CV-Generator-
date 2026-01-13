import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function FAQSection() {
  const faqs = [
    {
      question: "Why single-column format?",
      answer: "Single-column CVs are machine-readable by Applicant Tracking Systems (ATS). Multi-column designs often break the parsing logic, causing your CV to be rejected before a human sees it. Our format ensures compatibility with corporate hiring software."
    },
    {
      question: "Is this ATS-friendly?",
      answer: "Yes. We avoid tables, text boxes, headers/footers, and complex layouts that confuse ATS parsers. The CV uses clean headings, standard sections, and plain text formatting—exactly what recruiters and ATS systems expect."
    },
    {
      question: "Is this good for Big4?",
      answer: "Absolutely. Big4 firms (Deloitte, PwC, KPMG, EY) and large corporations prefer minimalist, professional CVs. Our format matches their expectations: clean structure, bullet points, quantifiable achievements, and no unnecessary design."
    },
    {
      question: "Do I need an account?",
      answer: "Yes. An account lets you save your CV, make edits anytime, and manage your subscription. Registration is quick—just email and password."
    },
    {
      question: "Is the price final?",
      answer: "Yes. Trial plan: €2.99 for 14 days, then €6.99/month unless canceled. Monthly plan: €6.99/month. No hidden fees, no surprise charges. Cancel anytime from your dashboard."
    },
    {
      question: "Can I edit after downloading?",
      answer: "Yes. As long as your subscription is active, you can edit your CV unlimited times and regenerate it. Your data is saved in your account."
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