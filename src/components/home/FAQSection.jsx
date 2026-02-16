import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "How does the CV generator work?",
    answer: "Simply fill in your information in our form, and we'll generate a professionally formatted, ATS-optimized CV. You can preview it before payment and download the final version as a PDF."
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
    question: "What makes this CV ATS-compatible?",
    answer: "Our CV uses a clean single-column format, standard fonts, clear section headers, and proper text structure that Applicant Tracking Systems can easily parse and extract information from."
  },
  {
    question: "Can I edit my CV after generating it?",
    answer: "Yes! You can edit all your information before finalizing. After payment, you receive both a PDF and copyable text version that you can edit in any document editor."
  },
  {
    question: "What format will I receive my CV in?",
    answer: "You'll receive your CV in two formats: a downloadable PDF (perfect for applications) and copyable text (for easy editing or pasting into online forms)."
  }
];

export default function FAQSection() {
  return (
    <section className="py-16 sm:py-20 md:py-28 bg-gradient-to-b from-white to-[#FAF9F7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12">
        {/* Heading */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <div className="flex justify-center items-center gap-3 mb-5">
            <div className="w-[2px] h-5 bg-gradient-to-b from-gray-400 to-purple-400"/>
            <span className="text-xs tracking-widest text-gray-500 uppercase font-semibold">
              FAQ
            </span>
          </div>
          <h2 className="text-black mb-4 sm:mb-5 text-3xl sm:text-4xl md:text-5xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0px', textAlign: 'center', verticalAlign: 'middle' }}>
            Frequently asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">questions</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed px-4">
            Everything you need to know about our AI resume builder
          </p>
        </div>

        {/* Two-column FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Accordion key={index} type="single" collapsible className="w-full">
              <AccordionItem
                value={`item-${index}`}
                className="bg-white rounded-2xl border-2 border-gray-200 px-6 hover:shadow-xl hover:border-purple-300 transition-all duration-300 mb-0"
              >
                <AccordionTrigger className="flex justify-between items-center text-left text-gray-900 py-6 hover:no-underline text-base sm:text-lg md:text-xl" style={{ fontFamily: 'Helvetica Neue, sans-serif', fontWeight: 400, letterSpacing: '0px', verticalAlign: 'middle' }}>
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-6 leading-relaxed text-base">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
}
