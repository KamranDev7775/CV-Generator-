import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How does the CV generator work?",
    answer: "Simply fill in your information in our form, and we'll generate a professionally formatted, ATS-optimized CV. You can preview it before payment and download the final version as a PDF."
  },
  {
    question: "What makes this CV ATS-compatible?",
    answer: "Our CV uses a clean single-column format, standard fonts, clear section headers, and proper text structure that Applicant Tracking Systems can easily parse and extract information from."
  },
  {
    question: "Can I edit my CV after generating it?",
    answer: "Yes! You can edit all your information before finalizing. After payment, you receive both a PDF and copyable text version that you can edit in any document editor."
  },
  {
    question: "Do I need an account?",
    answer: "You need to create a simple account (just email) to save your progress and access your CV after payment. This also allows you to come back and generate updated versions."
  },
  {
    question: "What's the pricing?",
    answer: "One-time payment of €1.99 for your complete CV. No hidden fees, no subscriptions, no auto-renewals. Preview your CV for free before you pay."
  },
  {
    question: "What format will I receive my CV in?",
    answer: "You'll receive your CV in two formats: a downloadable PDF (perfect for applications) and copyable text (for easy editing or pasting into online forms)."
  }
];

export default function FAQSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about our CV generator
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 px-6 hover:shadow-lg transition-all duration-300"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-gray-900 hover:text-blue-600 py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}